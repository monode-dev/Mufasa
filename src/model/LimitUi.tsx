import {
  BoxProps,
  Column,
  Row,
  Txt,
  doNow,
  pushPage,
  theme,
  useFormula,
  useProp,
} from "miwi";
import { ConfirmationPopUp } from "../components/ConfirmationPopUp";
import { Client } from "@/Clients/Client";
import { mfs, store, premiumEnabled, FuelType } from "@/model/DataModel";
import { PrivacyPolicyPage } from "@/settings/PrivacyPolicyPage";
import { openTermsOfUse } from "@/settings/AccountSettingsPage";
import { memberLimit } from "@/model/Team";
import { Tank } from "@/Tanks/Tank";
import { Delivery, SubDelivery } from "@/Deliveries/Delivery";

export function withLimitConfirmation(props: {
  limit: number;
  count: number;
  labelSingular: string;
  labelPlural: string;
  createPresentTense?: string;
  createPastTense?: string;
  action: () => void;
}) {
  if (shouldShowWarning(props)) {
    pushPage(LimitConfirmationPopup, props);
  } else {
    props.action();
  }
}

function LimitConfirmationPopup(props: {
  limit: number;
  count: number;
  labelSingular: string;
  labelPlural: string;
  createPresentTense?: string;
  createPastTense?: string;
  action: () => void;
}) {
  return (
    <ConfirmationPopUp
      yesText={props.count < props.limit ? `Continue` : `Close`}
      onYes={() =>
        props.count < props.limit
          ? requestAnimationFrame(() => props.action())
          : undefined
      }
    >
      <LimitText {...props} />
    </ConfirmationPopUp>
  );
}

export function shouldShowWarning(props: { limit: number; count: number }) {
  return props.count / props.limit >= 0.9;
}

export function LimitText(props: {
  count: number;
  limit: number;
  labelSingular: string;
  labelPlural: string;
  createPresentTense?: string;
  createPastTense?: string;
}) {
  return (
    <Txt
      scale={1 * 0.95}
      alignLeft
      widthGrows
      hint
      onClick={() => {
        if (premiumEnabled.value) {
          (window as any).location =
            `mailto:${encodeURIComponent(`info@tke.us`)}?Subject=${encodeURIComponent(`About Ninety Percent Limits`)}`;
        } else {
          if (mfs.user.workspace?.role === `owner`) {
            store.products.premium.purchase();
          } else {
            return;
          }
        }
      }}
    >
      {`Warning, you've ${props.createPastTense ?? `created`} ${props.count} ${props.count === 1 ? props.labelSingular.toLowerCase() : props.labelPlural.toLowerCase()}. You can ${props.createPresentTense ?? `create`} ${Math.max(0, props.limit - props.count)} more. `}
      {premiumEnabled.value ? (
        <span>
          You might consider reaching out to{` `}
          <u>info@tke.us</u>
          {` `}for a limit extension.
        </span>
      ) : mfs.user.workspace?.role === `owner` ? (
        <SubscribePrompt />
      ) : (
        <>Ask your team owner to subscribe.</>
      )}
    </Txt>
  );
}

export function CurrentLimitText(props: {} & BoxProps) {
  return (
    <Txt hint widthGrows alignCenterLeft overrideProps={props}>
      You have {Client.limit.count} / {Client.limit.max} clients,{" "}
      {Tank.limit.count} / {Tank.limit.max} tanks, {FuelType.limit.count} /{" "}
      {FuelType.limit.max} fuel types, {Delivery.limit.count} /{" "}
      {Delivery.limit.max} deliveries, {SubDelivery.limit.count} /{" "}
      {SubDelivery.limit.max} individual deliveries, and {memberLimit.count} /{" "}
      {memberLimit.max} team members.
    </Txt>
  );
}

const promisedLocalizedSubscriptionPrice =
  store.products.premium.getLocalizedPrice();
export function SubscribePrompt() {
  const localizedSubscriptionPrice = doNow(() => {
    const localizedSubscriptionPrice = useProp<string | undefined>(undefined);
    promisedLocalizedSubscriptionPrice.then((price) => {
      localizedSubscriptionPrice.value = price;
    });
    return useFormula(() => localizedSubscriptionPrice.value);
  });

  return (
    <>
      <Column padBetween={1 / 8}>
        <Txt hint widthGrows alignCenterLeft>
          <span>
            Pro Team: Subscribed teams can have up to {memberLimit.proLimit}{" "}
            members, {Client.limit.proLimit} clients, {Tank.limit.proLimit}{" "}
            tanks, {FuelType.limit.proLimit} fuel types,{" "}
            {Delivery.limit.proLimit} deliveries, and{" "}
            {SubDelivery.limit.proLimit} individual deliveries.
          </span>
        </Txt>
      </Column>
      <Txt
        stroke={theme.palette.primary}
        underlineText
        singleLine
        widthGrows
        alignCenterLeft
        onClick={async () => {
          if (!premiumEnabled.value) await store.products.premium.purchase();
        }}
      >
        Subscribe at {localizedSubscriptionPrice.value ?? `an unknown price`} /
        month
      </Txt>
      <Row
        widthGrows
        alignCenterLeft
        padBetween={1 / 4}
        padBetweenY={1 / 8}
        overflowXWraps
      >
        <Txt hint underlineText singleLine onClick={openTermsOfUse}>
          Terms of Use
        </Txt>
        <Txt hint>and</Txt>
        <Txt
          hint
          underlineText
          singleLine
          onClick={() => pushPage(PrivacyPolicyPage, {})}
        >
          Privacy Policy
        </Txt>
      </Row>
      <Txt hint widthGrows alignCenterLeft onClick={store.restorePurchases}>
        <span>
          Already subscribed{` `}
          <u>restore purchase</u>
        </span>
      </Txt>
    </>
  );
}
