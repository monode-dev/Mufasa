import {
  useProp,
  Box,
  Txt,
  doNow,
  Row,
  Icon,
  pushPage,
  Column,
  doWatch,
  strokeTexture,
  theme,
  exists,
} from "miwi";
import { SimplePage } from "@/components/SimplePage";
import { SimpleBody } from "@/components/SimpleBody";
import { App } from "@capacitor/app";
import { Show } from "solid-js";
import { Capacitor } from "@capacitor/core";
import {
  mdiAccountCogOutline,
  mdiAccountGroupOutline,
  mdiCalculator,
  mdiClose,
  mdiFuel,
  mdiOfficeBuildingOutline,
} from "@mdi/js";
import { ConfirmationPopUp } from "@/components/ConfirmationPopUp";
import { autoSavingProp, devLogs } from "@/utils";
import { AccountSettingsPage } from "./AccountSettingsPage";
import { TeamSettingsPage } from "./TeamSettingsPage";
import { InlineAppBar } from "@/components/InlineAppBar";
import { FuelsPage } from "../Fuel/FuelsPage";
import ClientsPage from "@/Clients/ClientsPage";

export const developerModeEnabled = autoSavingProp<boolean>(
  `developerModeEnabled`,
  false,
);

export function SettingsPage() {
  const appVersion = doNow(() => {
    const appVersion = useProp<string | null>(null);
    if (Capacitor.isNativePlatform()) {
      App.getInfo().then((info) => {
        appVersion.value = info.version;
      });
    } else {
      appVersion.value = `0.42`;
    }
    return appVersion;
  });
  const versionClickCount = useProp(0);
  doWatch(
    () => {
      if (
        !developerModeEnabled.value &&
        versionClickCount.value > 0 &&
        versionClickCount.value % 10 === 0
      ) {
        pushPage(ConfirmationPopUp, {
          text: `Do you want to enable developer mode?`,
          onYes: () => {
            developerModeEnabled.value = true;
          },
        });
      }
    },
    {
      on: [versionClickCount],
    },
  );

  return (
    <SimplePage>
      <InlineAppBar name={`Settings`} />

      <SimpleBody>
        {/* SECTION: Options */}
        {/* TODO */}
        <SettingsOption
          icon={mdiOfficeBuildingOutline}
          text={`Clients`}
          onClick={() => pushPage(ClientsPage, {})}
        />
        <SettingsOption
          icon={mdiFuel}
          text={`Fuels`}
          onClick={() => pushPage(FuelsPage, {})}
        />
        {/* TODO */}
        <SettingsOption icon={mdiCalculator} text={`Calculators`} />
        <SettingsOption
          icon={mdiAccountGroupOutline}
          text={`Team`}
          onClick={() => pushPage(TeamSettingsPage, {})}
        />
        <SettingsOption
          icon={mdiAccountCogOutline}
          text={`Account`}
          onClick={() => pushPage(AccountSettingsPage, {})}
        />

        {/* SECTION: Developer Logs */}
        <Show when={developerModeEnabled.value}>
          <Box />
          <Column padBetween={1 / 4}>
            <Row>
              <Icon iconPath={mdiClose} stroke={`transparent`} scale={1.125} />
              <Txt h2 singleLine widthGrows alignCenter>
                Dev Logs
              </Txt>
              <Icon
                iconPath={mdiClose}
                scale={1.125}
                onClick={() =>
                  pushPage(ConfirmationPopUp, {
                    text: `Are you sure you want to leave developer mode?`,
                    onYes: () => {
                      developerModeEnabled.value = false;
                      versionClickCount.value = 0;
                    },
                  })
                }
              />
            </Row>
            <Box
              outlineColor={strokeTexture}
              outlineSize={1 / 8}
              height={10}
              overflowYScrolls
              pad={3 / 4}
              cornerRadius={1 / 2}
              alignTopCenter
            >
              <Txt widthGrows>{devLogs.value}</Txt>
            </Box>
          </Column>
        </Show>

        {/* NOTE: Putting this in the column throws off rendering when this box has no height. */}
        <Box heightGrows />

        {/* SECTION: Footer */}
        <Column padBetween={0.25}>
          <Txt
            hint
            widthGrows
            alignCenter
            onClick={() =>
              ((window as any).location = `mailto:${encodeURIComponent(
                `info@tke.us`,
              )}?Subject=${encodeURIComponent(`About Ninety Percent`)}`)
            }
          >
            <span>
              Support <u>info@tke.us</u>
            </span>
          </Txt>
          <Show when={appVersion.value !== null}>
            <Txt
              hint
              widthGrows
              alignCenter
              onClick={() => (versionClickCount.value += 1)}
            >{`App Version ${appVersion.value}`}</Txt>
          </Show>
        </Column>
      </SimpleBody>
    </SimplePage>
  );
}

function SettingsOption(props: {
  icon: string;
  text: string;
  onClick?: () => void;
}) {
  return (
    <Row
      padBetween={0.5}
      onClick={props.onClick}
      stroke={!exists(props.onClick) ? theme.palette.hint : undefined}
    >
      <Icon scale={1.125} iconPath={props.icon} />
      <Txt widthGrows alignLeft singleLine>
        {props.text}
      </Txt>
    </Row>
  );
}
