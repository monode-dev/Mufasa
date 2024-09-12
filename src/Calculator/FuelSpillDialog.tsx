import { canCallPhoneNumber, callPhoneNumber } from "@/AppData";
import { Dialog, Row, Txt } from "miwi";

export function FuelSpillDialog() {
  const fuelSpillHotline = "800-424-8802";
  return (
    <Dialog>
      <Txt h1>Spill Fuel</Txt>

      <Txt>When are You Required to Report an Oil Spill and Hazardous Substance Release?</Txt>
      <Txt 
        stroke={$theme.colors.primary}
        underlineText
        onClick={() => {
          window.open("https://www.epa.gov/emergency-response/when-are-you-required-report-oil-spill-and-hazardous-substance-release");
        }}
      >
        https://www.epa.gov/emergency-response/when-are-you-required-report-oil-spill-and-hazardous-substance-release
      </Txt>

      <Txt>Call National Response Center for Hazardous Substance Spills: </Txt>
      <Txt 
        stroke={$theme.colors.primary}
        underlineText        
        onClick={() => {
            if (canCallPhoneNumber(fuelSpillHotline)){
              callPhoneNumber(fuelSpillHotline);
            }
        }}
        >
          {fuelSpillHotline}
      </Txt>
    </Dialog>
  )
}