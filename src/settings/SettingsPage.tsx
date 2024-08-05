import {
  useProp,
  Box,
  Txt,
  doNow,
  exists,
  Row,
  Icon,
  pushPage,
  useFormula,
  Column,
  doWatch,
  Align,
  strokeTexture,
  theme,
  SortableColumn,
  FloatSort,
} from "miwi";
import { InlineAppBar } from "@/components/InlineAppBar";
import { pagePadding, SimplePage } from "@/components/SimplePage";
import { SimpleBody } from "@/components/SimpleBody";
import { App } from "@capacitor/app";
import { For, Show } from "solid-js";
import {
  premiumEnabled,
  isSubscribing,
  store,
  FuelType,
  mfs,
} from "@/model/DataModel";
import { inviteTeamMember, memberLimit } from "@/model/Team";
import { Capacitor } from "@capacitor/core";
import {
  mdiAccountCogOutline,
  mdiAccountMultiplePlusOutline,
  mdiClose,
  mdiDotsVertical,
  mdiInformationVariantCircleOutline,
  mdiPlus,
} from "@mdi/js";
import { ConfirmationPopUp } from "@/components/ConfirmationPopUp";
import { PrivacyPolicyPage } from "./PrivacyPolicyPage";
import { FloatingActionButton } from "@/components/Floating";
import { autoSavingProp, devLogs } from "@/utils";
import { HiddenOption, HiddenOptions } from "@/components/HiddenOptions";
import { SimpleDocEntry } from "@/components/SimpleDocEntry";
import { SubscribePrompt, withLimitConfirmation } from "@/model/LimitUi";
import { exportData } from "./ExportData";
import { deleteAccount, deleteTeam } from "./DeleteAccountOrTeam";
import { openCreateFuelTypeDialog } from "@/Fuel/CreateFuelTypeDialog";
import FuelTypeEntry from "@/Fuel/FuelTypeEntry";
import { Match, Switch } from "solid-js/web";
import { InfoCard } from "@/components/InfoCard";

export const developerModeEnabled = autoSavingProp<boolean>(
  `developerModeEnabled`,
  false,
);
export const openTermsOfUse = () =>
  window.open(
    `https://www.apple.com/legal/internet-services/itunes/dev/stdeula/`,
    `_blank`,
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

  const isOwner = useFormula(() => mfs.user.workspace?.role === `owner`);

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

  const emailIsValid = (email: string | null | undefined) =>
    exists(email) && email.trim().length > 0;
  const showInviteMember = useFormula(
    () => isOwner.value && premiumEnabled.value,
  );

  return (
    <SimplePage
      floating={
        <Show when={showInviteMember.value}>
          <Column padBetween={0}>
            <FloatingActionButton
              // stroke={premiumEnabled.value ? undefined : theme.palette.error}
              icon={mdiAccountMultiplePlusOutline}
              scale={1.85}
              onClick={() =>
                withLimitConfirmation({
                  count: memberLimit.count,
                  limit: memberLimit.max,
                  labelSingular: `team member`,
                  labelPlural: `team members`,
                  createPresentTense: `add`,
                  createPastTense: `got`,
                  action: () => inviteTeamMember(),
                })
              }
            />
          </Column>
        </Show>
      }
    >
      <InlineAppBar
        name={`Account`}
        right={
          <Icon
            iconPath={mdiInformationVariantCircleOutline}
            scale={1.5}
            onClick={() => pushPage(InfoCard, { info: `` })}
          />
        }
      />
      <Box
        minWidth={10}
        maxWidth={25}
        padTop={0}
        padAround={pagePadding}
        padBetween={1}
        heightShrinks
      >
        {/* SECTION: Account Options */}
        <Show when={mfs.user.isSignedIn}>
          <Row padBetween={0.5}>
            <Txt
              singleLine
              widthGrows
              alignCenterLeft
              stroke={
                emailIsValid(mfs.user.email) ? undefined : theme.palette.hint
              }
            >
              {emailIsValid(mfs.user.email) ? mfs.user.email : `Unknown Email!`}
            </Txt>
            <HiddenOptions
              scale={1.125}
              icon={
                mfs.user.workspace?.isOwner
                  ? mdiAccountCogOutline
                  : mdiAccountCogOutline
              }
            >
              <HiddenOption
                text={`Sign Out`}
                singleLine
                onClick={() => mfs.user.signOut?.()}
              />
              <HiddenOption
                text={`Terms of Use`}
                singleLine
                onClick={openTermsOfUse}
              />
              <HiddenOption
                text={`Privacy Policy`}
                singleLine
                onClick={() => pushPage(PrivacyPolicyPage, {})}
              />
              <Show when={!isOwner.value}>
                <HiddenOption
                  text={`Leave Team`}
                  singleLine
                  stroke={theme.palette.error}
                  onClick={() =>
                    pushPage(ConfirmationPopUp, {
                      text: `Are you sure you want to leave this team?`,
                      yesText: `Leave`,
                      onYes: () => {
                        mfs.user.workspace?.leaveWorkspace?.();
                      },
                    })
                  }
                />
              </Show>
              <HiddenOption
                text={`Delete Account`}
                singleLine
                stroke={theme.palette.error}
                onClick={deleteAccount}
              />
            </HiddenOptions>
          </Row>
        </Show>
      </Box>
      <SimpleBody>
        {/* SECTION: Team Members */}
        <Show when={mfs.user.workspace?.isOwner}>
          <Box height={0} />
          <Row widthGrows spaceBetween>
            <Icon
              scale={1.125}
              stroke={`transparent`}
              iconPath={mdiDotsVertical}
            />
            <Txt h2>Team</Txt>
            <HiddenOptions scale={1.125}>
              <HiddenOption
                scale={1}
                text={`Export Data`}
                singleLine
                onClick={exportData}
              />
              <Show when={premiumEnabled.value}>
                <HiddenOption
                  scale={1}
                  text={`Manage Subscription`}
                  singleLine
                  onClick={store.goToSubscriptionManagement}
                />
              </Show>
              <HiddenOption
                scale={1}
                text={premiumEnabled.value ? `Delete Team` : `Join New Team`}
                singleLine
                stroke={theme.palette.error}
                onClick={deleteTeam}
              />
            </HiddenOptions>
          </Row>
          <For
            each={mfs.user?.workspace?.otherMembers}
            fallback={
              <Show when={premiumEnabled.value}>
                <Txt hint widthGrows alignCenterLeft>
                  <span>
                    Tap the{" "}
                    <div
                      style={{
                        display: `inline-block`,
                        "vertical-align": `middle`,
                      }}
                    >
                      <Icon iconPath={mdiAccountMultiplePlusOutline} />
                    </div>{" "}
                    button to invite more team members.
                  </span>
                </Txt>
              </Show>
            }
          >
            {(user) => (
              <SimpleDocEntry
                name={emailIsValid(user.email) ? user.email : null}
                unnamedText={"Unknown Email!"}
                deleteText={"Remove"}
                onDelete={() =>
                  pushPage(ConfirmationPopUp, {
                    text: `Are you sure you want to remove ${user.email} from your team?`,
                    yesText: `Remove`,
                    onYes: () => {
                      mfs.user.workspace?.removeMember?.({
                        uid: user.uid,
                      });
                    },
                  })
                }
              />
            )}
          </For>
        </Show>

        {/* SECTION: Subscription */}
        <Show when={isOwner.value}>
          <Show
            when={premiumEnabled.value}
            fallback={
              <Show
                when={isSubscribing.value}
                fallback={
                  <>
                    <SubscribePrompt />
                  </>
                }
              >
                <Txt hint widthGrows alignCenterLeft>
                  Subscribing...
                </Txt>
              </Show>
            }
          >
            <></>
          </Show>
        </Show>

        {/* SECTION: Fuel Types */}
        <>
          <Row padTop={1} widthGrows align={$Align.spaceBetween}>
            <Icon
              scale={1.125}
              stroke={`transparent`}
              iconPath={mdiDotsVertical}
            />
            <Txt h2>Fuel Types</Txt>
            {/* TODO Is newObject in CreateFuelTypeDialog optional here? */}
            <Icon
              iconPath={mdiPlus}
              onClick={() => openCreateFuelTypeDialog({})}
              scale={1.25}
            />
          </Row>
          <Switch>
            <Match when={FuelType.sortedFuelTypes.length === 0}>
              <Txt hint>No Fuel Types</Txt>
            </Match>
            <Match when={FuelType.sortedFuelTypes.length > 0}>
              <Row widthGrows padBetween={1} alignLeft>
                <Txt bold widthGrows>
                  Name
                </Txt>
                <Txt align={$Align.centerRight} width={5} bold>
                  Rate $/Gal.
                </Txt>
                <Box width={1} />
              </Row>
              {/* <For each={listFuelTypes(FuelType.sortedFuelTypes)}>
                {(FuelType) => <FuelTypeEntry fuelType={FuelType} />}
              </For> */}
              <SortableColumn
                onSort={(props) =>
                  FloatSort.moveItem({
                    sortedList: FuelType.sortedFuelTypes,
                    fromIndex: props.from,
                    toIndex: props.to,
                    getPos: (fuelTypes) => fuelTypes.sortPos,
                    setPos: (fuelTypes, pos) => (fuelTypes.sortPos = pos),
                  })
                }
              >
                <For
                  each={FuelType.sortedFuelTypes}
                  fallback={<Txt hint>Tap + to add Fuel Types.</Txt>}
                >
                  {(fuelTypes) => <FuelTypeEntry fuelType={fuelTypes} />}
                </For>
              </SortableColumn>
            </Match>
          </Switch>
        </>

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
            align={showInviteMember.value ? Align.centerLeft : Align.center}
            onClick={() =>
              ((window as any).location =
                `mailto:${encodeURIComponent(`info@tke.us`)}?Subject=${encodeURIComponent(`About Ninety Percent`)}`)
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
              align={showInviteMember.value ? Align.centerLeft : Align.center}
              onClick={() => (versionClickCount.value += 1)}
            >{`App Version ${appVersion.value}`}</Txt>
          </Show>
        </Column>
      </SimpleBody>
    </SimplePage>
  );
}
