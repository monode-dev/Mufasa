import { Button, Card, Dialog, mdColors, Page, popPage, Row, Txt } from "miwi";
import { Client } from "./Client";

export function LoadCSVDialog() {
  function handleYes(csvFile: HTMLInputElement) {
    if (csvFile.files === null) {
      return;
    }

    let final_vals: string[][] = [];

    let csvReader = new FileReader();
    if (csvFile.files) {
      const input = csvFile.files[0];

      csvReader.onload = function (evt) {
        if (evt.target) {
          const text = evt.target.result;

          if (typeof text === "string" || text instanceof String) {
            const values = text.split(/[\n]+/);
            values.forEach((val) => {
              final_vals.push(val.split(","));
            });
            for (let i = 0; i < final_vals.length; i++) {
              Client.create({
                name: final_vals[i][0],
                clientId: final_vals[i][1],
                phoneNumber: final_vals[i][2],
                address: final_vals[i][3],
                notes: final_vals[i][4],
              });
            }
          }
        }
      };
      csvReader.readAsText(input as Blob);
    }
    popPage();
  }

  return (
    <Dialog>
      <Txt>Select a CSV file</Txt>
      <input class="form-control" id="csvFile" type="file" accept=".csv" />
      <Row widthGrows align={$Align.spaceEvenly}>
        <Button outlined onClick={popPage}>
          Cancel
        </Button>
        <Button
          onClick={() => {
            const csvFile = document.getElementById(
              "csvFile",
            ) as HTMLInputElement;
            handleYes(csvFile);
          }}
          fill={mdColors.green}
        >
          Create
        </Button>
      </Row>
    </Dialog>
  );
}
