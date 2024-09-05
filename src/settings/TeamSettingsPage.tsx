import {
  Box,
  Txt,
  exists,
  Icon,
  pushPage,
  useFormula,
  Column,
  theme,
} from "miwi";
import { SimplePage } from "@/components/SimplePage";
import { SimpleBody } from "@/components/SimpleBody";
import { For, Show } from "solid-js";
import { premiumEnabled, store, mfs } from "@/model/DataModel";
import { inviteTeamMember, memberLimit } from "@/model/Team";
import { mdiAccountMultiplePlusOutline } from "@mdi/js";
import { ConfirmationPopUp } from "@/components/ConfirmationPopUp";
import { SimpleDocEntry } from "@/components/SimpleDocEntry";
import { withLimitConfirmation } from "@/model/LimitUi";
import { exportData } from "./ExportData";
import { deleteTeam } from "./DeleteAccountOrTeam";
import { InlineAppBar } from "@/components/InlineAppBar";

export function TeamSettingsPage() {
  const isOwner = useFormula(() => mfs.user.workspace?.role === `owner`);
  const emailIsValid = (email: string | null | undefined) =>
    exists(email) && email.trim().length > 0;

  return (
    <SimplePage>
      <InlineAppBar
        name={`Team`}
        right={
          <Show when={isOwner.value && premiumEnabled.value}>
            <Icon
              iconPath={mdiAccountMultiplePlusOutline}
              scale={1.25}
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
          </Show>
        }
      />

      <SimpleBody>
        {/* SECTION: Team Members */}
        <Show
          when={mfs.user.workspace?.isOwner}
          fallback={
            <Txt
              widthGrows
              singleLine
              alignCenterLeft
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
            >
              Leave Team
            </Txt>
          }
        >
          {/* SECTION: Team Members */}
          <For
            each={mfs.user?.workspace?.otherMembers}
            fallback={
              <Show
                when={premiumEnabled.value}
                fallback={
                  <Txt hint widthGrows alignCenterLeft>
                    No other team members.
                  </Txt>
                }
              >
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

          {/* SECTION: Subscription */}
          {/* <Show when={isOwner.value}>
            <Show
              when={premiumEnabled.value}
              fallback={
                <Show
                  when={isSubscribing.value}
                  fallback={
                    <SubscribePrompt/>
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
          </Show> */}

          {/* SECTION: Options */}
          <Box height={0} />
          <Txt h2 widthGrows singleLine alignCenter>
            Options
          </Txt>
          <Txt
            widthGrows
            singleLine
            alignCenterLeft
            onClick={() => exportData()}
          >
            Export Team Data
          </Txt>
          <Txt
            widthGrows
            singleLine
            alignCenterLeft
            onClick={() => store.goToSubscriptionManagement()}
          >
            Manage Subscription
          </Txt>
          <Txt
            widthGrows
            singleLine
            alignCenterLeft
            stroke={theme.palette.error}
            onClick={() => deleteTeam()}
          >
            {premiumEnabled.value ? `Delete Team` : `Join New Team`}
          </Txt>
        </Show>
      </SimpleBody>
    </SimplePage>
  );
}
