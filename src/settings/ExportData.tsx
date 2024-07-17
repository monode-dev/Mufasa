import { Client } from "@/Clients/Client";
import { FuelType, mfs } from "@/model/DataModel";
import {
  Dialog,
  Txt,
  CircularProgressIndicator,
  popPage,
  pushPage,
  useProp,
  doWatch,
  Button,
  Row,
  theme,
} from "miwi";
import { Show } from "solid-js";
import { Filesystem, Directory, Encoding } from "@capacitor/filesystem";
import JSZip from "jszip";
import { Share } from "@capacitor/share";
import { devLog } from "@/Utils";
import { Tank } from "@/Tanks/Tank";
import { Delivery, SubDelivery } from "@/Deliveries/Delivery";

export function exportData() {
  pushPage(ExportingDataPopup, {});
}

function ExportingDataPopup() {
  const haveConfirmed = useProp(false);
  const haveExported = useProp(false);
  return (
    <Show
      when={haveConfirmed.value}
      fallback={
        <Dialog>
          <Txt>
            Are you sure you want to export a copy of all data on this phone?
            This might take a few minutes.
          </Txt>
          <Row>
            <Button
              outlined
              widthGrows
              onClick={() => {
                popPage();
              }}
            >
              Cancel
            </Button>
            <Button
              widthGrows
              onClick={() => {
                haveConfirmed.value = true;
              }}
            >
              Export
            </Button>
          </Row>
        </Dialog>
      }
    >
      <ExportingUi
        onFinished={() => {
          popPage();
        }}
      />
    </Show>
  );
}

export function ExportingUi(props: { onFinished: () => void }) {
  const haveWaitedForDownloads = useProp(false);
  let isExporting = false;
  doWatch(async () => {
    if (haveWaitedForDownloads.value) {
      if (isExporting) return;
      isExporting = true;
      try {
        await _exportData();
      } catch (e) {
        console.warn(e);
      }
      props.onFinished();
    } else {
      if (mfs.isDownloadingFromCloud === `maybe`) {
        haveWaitedForDownloads.value = true;
      }
    }
  });
  return (
    <Dialog doNotCloseOnClickOutside>
      <CircularProgressIndicator
        color={theme.palette.hint}
        diameter={3}
        thickness={0.25}
      />
      <Show
        when={haveWaitedForDownloads.value}
        fallback={
          <Txt hint widthGrows alignCenterLeft>
            <span>
              You have downloads in progress. We're waiting for them to finish.
              {` `}
              <div
                style={{
                  display: `inline-block`,
                  "vertical-align": `middle`,
                }}
              >
                <Txt
                  hint
                  underlineText
                  onClick={() => {
                    haveWaitedForDownloads.value = true;
                  }}
                >
                  Skip waiting
                </Txt>
              </div>
            </span>
          </Txt>
        }
      >
        <Txt hint widthGrows alignCenterLeft>
          Your data is being exported. This might take a few minutes.
        </Txt>
      </Show>
    </Dialog>
  );
}

async function _exportData() {
  try {
    const zipName = `ninety-percent-data-${Date.now()}`;
    devLog(`Exporting data to ${zipName}`);

    // Compile the data
    const compiledPath = `exports/${zipName}`;
    await Filesystem.mkdir({
      path: compiledPath,
      directory: Directory.Cache,
      recursive: true,
    });
    await Promise.all([
      FuelType.export(`${compiledPath}/FuelType`),
      Tank.export(`${compiledPath}/Tank`),
      Client.export(`${compiledPath}/Client`),
      SubDelivery.export(`${compiledPath}/SubDelivery`),
      Delivery.export(`${compiledPath}/Delivery`),
    ]);

    // Compile the zip
    const zip = new JSZip();
    await addFilesToZip(compiledPath, zip);
    async function addFilesToZip(path: string, zip: JSZip) {
      const files = await Filesystem.readdir({
        path,
        directory: Directory.Cache,
      });
      devLog(files.files.map((f) => f.name).join(`, `));
      await Promise.all(
        files.files.map(async (file) => {
          try {
            const filePath = `${path}/${file.name}`;
            const fileStat = await Filesystem.stat({
              path: filePath,
              directory: Directory.Cache,
            });
            if (fileStat.type === `directory`) {
              await addFilesToZip(filePath, zip.folder(file.name)!);
            } else {
              const isJson = filePath.endsWith(`.json`);
              const fileContent = await Filesystem.readFile({
                path: filePath,
                directory: Directory.Cache,
                encoding: isJson ? Encoding.UTF8 : undefined,
              });
              const data =
                typeof fileContent.data === `string`
                  ? fileContent.data
                  : await fileContent.data.text();
              await zip.file(file.name, data, {
                base64: !isJson,
              });
            }
          } catch (e) {
            console.warn(e);
          }
        }),
      );
    }

    // Save the zip
    const zipContent = await zip.generateAsync({
      type: `base64`,
    });
    const exportedZip = await Filesystem.writeFile({
      path: `exports/${zipName}/${zipName}.zip`,
      data: zipContent,
      directory: Directory.Cache,
    });

    // Share the zip
    await Share.share({ url: exportedZip.uri }).catch((e) => {
      console.warn(e);
    });
  } catch (e) {
    devLog(`Failed to export data: ${JSON.stringify(e, null, 2)}`);
    console.warn(e);
  }
}
