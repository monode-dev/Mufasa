import { mfs, premiumEnabled } from "@/model/DataModel";
import { createLimitTrackers } from "@/model/LimitUtils";
import { Tank } from "@/Tanks/Tank";
import { FloatSort, useProp } from "miwi";
import { prop, list, formula } from "mufasa";

export class Client extends mfs.Doc(`Client`) {
  static readonly limit = createLimitTrackers({
    free: 10,
    premium: 10000,
    getPremiumEnabled: () => premiumEnabled.value,
    getCount: () => Client.getAllDocs().length,
  });
  name = prop(String);
  clientId = prop(String);
  phoneNumber = prop(String, ``);
  readonly additionalPhoneNumbers = list(ClientPhoneNumber, `client`);
  readonly sortedAdditionalPhoneNumbers = formula(() =>
    FloatSort.toSorted({
      list: this.additionalPhoneNumbers,
      getPos: (num) => num.sortPosition,
      getUid: (num) => num.docId ?? ``,
    }),
  );
  addPhoneNumber() {
    if (this.additionalPhoneNumbers.count >= 5) {
      console.error(`Cannot add more than 5 phone numbers`);
      return;
    }
    ClientPhoneNumber.create({
      client: this,
      sortPosition: FloatSort.getNewEndPos({
        list: this.sortedAdditionalPhoneNumbers,
        getPos: (num) => num.sortPosition,
        getUid: (num) => num.docId ?? ``,
      }),
    });
  }
  readonly allPhoneNumbers = formula(() =>
    [
      {
        name: "Primary",
        number: this.phoneNumber,
      },
    ].concat(this.sortedAdditionalPhoneNumbers),
  );

  address = prop(String, ``);
  notes = prop(String, ``);
  rateOffset = prop([Number, null], null);
  weekday = prop([String, null], WeekDays.none) as ReturnType<typeof prop<[StringConstructor, null], WeekDays>> & WeekDays;
  weeksBetweenScheduledDeliveries = prop([Number, null], null);
  scheduledDeliveryStartDate = prop([Number, null], null);
  shouldScheduleDeliveriesForThisClient = prop(Boolean);
  assignedTo = prop(String, ``);
  readonly tanks = list(Tank, `mx_parent`);
  onDelete() {
    this.additionalPhoneNumbers.forEach((num) => num.deleteDoc());
    this.tanks.forEach((tank) => tank.deleteDoc());
  }
  // TODO: Limit the number of phone numbers per client
}

export class ClientPhoneNumber extends mfs.Doc(`ClientPhoneNumber`) {
  client = prop(Client);
  name = prop(String, ``);
  number = prop(String, ``);
  sortPosition = prop(Number);
  onDelete() {
    //this.deleteDoc();
    //super.onDelete();
    //this.client?.additionalPhoneNumbers.remove(this);
  }
}

export type WeekDays = (typeof WeekDays)[keyof typeof WeekDays]
export const WeekDays = {
  monday: `Monday`,
  tuesday: `Tuesday`,
  wednesday: `Wednesday`,
  thursday: `Thursday`,
  friday: `Friday`,
  saturday: `Saturday`,
  sunday: `Sunday`,
  none: null,
} as const;
