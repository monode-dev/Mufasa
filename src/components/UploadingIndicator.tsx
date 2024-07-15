import { mfs } from "@/model/DataModel";
import { mdiCloudUploadOutline } from "@mdi/js";
import { useProp, useFormula, Icon, Row, Txt, theme } from "miwi";
import { onCleanup, Show } from "solid-js";

const syncIconScale = 1.5;
export const syncIconBoxScale = syncIconScale + 0.5 * 2;
export const syncIconBoxRadius = syncIconBoxScale / 2;
export const syncIconOffset = syncIconScale * (1 / 16);
function pulse(config?: { pulseMs?: number; max?: number; min?: number }) {
  const frameDuration = 10;
  const pulseMs = config?.pulseMs ?? 1000;
  const maxValue = config?.max ?? 1;
  const minValue = config?.min ?? 0;
  const valueSig = useProp((maxValue + minValue) / 2);
  const interval = setInterval(() => {
    const timePercent = (Date.now() % pulseMs) / pulseMs;
    const valuePercent = (Math.sin(timePercent * Math.PI * 2) + 1) / 2;
    valueSig.value = valuePercent * (maxValue - minValue) + minValue;
  }, frameDuration);
  onCleanup(() => clearInterval(interval));
  return valueSig;
}

export function UploadingIndicator() {
  const pulsePercent = pulse({ pulseMs: 1.35 * 1000 });
  const applyShift = (max: number, min: number, shift: number) =>
    shift * (max - min) + min;
  const pulseColor = useFormula(
    () =>
      `hsl(${applyShift(50, 36, pulsePercent.value)}, ${applyShift(
        90,
        77,
        pulsePercent.value,
      )}%, 51%)`,
  );
  return (
    <Show when={mfs.isUploadingToCloud}>
      <Row
        scale={1}
        stroke={pulseColor.value}
        cornerRadius={3}
        fill={theme.palette.accent}
        pad={0.5}
        padAroundX={0.75}
        padBetween={1 / 4}
        shadowSize={1}
      >
        <Icon scale={syncIconScale} iconPath={mdiCloudUploadOutline} />
        <Txt>Uploading</Txt>
      </Row>
    </Show>
  );
}
