import { getTankShape, TankGeometry } from "@/Calculator/ShapeUtils";
import {
  Field,
  Label,
  NumField,
  Prop,
  useFormula,
  Column,
  exists,
  formatNumWithCommas,
  theme,
  Txt,
} from "miwi";
import { Show } from "solid-js";

export function calcEffectiveRate(props: {
  baseRate: number;
  rateOffset: number;
}) {
  return props.baseRate + props.rateOffset;
}

/* JS math has small rounding errors. e.g. `3.099 * 100 = 309.90000000000003` To overcome
 * this we use accurate and we truncate everything past five decimals and then round to two
 * decimals */
export function calcSales(props: { effectiveRate: number; gallons: number }) {
  const rawSales = props.effectiveRate * props.gallons;
  const truncated = Math.floor(rawSales * 100000) / 100000;
  return Math.round(truncated * 100) / 100;
}

export function calcGallonsInTankAfterFill(props: {
  gallonsInTankBeforeFill: number;
  gallonsAdded: number;
}) {
  return Math.round(props.gallonsInTankBeforeFill + props.gallonsAdded);
}

export function CompletedSubDeliveryFields(props: {
  fuelName: Prop<string | null | undefined>;
  baseRate: Prop<number | null | undefined>;
  rateOffset: Prop<number | null | undefined>;
  gallons: Prop<number | null | undefined>;
  gallonsHintText?: string;
  stickedInchesBeforeFilling: Prop<number | null | undefined>;
  stickedInchesAfterFilling: Prop<number | null | undefined>;
  tankGeometry: TankGeometry | null | undefined;
  allGrey?: boolean;
}) {
  const effectiveRate = useFormula(() =>
    exists(props.baseRate.value)
      ? calcEffectiveRate({
          baseRate: props.baseRate.value,
          rateOffset: props.rateOffset.value ?? 0,
        })
      : null,
  );
  const totalSales = useFormula(() =>
    exists(effectiveRate.value) && exists(props.gallons.value)
      ? calcSales({
          effectiveRate: effectiveRate.value,
          gallons: props.gallons.value,
        })
      : null,
  );
  const gallonsInTankBeforeFill = useFormula(
    () =>
      getTankShape(props.tankGeometry?.shape)?.calcFilledVolume(
        props.tankGeometry,
        props.stickedInchesBeforeFilling.value,
      ) ?? null,
  );

  return (
    <Column stroke={props.allGrey ? theme.palette.hint : undefined}>
      {/** Fuel Name */}
      <Label label="Fuel Name">
        <Field
          value={useFormula(
            () => props.fuelName.value ?? ``,
            (newVal) => (props.fuelName.value = newVal),
          )}
          underlined
          hintText="Fuel Name"
          capitalize={`words`}
          keyboard={"text"}
        />
      </Label>

      {/** Base Rate */}
      <Label label="Base Rate">
        <NumField value={props.baseRate} underlined hint="Rate" />
      </Label>

      {/** Rate Offset */}
      <Label label="Rate Offset">
        <NumField
          value={props.rateOffset}
          underlined
          hint="$0.00 / gal."
          negativesAreAllowed
        />
      </Label>

      {/** Gallons */}
      <Label label="Gallons">
        <NumField
          value={props.gallons}
          underlined
          hint={props.gallonsHintText ?? `Est. gal.`}
        />
      </Label>

      {/** Sticked Inches Before Filling */}
      <Label label="Sticked Before">
        <NumField
          value={props.stickedInchesBeforeFilling}
          underlined
          hint="in."
        />
      </Label>

      {/** Sticked Inches After Filling */}
      <Label label="Sticked After">
        <NumField
          value={props.stickedInchesAfterFilling}
          underlined
          hint="in."
        />
      </Label>

      {/** Effective Rate Calculation */}
      <Column
        padBetween={0}
        stroke={props.allGrey ? theme.palette.hint : undefined}
      >
        <Txt singleLine widthGrows alignCenterLeft>
          Effective Rate:
        </Txt>
        <Txt widthGrows alignCenterLeft>
          {exists(props.baseRate.value) && exists(effectiveRate.value)
            ? `$${formatNumWithCommas(
                props.baseRate.value,
                3,
              )} + $${formatNumWithCommas(
                props.rateOffset.value ?? 0,
                3,
              )} = $${formatNumWithCommas(effectiveRate.value, 3)}`
            : `---`}
        </Txt>
      </Column>

      {/* Sales Calculation */}
      <Column
        padBetween={0}
        stroke={props.allGrey ? theme.palette.hint : undefined}
      >
        <Txt singleLine widthGrows alignCenterLeft>
          Sales:
        </Txt>
        <Txt widthGrows alignCenterLeft>
          {exists(effectiveRate.value) &&
          exists(totalSales.value) &&
          exists(props.gallons.value)
            ? `$${formatNumWithCommas(
                effectiveRate.value,
                3,
              )} x ${formatNumWithCommas(
                props.gallons.value,
                0,
              )} gal. = $${formatNumWithCommas(totalSales.value, 2)}`
            : `---`}
        </Txt>
      </Column>

      {/* Gallons Now In Tank Calculation */}
      <Show when={exists(props.tankGeometry)}>
        <Column
          padBetween={0}
          stroke={props.allGrey ? theme.palette.hint : undefined}
        >
          <Txt singleLine widthGrows alignCenterLeft>
            Gallons Now In Tank:
          </Txt>
          <Txt widthGrows alignCenterLeft>
            {exists(gallonsInTankBeforeFill.value) &&
            exists(props.gallons.value)
              ? `${formatNumWithCommas(
                  gallonsInTankBeforeFill.value,
                  0,
                )} gal. + ${formatNumWithCommas(
                  props.gallons.value,
                  0,
                )} gal. = ${formatNumWithCommas(
                  calcGallonsInTankAfterFill({
                    gallonsInTankBeforeFill: gallonsInTankBeforeFill.value,
                    gallonsAdded: props.gallons.value,
                  }),
                  0,
                )} gal.`
              : `---`}
          </Txt>
        </Column>
      </Show>
    </Column>
  );
}
