import fs from "fs";
import { execSync } from "child_process";
import * as xmljs from "xml-js";
import { createCanvas, loadImage } from "canvas";
import { project } from "xcode";

type Platform = `android` | `ios`;
const Platform = {
  android: `android`,
  ios: `ios`,
} as const;
export type ScreenOrientation =
  (typeof ScreenOrientation)[keyof typeof ScreenOrientation];
export const ScreenOrientation = {
  landscape: `landscape`,
  portrait: `portrait`,
} as const;
type CameraAccessConfig = {
  cameraAccessExplanation: string;
  galleryAccessExplanation: string;
  exportAccessExplanation: string | null;
};

export const doFullCapacitorRebuild = async <
  PackageJson extends {
    dependencies?: Record<string, string>;
  },
>(
  config: {
    platform: Platform;
    screenOrientations: [ScreenOrientation, ...ScreenOrientation[]];
    icon: {
      pathToAssetDirectory: string;
      backgroundColor: string;
    };
    iosStoreKitPath?: string;
    iosMobileProvisionPath: string;
    appleDevelopmentTeamId: string;
  } & (`@capacitor/camera` extends keyof PackageJson[`dependencies`]
    ? {
        camera: CameraAccessConfig;
      }
    : {
        camera?: CameraAccessConfig;
      }) &
    (`@codetrix-studio/capacitor-google-auth` extends keyof PackageJson[`dependencies`]
      ? {
          googleAuth: {
            jsonPath: string;
            plistPath: string;
          };
        }
      : {
          googleAuth?: {
            jsonPath: string;
            plistPath: string;
          };
        }),
) => {
  console.log(`Starting an ${config.platform} build...`);
  const distRootPath = `./dist`;
  const infoPlistPath = `./dist/ios/App/App/Info.plist`;

  // Do a fresh build of capacitor
  const cleanBuildCapacitor = doNow(() => {
    // Clear old build
    if (fs.existsSync(distRootPath)) {
      fs.rmSync(distRootPath, { recursive: true });
    }
    fs.mkdirSync(distRootPath);
    // Build web project
    execSync(`vite build`);
    // Add platform
    const addPlatform = doNow(() => {
      try {
        execSync(`npx cap add ${config.platform}`);
      } catch (e) {
        if (config.platform === Platform.ios) {
          execSync(`pod install --repo-update`, {
            cwd: `./dist/ios/App`,
          });
        }
      }
      execSync(`npx cap sync ${config.platform}`);
    });
  });

  const setAndroidSdkVersion = doNow(() => {
    if (config.platform === Platform.ios) return;
    const buildGradlePath = `./dist/android/variables.gradle`;
    const buildGradleLines = fs
      .readFileSync(buildGradlePath)
      .toString()
      .split(`\n`);
    buildGradleLines.splice(
      buildGradleLines.findIndex((line) => line.includes(`minSdkVersion`)),
      1,
      `    minSdkVersion = 22`,
    );
    buildGradleLines.splice(
      buildGradleLines.findIndex((line) => line.includes(`compileSdkVersion`)),
      1,
      `    compileSdkVersion = 34`,
    );
    buildGradleLines.splice(
      buildGradleLines.findIndex((line) => line.includes(`targetSdkVersion`)),
      1,
      `    targetSdkVersion = 34`,
    );
    fs.writeFileSync(buildGradlePath, buildGradleLines.join(`\n`));
  });

  // Open xcode project
  const { xcodeProject, xcodeProjectPath, xcodeBuildConfigs } = doNow(
    (): {
      xcodeProject: ReturnType<typeof project>;
      xcodeProjectPath: string;
      xcodeBuildConfigs: any;
    } => {
      if (config.platform === Platform.android) return {} as any;
      const xcodeProjectPath = `./dist/ios/App/App.xcodeproj/project.pbxproj`;
      const xcodeProject = project(xcodeProjectPath);
      xcodeProject.parseSync();
      const configList =
        xcodeProject.pbxXCConfigurationList()[
          xcodeProject.pbxTargetByName(`App`).buildConfigurationList
        ];
      const xcodeBuildConfigs = configList.buildConfigurations.map(
        (entry) => xcodeProject.pbxXCBuildConfigurationSection()[entry.value],
      );
      return {
        xcodeProject,
        xcodeProjectPath,
        xcodeBuildConfigs,
      };
    },
  );

  // Set the screen orientation
  const applyScreenOrientation = doNow(() => {
    if (config.platform === Platform.android) {
      const androidManifestPath = `./dist/android/App/src/main/AndroidManifest.xml`;
      // Get AndroidManifest.xml
      const androidManifest = xmljs.xml2js(
        fs.readFileSync(androidManifestPath).toString(),
      );
      // Apply screen orientation
      androidManifest.elements?.[0].elements
        ?.find((el) => el.name === `application`)
        ?.elements?.forEach((el) => {
          if (el.name === `activity`) {
            el.attributes[`android:screenOrientation`] =
              config.screenOrientations;
          }
        });
      // Write AndroidManifest.xml
      fs.writeFileSync(
        androidManifestPath,
        xmljs.js2xml(androidManifest, {
          compact: false,
          spaces: 2,
          indentAttributes: true,
        }),
      );
    } else {
      // Get Info.plist
      const infoPlist = xmljs.xml2js(fs.readFileSync(infoPlistPath).toString());
      // Apply screen orientation
      const applyScreenOrientation = doNow(() => {
        const dict = infoPlist.elements
          ?.find((el) => el.name === `plist`)
          ?.elements?.find((el) => el.name === `dict`);
        const orientationKeyIndex = dict?.elements?.findIndex(
          (el) =>
            el.name === `key` &&
            el.elements?.[0].text === `UISupportedInterfaceOrientations`,
        );
        dict.elements[orientationKeyIndex + 1].elements =
          config.screenOrientations.reduce((total, orientation) => {
            total.push({
              type: `element`,
              name: `string`,
              elements: [
                {
                  type: `text`,
                  text: {
                    [ScreenOrientation.landscape]: `UIInterfaceOrientationLandscapeLeft`,
                    [ScreenOrientation.portrait]: `UIInterfaceOrientationPortrait`,
                  }[orientation],
                },
              ],
            });
            total.push({
              type: `element`,
              name: `string`,
              elements: [
                {
                  type: `text`,
                  text: {
                    [ScreenOrientation.landscape]: `UIInterfaceOrientationLandscapeRight`,
                    [ScreenOrientation.portrait]: `UIInterfaceOrientationPortraitUpsideDown`,
                  }[orientation],
                },
              ],
            });
            return total;
          }, [] as any[]);
      });
      // Write Info.plist
      fs.writeFileSync(
        infoPlistPath,
        xmljs.js2xml(infoPlist, {
          compact: false,
          spaces: 2,
          indentAttributes: true,
        }),
      );
    }
  });

  // Codemagic versioning
  const codemagicVersioning = doNow(() => {
    if (config.platform === Platform.android) {
      const buildGradlePath = `./dist/android/App/build.gradle`;
      // Get build.gradle
      const buildGradleLines = fs
        .readFileSync(buildGradlePath)
        .toString()
        .split(`\n`);
      // At get version functions
      buildGradleLines.splice(
        1,
        0,
        `
          // get version code from the specified property argument "-PversionCode" during the build call
          def getMyVersionCode = { ->
            return project.hasProperty('versionCode') ? versionCode.toInteger() : 1
          }

          // get version name from the specified property argument "-PversionName" during the build call
          def getMyVersionName = { ->
            return project.hasProperty('versionName') ? versionName : "1.0"
          }`,
      );
      // Use the get versions functions
      buildGradleLines.splice(
        buildGradleLines.findIndex((line) =>
          line.includes(`        versionCode`),
        ),
        1,
        `        versionCode getMyVersionCode()`,
      );
      buildGradleLines.splice(
        buildGradleLines.findIndex((line) =>
          line.includes(`        versionName`),
        ),
        1,
        `        versionName getMyVersionName()`,
      );
      // Add signing config
      buildGradleLines.splice(
        buildGradleLines.findIndex((line) => line.includes(`    buildTypes {`)),
        0,
        `    signingConfigs {
        release {
            if (System.getenv()["CI"]) { // CI=true is exported by Codemagic
                storeFile file(System.getenv()["CM_KEYSTORE_PATH"])
                storePassword System.getenv()["CM_KEYSTORE_PASSWORD"]
                keyAlias System.getenv()["CM_KEY_ALIAS"]
                keyPassword System.getenv()["CM_KEY_PASSWORD"]
            } else {
                keyAlias keystoreProperties['keyAlias']
                keyPassword keystoreProperties['keyPassword']
                storeFile keystoreProperties['storeFile'] ? file(keystoreProperties['storeFile']) : null
                storePassword keystoreProperties['storePassword']
            }
        }
    }`,
      );
      // Enable minification
      buildGradleLines.splice(
        buildGradleLines.findIndex((line) =>
          line.includes(`            minifyEnabled`),
        ),
        1,
        `            minifyEnabled true`,
        `            shrinkResources true`,
        `            signingConfig signingConfigs.release`,
      );
      // Write build.gradle
      fs.writeFileSync(buildGradlePath, buildGradleLines.join(`\n`));
    } else {
      // Get Info.plist
      const infoPlist = xmljs.xml2js(fs.readFileSync(infoPlistPath).toString());
      // By pass ios deployment warnings
      infoPlist.elements
        ?.find((el) => el.name === `plist`)
        ?.elements?.find((el) => el.name === `dict`)
        .elements?.push(
          {
            type: `element`,
            name: `key`,
            elements: [{ type: `text`, text: `ITSAppUsesNonExemptEncryption` }],
          },
          {
            type: `element`,
            name: `false`,
          },
        );
      // Write Info.plist
      fs.writeFileSync(
        infoPlistPath,
        xmljs.js2xml(infoPlist, {
          compact: false,
          spaces: 2,
          indentAttributes: true,
        }),
      );
      // Copy mobile provision
      const copyMobileProvision = doNow(() => {
        fs.copyFileSync(
          config.iosMobileProvisionPath,
          `./dist/ios/App/App/MobileProvision.mobileprovision`,
        );
        const file = xcodeProject.addFile(
          `App/MobileProvision.mobileprovision`,
        )!;
        const fileBuildId = xcodeProject.generateUuid();
        // PBXBuildFile
        xcodeProject.addToPbxBuildFileSection({
          ...file,
          uuid: fileBuildId,
        });
        // PBXGroup
        xcodeProject.addToPbxGroup(
          file,
          xcodeProject.getFirstProject().firstProject.mainGroup,
        );
        // PBXResourcesBuildPhase
        xcodeProject.addToPbxResourcesBuildPhase({
          ...file,
          uuid: fileBuildId,
        });
      });
      // Update iOS Build Config
      xcodeBuildConfigs.forEach((buildConfig) => {
        buildConfig.buildSettings["CODE_SIGN_IDENTITY"] = `"Apple Development"`;
        // TODO: This is being written as undefined even though config.appleDevelopmentTeamId is not undefined
        buildConfig.buildSettings["DEVELOPMENT_TEAM"] =
          config.appleDevelopmentTeamId;
        //`A${config.appleDevelopmentTeamId.slice(1)}`;
        buildConfig.buildSettings["PROVISIONING_PROFILE_SPECIFIER"] = `""`;
        buildConfig.buildSettings["IPHONEOS_DEPLOYMENT_TARGET"] = `14.0`;
      });
    }
  });

  // Camera permissions
  const applyCameraPermissions = doNow(() => {
    if (config.camera === undefined) return;
    if (config.platform === Platform.android) {
      const androidManifestPath = `./dist/android/App/src/main/AndroidManifest.xml`;
      // Get AndroidManifest.xml
      const androidManifest = xmljs.xml2js(
        fs.readFileSync(androidManifestPath).toString(),
      );
      // Apply camera permissions
      const shouldAddExport =
        (config.camera?.exportAccessExplanation ?? null) !== null;
      androidManifest.elements?.[0].elements
        ?.find((el) => el.name === `application`)
        ?.elements?.push(
          {
            type: `element`,
            name: `uses-permission`,
            attributes: {
              "android:name": `android.permission.READ_MEDIA_IMAGES`,
            },
          },
          ...(shouldAddExport
            ? [
                {
                  type: `element`,
                  name: `uses-permission`,
                  attributes: {
                    "android:name": `android.permission.READ_EXTERNAL_STORAGE`,
                  },
                },
                {
                  type: `element`,
                  name: `uses-permission`,
                  attributes: {
                    "android:name": `android.permission.WRITE_EXTERNAL_STORAGE`,
                  },
                },
              ]
            : []),
        );
      // Write AndroidManifest.xml
      fs.writeFileSync(
        androidManifestPath,
        xmljs.js2xml(androidManifest, {
          compact: false,
          spaces: 2,
          indentAttributes: true,
        }),
      );
    } else {
      // Get Info.plist
      const infoPlist = xmljs.xml2js(fs.readFileSync(infoPlistPath).toString());
      // Apply camera permissions
      infoPlist.elements
        ?.find((el) => el.name === `plist`)
        ?.elements?.find((el) => el.name === `dict`)
        .elements?.push(
          {
            type: `element`,
            name: `key`,
            elements: [{ type: `text`, text: `NSCameraUsageDescription` }],
          },
          {
            type: `element`,
            name: `string`,
            elements: [
              { type: `text`, text: config.camera.cameraAccessExplanation },
            ],
          },
          {
            type: `element`,
            name: `key`,
            elements: [
              { type: `text`, text: `NSPhotoLibraryUsageDescription` },
            ],
          },
          {
            type: `element`,
            name: `string`,
            elements: [
              { type: `text`, text: config.camera.galleryAccessExplanation },
            ],
          },
          {
            type: `element`,
            name: `key`,
            elements: [
              { type: `text`, text: `NSPhotoLibraryAddUsageDescription` },
            ],
          },
          {
            type: `element`,
            name: `string`,
            elements: [
              { type: `text`, text: config.camera.exportAccessExplanation },
            ],
          },
        );
      // Write Info.plist
      fs.writeFileSync(
        infoPlistPath,
        xmljs.js2xml(infoPlist, {
          compact: false,
          spaces: 2,
          indentAttributes: true,
        }),
      );
    }
  });

  // Set up icon and splash screen
  const setupIconAndSplash = await doNow(async () => {
    execSync(
      `npx @capacitor/assets generate --assetPath \"${
        config.icon.pathToAssetDirectory
      }\" --iconBackgroundColor \"${
        config.icon.backgroundColor
      }\" --splashBackgroundColor \"${
        config.icon.backgroundColor
      }\" --splashBackgroundColorDark \"${
        config.icon.backgroundColor
      }\" --logoSplashScale ${
        config.platform === Platform.ios ? `0.4` : `0.25`
      } ${
        config.platform === Platform.ios
          ? `--iosProject \"./dist/ios/App\" `
          : `--androidProject \"./dist/android\"`
      } --${config.platform}`,
    );

    if (config.platform === Platform.android) {
      fs.writeFileSync(
        `./dist/android/App/src/main/res/drawable/custom_splash.xml`,
        `<?xml version="1.0" encoding="utf-8"?>
<layer-list xmlns:android="http://schemas.android.com/apk/res/android">
    <item
        android:background="@drawable/splash"
        android:scaleType="centerCrop" />
</layer-list>`,
      );
      // Update styles.xml
      const stylesPath = `./dist/android/App/src/main/res/values/styles.xml`;
      const styles = xmljs.xml2js(fs.readFileSync(stylesPath).toString());
      const resourcesList = styles.elements?.[0].elements ?? [];
      resourcesList.splice(
        resourcesList.findIndex(
          (el) =>
            el.name === `style` &&
            el.attributes?.name === `AppTheme.NoActionBarLaunch`,
        ),
        1,
        {
          type: `element`,
          name: `style`,
          attributes: {
            name: `AppTheme.NoActionBarLaunch`,
            parent: `AppTheme.NoActionBar`,
          },
          elements: [
            {
              type: `element`,
              name: `item`,
              attributes: {
                name: `android:windowBackground`,
              },
              elements: [
                {
                  type: `text`,
                  text: `@drawable/custom_splash`,
                },
              ],
            },
          ],
        },
      );
      fs.writeFileSync(
        stylesPath,
        xmljs.js2xml(styles, {
          compact: false,
          spaces: 2,
          indentAttributes: false,
        }),
      );
    } else {
      const splashPathBase = `./dist/ios/App/App/Assets.xcassets/Splash.imageset`;
      // Delete the capacitor splash screens
      fs.readdirSync(splashPathBase)
        .filter((file) => file.startsWith(`splash-`) && file.endsWith(`.png`))
        .forEach((file) => {
          fs.rmSync(`${splashPathBase}/${file}`);
        });
      await makeIphoneSplashScreen({
        width: 375,
        height: 812,
        iconSize: 114,
        tag: `1x`,
      });
      await makeIphoneSplashScreen({
        width: 750,
        height: 1334,
        iconSize: 185,
        tag: `2x`,
      });
      await makeIphoneSplashScreen({
        width: 1125,
        height: 2436,
        iconSize: 380,
        tag: `3x`,
      });
      async function makeIphoneSplashScreen(props: {
        width: number;
        height: number;
        iconSize: number;
        tag: string;
      }) {
        const splashNameLight = `iphone${props.tag}.png`;
        const splashNameDark = `iphone${props.tag}-dark.png`;
        const splashPathLight = `${splashPathBase}/${splashNameLight}`;
        const splashPathDark = `${splashPathBase}/${splashNameDark}`;
        const iconX = (props.width - props.iconSize) / 2;
        const iconY = (props.height - props.iconSize) / 2;
        const canvas = createCanvas(props.width, props.height);
        const ctx = canvas.getContext(`2d`);
        ctx.fillStyle = config.icon.backgroundColor;
        ctx.fillRect(0, 0, props.width, props.height);
        // Load the icon
        let haveSaved = false;
        loadImage(`${config.icon.pathToAssetDirectory}/icon.png`).then(
          (image) => {
            ctx.drawImage(image, iconX, iconY, props.iconSize, props.iconSize);
            const savePath = splashPathLight;
            const stream = canvas
              .createPNGStream()
              .pipe(fs.createWriteStream(savePath));
            stream.on(`finish`, () => {
              haveSaved = true;
            });
          },
        );
        while (!haveSaved) {
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
        fs.writeFileSync(splashPathDark, fs.readFileSync(splashPathLight));
        // Update Contents.json
        const contentsJsonPath = `${splashPathBase}/Contents.json`;
        const contentsJson = JSON.parse(
          fs.readFileSync(contentsJsonPath).toString(),
        );
        contentsJson.images.push(
          {
            idiom: "iphone",
            filename: splashNameLight,
            scale: props.tag,
          },
          {
            appearances: [
              {
                appearance: "luminosity",
                value: "dark",
              },
            ],
            idiom: "iphone",
            scale: props.tag,
            filename: splashNameDark,
          },
        );
        fs.writeFileSync(
          contentsJsonPath,
          JSON.stringify(contentsJson, null, 2),
        );
      }
      // Add background color
      const splashBackgroundColorPath = `./dist/ios/App/App/Assets.xcassets/SplashBackgroundColor.colorset`;
      fs.mkdirSync(splashBackgroundColorPath);
      fs.writeFileSync(
        `${splashBackgroundColorPath}/Contents.json`,
        JSON.stringify(
          {
            colors: [
              {
                color: {
                  "color-space": "srgb",
                  components: {
                    alpha: "1.000",
                    red: `0x${config.icon.backgroundColor.slice(1, 3).toUpperCase()}`,
                    green: `0x${config.icon.backgroundColor.slice(3, 5).toUpperCase()}`,
                    blue: `0x${config.icon.backgroundColor.slice(5, 7).toUpperCase()}`,
                  },
                },
                idiom: "universal",
              },
              {
                appearances: [
                  {
                    appearance: "luminosity",
                    value: "dark",
                  },
                ],
                color: {
                  "color-space": "srgb",
                  components: {
                    alpha: "1.000",
                    red: `0x${config.icon.backgroundColor.slice(1, 3).toUpperCase()}`,
                    green: `0x${config.icon.backgroundColor.slice(3, 5).toUpperCase()}`,
                    blue: `0x${config.icon.backgroundColor.slice(5, 7).toUpperCase()}`,
                  },
                },
                idiom: "universal",
              },
            ],
            info: {
              author: "xcode",
              version: 1,
            },
          },
          null,
          2,
        ),
      );
      fs.writeFileSync(
        `./dist/ios/App/App/Base.lproj/LaunchScreen.storyboard`,
        `<?xml version="1.0" encoding="UTF-8"?>
      <document type="com.apple.InterfaceBuilder3.CocoaTouch.Storyboard.XIB" version="3.0" toolsVersion="32700.99.1234" targetRuntime="iOS.CocoaTouch" propertyAccessControl="none" useAutolayout="YES" launchScreen="YES" useTraitCollections="YES" useSafeAreas="YES" colorMatched="YES" initialViewController="01J-lp-oVM">
          <device id="retina4_7" orientation="portrait" appearance="light"/>
          <dependencies>
              <deployment identifier="iOS"/>
              <plugIn identifier="com.apple.InterfaceBuilder.IBCocoaTouchPlugin" version="22685"/>
              <capability name="documents saved in the Xcode 8 format" minToolsVersion="8.0"/>
          </dependencies>
          <scenes>
              <!--View Controller-->
              <scene sceneID="EHf-IW-A2E">
                  <objects>
                      <viewController id="01J-lp-oVM" sceneMemberID="viewController">
                          <imageView key="view" userInteractionEnabled="NO" contentMode="scaleAspectFill" horizontalHuggingPriority="251" verticalHuggingPriority="251" image="Splash" id="snD-IY-ifK">
                              <rect key="frame" x="0.0" y="0.0" width="375" height="667"/>
                              <autoresizingMask key="autoresizingMask"/>
                              <color key="backgroundColor" white="1" alpha="1" colorSpace="custom" customColorSpace="genericGamma22GrayColorSpace"/>
                          </imageView>
                      </viewController>
                      <placeholder placeholderIdentifier="IBFirstResponder" id="iYj-Kq-Ea1" userLabel="First Responder" sceneMemberID="firstResponder"/>
                  </objects>
                  <point key="canvasLocation" x="53" y="375"/>
              </scene>
          </scenes>
          <resources>
              <image name="Splash" width="375" height="667"/>
          </resources>
      </document>`,
      );
    }
  });

  // Google Auth
  const applyGoogleAuth = doNow(() => {
    if (config.googleAuth === undefined) return;
    if (config.platform === Platform.android) {
      const googleServicesJsonPath = `./dist/android/app/google-services.json`;
      fs.copyFileSync(config.googleAuth.jsonPath, googleServicesJsonPath);
    } else {
      const googleServiceInfoPlistPath = `./dist/ios/App/App/GoogleService-Info.plist`;
      fs.copyFileSync(config.googleAuth.plistPath, googleServiceInfoPlistPath);
      // Parse REVERSED_CLIENT_ID
      const googleServiceInfoPlist = xmljs.xml2js(
        fs.readFileSync(googleServiceInfoPlistPath).toString(),
      );
      const googleServicesDict = googleServiceInfoPlist.elements
        ?.find((el) => el.name === `plist`)
        ?.elements?.find((el) => el.name === `dict`);
      const reversedClientIdIndex =
        googleServicesDict.elements?.findIndex(
          (el) =>
            el.name === `key` && el.elements?.[0].text === `REVERSED_CLIENT_ID`,
        ) + 1;
      const reversedClientId =
        googleServicesDict.elements?.[reversedClientIdIndex].elements?.[0].text;
      // Add CFBundleURLTypes to Info.plist
      const infoPlist = xmljs.xml2js(fs.readFileSync(infoPlistPath).toString());
      infoPlist.elements
        ?.find((el) => el.name === `plist`)
        ?.elements?.find((el) => el.name === `dict`)
        .elements?.push(
          {
            type: `element`,
            name: `key`,
            elements: [{ type: `text`, text: `CFBundleURLTypes` }],
          },
          {
            type: `element`,
            name: `array`,
            elements: [
              {
                type: `element`,
                name: `dict`,
                elements: [
                  {
                    type: `element`,
                    name: `key`,
                    elements: [{ type: `text`, text: `CFBundleTypeRole` }],
                  },
                  {
                    type: `element`,
                    name: `string`,
                    elements: [
                      {
                        type: `text`,
                        text: `Editor`,
                      },
                    ],
                  },
                  {
                    type: `element`,
                    name: `key`,
                    elements: [{ type: `text`, text: `CFBundleURLName` }],
                  },
                  {
                    type: `element`,
                    name: `string`,
                    elements: [
                      {
                        type: `text`,
                        text: `REVERSED_CLIENT_ID`,
                      },
                    ],
                  },
                  {
                    type: `element`,
                    name: `key`,
                    elements: [{ type: `text`, text: `CFBundleURLSchemes` }],
                  },
                  {
                    type: `element`,
                    name: `array`,
                    elements: [
                      {
                        type: `element`,
                        name: `string`,
                        elements: [
                          {
                            type: `text`,
                            text: reversedClientId,
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        );
      // Write Info.plist
      fs.writeFileSync(
        infoPlistPath,
        xmljs.js2xml(infoPlist, {
          compact: false,
          spaces: 2,
          indentAttributes: true,
        }),
      );
    }
  });

  // Apple Auth
  const applyAppleAuth = doNow(() => {
    if (config.platform === Platform.android) return;
    // Add file
    const appEntitlementsPath = `./dist/ios/App/App/Entitlements.entitlements`;
    const appEntitlementsIosPath = `App/Entitlements.entitlements`;
    fs.writeFileSync(
      appEntitlementsPath,
      `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>com.apple.developer.applesignin</key>
	<array>
		<string>Default</string>
	</array>
</dict>
</plist>`,
    );
    const entitlementsFile = xcodeProject.addFile(appEntitlementsIosPath)!;
    (entitlementsFile as any).includeInIndex = undefined;
    // Add to PBX Group
    const appGroupKey = Object.entries(
      xcodeProject.hash.project.objects["PBXGroup"],
    ).find(([key, group]: [string, any]) => group.path === `App`)?.[0];
    xcodeProject.addToPbxGroup(entitlementsFile, appGroupKey);
    // Update Build Config
    xcodeBuildConfigs.forEach((buildConfig) => {
      buildConfig.buildSettings["CODE_SIGN_ENTITLEMENTS"] =
        appEntitlementsIosPath;
    });
  });

  // IAP
  const applyIap = doNow(() => {
    if (config.platform === Platform.android) return;
    if (config.iosStoreKitPath !== undefined) {
      // Add file
      fs.copyFileSync(
        config.iosStoreKitPath,
        `./dist/ios/App/App/StoreKit.storekit`,
      );
      const storeKitFile = xcodeProject.addFile(`App/StoreKit.storekit`)!;
      // PBXBuildFile
      const storKitBuildFileId = xcodeProject.generateUuid();
      xcodeProject.addToPbxBuildFileSection({
        ...storeKitFile,
        uuid: storKitBuildFileId,
      });
      // PBXGroup
      xcodeProject.addToPbxGroup(
        storeKitFile,
        xcodeProject.getFirstProject().firstProject.mainGroup,
      );
      // PBXResourcesBuildPhase
      xcodeProject.addToPbxResourcesBuildPhase({
        ...storeKitFile,
        uuid: storKitBuildFileId,
      });
    }
  });

  // Save xcode project
  if (config.platform === Platform.ios) {
    fs.writeFileSync(
      xcodeProjectPath,
      xcodeProject.writeSync({
        omitEmptyValues: true,
      }),
    );
  }
};

const doNow = <T>(doFunc: () => T) => doFunc();
