import { Card, Page, Txt, popPage } from "miwi";
import { InfoEntry } from "./InfoEntry";

export function InfoCard(
  props: Readonly<{
    entriesToOpen?: string[];
  }>
) {
  return (
    <Page onClick={popPage} fill="#00000099">
      <Card
        overflowXScrolls
        maxHeight={40}
        preventClickPropagation
        width={`75%`}
        shadowSize={2}
        height={35}
        alignTopCenter
      >
        <Txt h1>info</Txt>
        <InfoEntry
          entryTitle="Tank"
          entryContent="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eius totam mollitia, accusamus aliquid inventore recusandae ratione illo, animi veniam blanditiis molestias corrupti libero fuga laudantium alias id fugit! Dignissimos, nobis.  "
          shouldBeOpen={props.entriesToOpen?.includes("Tank")}
        >
          <InfoEntry
          entryTitle="Shape"
          shouldBeOpen={props.entriesToOpen?.includes("Shape")}
          >
            <InfoEntry
              entryTitle="Horizontal Cylinder"
              entryContent="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eius totam mollitia, accusamus aliquid inventore recusandae ratione illo, animi veniam blanditiis molestias corrupti libero fuga laudantium alias id fugit! Dignissimos, nobis.  "
              shouldBeOpen={props.entriesToOpen?.includes("Horizontal Cylinder")}
            />
            <InfoEntry
              entryTitle="Oval"
              entryContent="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eius totam mollitia, accusamus aliquid inventore recusandae ratione illo, animi veniam blanditiis molestias corrupti libero fuga laudantium alias id fugit! Dignissimos, nobis.  "
              shouldBeOpen={props.entriesToOpen?.includes("Oval")}
            />
            <InfoEntry
              entryTitle="Rectangle"
              entryContent="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eius totam mollitia, accusamus aliquid inventore recusandae ratione illo, animi veniam blanditiis molestias corrupti libero fuga laudantium alias id fugit! Dignissimos, nobis.  "
              shouldBeOpen={props.entriesToOpen?.includes("Rectangle")}
            />
            <InfoEntry
              entryTitle="Vertical Cylinder"
              entryContent="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eius totam mollitia, accusamus aliquid inventore recusandae ratione illo, animi veniam blanditiis molestias corrupti libero fuga laudantium alias id fugit! Dignissimos, nobis.  "
              shouldBeOpen={props.entriesToOpen?.includes("Vertical Cylinder")}
            />
            <InfoEntry
              entryTitle="Ellipse"
              entryContent="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eius totam mollitia, accusamus aliquid inventore recusandae ratione illo, animi veniam blanditiis molestias corrupti libero fuga laudantium alias id fugit! Dignissimos, nobis.  "
              shouldBeOpen={props.entriesToOpen?.includes("Ellipse")}
            />
            <InfoEntry
              entryTitle="Truck Bed Tank"
              entryContent="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eius totam mollitia, accusamus aliquid inventore recusandae ratione illo, animi veniam blanditiis molestias corrupti libero fuga laudantium alias id fugit! Dignissimos, nobis.  "
              shouldBeOpen={props.entriesToOpen?.includes("Truck Bed Tank")}
            />
          </InfoEntry>
        </InfoEntry>
        <InfoEntry
          entryTitle="Client"
          entryContent="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eius totam mollitia, accusamus aliquid inventore recusandae ratione illo, animi veniam blanditiis molestias corrupti libero fuga laudantium alias id fugit! Dignissimos, nobis.  "
          shouldBeOpen={props.entriesToOpen?.includes("Client")}
        />
        <InfoEntry
          entryTitle="Delivery"
          entryContent="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eius totam mollitia, accusamus aliquid inventore recusandae ratione illo, animi veniam blanditiis molestias corrupti libero fuga laudantium alias id fugit! Dignissimos, nobis.  "
          shouldBeOpen={props.entriesToOpen?.includes("Delivery")}
        >
          <InfoEntry
            entryTitle="Sub Delivery"
            entryContent="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eius totam mollitia, accusamus aliquid inventore recusandae ratione illo, animi veniam blanditiis molestias corrupti libero fuga laudantium alias id fugit! Dignissimos, nobis.  "
            shouldBeOpen={props.entriesToOpen?.includes("Sub Delivery")}
          />
        </InfoEntry>
        <InfoEntry
          entryTitle="Address"
          entryContent="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eius totam mollitia, accusamus aliquid inventore recusandae ratione illo, animi veniam blanditiis molestias corrupti libero fuga laudantium alias id fugit! Dignissimos, nobis.  "
          shouldBeOpen={props.entriesToOpen?.includes("Address")}
        />
        <InfoEntry
          entryTitle="Calculator"
          entryContent="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eius totam mollitia, accusamus aliquid inventore recusandae ratione illo, animi veniam blanditiis molestias corrupti libero fuga laudantium alias id fugit! Dignissimos, nobis.  "
          shouldBeOpen={props.entriesToOpen?.includes("Calculator")}
        />
      </Card>
    </Page>
  );
}
