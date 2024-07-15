import { doFullCapacitorRebuild, ScreenOrientation } from "./app.config.utils";
import packageJson from "./package.json";

doFullCapacitorRebuild<typeof packageJson>({
  platform: process.argv[2] as `android` | `ios`,
  icon: {
    pathToAssetDirectory: `./src/assets`,
    backgroundColor: `#4caf50`,
  },
  screenOrientations: [ScreenOrientation.portrait],
  iosMobileProvisionPath: `./src/assets/MobileProvision.mobileprovision`,
  iosStoreKitPath: `./src/assets/StoreKit.storekit`,
  appleDevelopmentTeamId: `6BFWW87ZUF`,
  googleAuth: {
    jsonPath: `./src/assets/google-services.json`,
    plistPath: `./src/assets/GoogleService-Info.plist`,
  },
})
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
