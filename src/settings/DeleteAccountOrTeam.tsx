import {
  Button,
  Dialog,
  Row,
  Txt,
  popPage,
  pushPage,
  theme,
  useProp,
} from "miwi";
import { Switch, Match } from "solid-js";
import { ExportingUi } from "./ExportData";
import { mfs, store } from "@/model/DataModel";
import { LoadingPage } from "@/onboarding/LoadingPage";

export function deleteAccount() {
  pushPage(DeleteAccountOrTeamPopup, {
    deleteType: `account`,
  });
}
export function deleteTeam() {
  pushPage(DeleteAccountOrTeamPopup, {
    deleteType: `team`,
  });
}

function DeleteAccountOrTeamPopup(props: { deleteType: `account` | `team` }) {
  type Step = (typeof Step)[keyof typeof Step];
  const Step = {
    confirming: `confirming`,
    requestingExport: `requestingExport`,
    exporting: `exporting`,
    requestingUnsubscribe: `requestingUnsubscribe`,
    unsubscribing: `unsubscribing`,
    deleting: `deleting`,
  } as const;
  const step = useProp<Step>(Step.confirming);
  async function startDelete() {
    if (step.value === Step.deleting) return;
    step.value = Step.deleting;
    try {
      if (props.deleteType === `team`) {
        await mfs.user.workspace?.deleteWorkspace?.();
      } else {
        await mfs.user.workspace?.deleteAccount?.();
      }
    } catch (e) {
      console.warn(e);
    }
    popPage();
  }

  return (
    <Switch>
      <Match when={step.value === Step.confirming}>
        <Dialog>
          <Txt>
            {props.deleteType === `team`
              ? `Are you sure you want to permanently delete this team, all of its data in the cloud, and all its data on all members' phones? This cannot be undone.`
              : mfs.user.workspace?.role === `owner`
                ? `Are you sure you want to permanently delete your account, this team, all of the team's data in the cloud, and all the team data on all the members' phones? This cannot be undone.`
                : `Are you sure you want to permanently delete your account?`}
          </Txt>
          <Row>
            <Button outlined widthGrows onClick={() => popPage()}>
              Cancel
            </Button>
            <Button
              fill={theme.palette.error}
              widthGrows
              onClick={() => {
                if (mfs.user.workspace?.role === `owner`) {
                  step.value = Step.requestingExport;
                } else {
                  startDelete();
                }
              }}
            >
              Delete
            </Button>
          </Row>
        </Dialog>
      </Match>
      <Match when={step.value === Step.requestingExport}>
        <Dialog>
          <Txt>
            Would you like to export all team data on this phone before you
            delete the team?
          </Txt>
          <Row>
            <Button
              outlined
              widthGrows
              onClick={() => (step.value = Step.requestingUnsubscribe)}
            >
              Skip
            </Button>
            <Button widthGrows onClick={() => (step.value = Step.exporting)}>
              Export
            </Button>
          </Row>
        </Dialog>
      </Match>
      <Match when={step.value === Step.exporting}>
        <ExportingUi
          onFinished={() => (step.value = Step.requestingUnsubscribe)}
        />
      </Match>
      <Match when={step.value === Step.requestingUnsubscribe}>
        <Dialog>
          <Txt>
            Would you like to cancel your subscription before you delete your
            team?
          </Txt>
          <Row>
            <Button outlined widthGrows onClick={() => startDelete()}>
              Skip
            </Button>
            <Button
              widthGrows
              onClick={() =>
                store.goToSubscriptionManagement().then(() => {
                  step.value = Step.unsubscribing;
                })
              }
            >
              Unsubscribe
            </Button>
          </Row>
        </Dialog>
      </Match>
      <Match when={step.value === Step.unsubscribing}>
        <Dialog>
          <Txt>Are you ready to delete your team?</Txt>
          <Row>
            <Button outlined widthGrows onClick={() => popPage()}>
              Cancel
            </Button>
            <Button
              fill={theme.palette.error}
              widthGrows
              onClick={() => startDelete()}
            >
              Delete
            </Button>
          </Row>
        </Dialog>
      </Match>
      <Match when={step.value === Step.deleting}>
        <LoadingPage
          name={`Deleting ${props.deleteType === `team` ? `Team` : `Account`}`}
          stroke={theme.palette.error}
        />
      </Match>
    </Switch>
  );
}
