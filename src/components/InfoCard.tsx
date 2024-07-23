import { Card, Page, Txt, popPage } from "miwi";
import { InfoEntry } from "./InfoEntry";

export function InfoCard() {
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
        >
          <InfoEntry
            entryTitle="Oval"
            entryContent="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eius totam mollitia, accusamus aliquid inventore recusandae ratione illo, animi veniam blanditiis molestias corrupti libero fuga laudantium alias id fugit! Dignissimos, nobis.  "
          />
          <InfoEntry
            entryTitle="Rectangular"
            entryContent="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eius totam mollitia, accusamus aliquid inventore recusandae ratione illo, animi veniam blanditiis molestias corrupti libero fuga laudantium alias id fugit! Dignissimos, nobis.  "
          />
          <InfoEntry
            entryTitle="Vertical Cylinder"
            entryContent="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eius totam mollitia, accusamus aliquid inventore recusandae ratione illo, animi veniam blanditiis molestias corrupti libero fuga laudantium alias id fugit! Dignissimos, nobis.  "
          />
          <InfoEntry
            entryTitle="Ellipse"
            entryContent="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eius totam mollitia, accusamus aliquid inventore recusandae ratione illo, animi veniam blanditiis molestias corrupti libero fuga laudantium alias id fugit! Dignissimos, nobis.  "
          />
          <InfoEntry
            entryTitle="Truck Bed Tank"
            entryContent="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eius totam mollitia, accusamus aliquid inventore recusandae ratione illo, animi veniam blanditiis molestias corrupti libero fuga laudantium alias id fugit! Dignissimos, nobis.  "
          />
        </InfoEntry>
        <InfoEntry
          entryTitle="Client"
          entryContent="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eius totam mollitia, accusamus aliquid inventore recusandae ratione illo, animi veniam blanditiis molestias corrupti libero fuga laudantium alias id fugit! Dignissimos, nobis.  "
        />
        <InfoEntry
          entryTitle="Delivery"
          entryContent="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eius totam mollitia, accusamus aliquid inventore recusandae ratione illo, animi veniam blanditiis molestias corrupti libero fuga laudantium alias id fugit! Dignissimos, nobis.  "
        >
          <InfoEntry
            entryTitle="Sub Delivery"
            entryContent="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eius totam mollitia, accusamus aliquid inventore recusandae ratione illo, animi veniam blanditiis molestias corrupti libero fuga laudantium alias id fugit! Dignissimos, nobis.  "
          />
        </InfoEntry>
        <InfoEntry
          entryTitle="Address"
          entryContent="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eius totam mollitia, accusamus aliquid inventore recusandae ratione illo, animi veniam blanditiis molestias corrupti libero fuga laudantium alias id fugit! Dignissimos, nobis.  "
        />
        <InfoEntry
          entryTitle="Calculator"
          entryContent="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eius totam mollitia, accusamus aliquid inventore recusandae ratione illo, animi veniam blanditiis molestias corrupti libero fuga laudantium alias id fugit! Dignissimos, nobis.  "
        />
      </Card>
    </Page>
  );
}
