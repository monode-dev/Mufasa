import { mfs, premiumEnabled } from "@/model/DataModel";
import { createLimitTrackers } from "@/model/LimitUtils";
import { Tank } from "@/Tanks/Tank";
import { exists, FloatSort } from "miwi";
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
  readonly tanks = list(Tank, `mx_parent`);

  // SECTION: Scheduled Deliveries
  weekday = prop([String, null], WeekDay.none) as ReturnType<
    typeof prop<[StringConstructor, null], WeekDay>
  > &
    WeekDay;

  _shouldScheduleDeliveriesForThisClient = prop(Boolean, false, {
    key: `shouldScheduleDeliveriesForThisClient`,
  });
  shouldScheduleDeliveriesForThisClient = formula(
    () => this._shouldScheduleDeliveriesForThisClient,
    (shouldSchedule) => {
      this._shouldScheduleDeliveriesForThisClient = shouldSchedule;
      this.assignedTo = shouldSchedule ? mfs.user.uid ?? null : null;
    },
  );
  weeksBetweenScheduledDeliveries = prop([Number, null], null);
  scheduledDeliveryStartDate = prop([Number, null], null);
  assignedTo = prop([String, null], null);
  static getScheduledClients() {
    const todaysClients: Client[] = [];
    const tomorrowsClients: Client[] = [];
    const daysSinceEpoch = Math.floor(Date.now() / 86400000);

    Client.getAllDocs().forEach((client) => {
      if (!client.shouldScheduleDeliveriesForThisClient) return;

      const isAssignedToCurrentUser = client.assignedTo !== mfs.user.uid;
      const userIsOwnerAndClientIsUnassigned =
        mfs.user.workspace?.role === `owner` && !exists(client.assignedTo);
      if (isAssignedToCurrentUser && userIsOwnerAndClientIsUnassigned) return;
      if (!exists(client.weeksBetweenScheduledDeliveries)) return;
      if (!exists(client.weekday)) return;
      if (!exists(client.scheduledDeliveryStartDate)) return;

      const normalizedStartDate = new Date(client.scheduledDeliveryStartDate);
      normalizedStartDate.setDate(
        normalizedStartDate.getDate() -
          normalizedStartDate.getDay() +
          getWeekDayAsJsDayOfWeek(client.weekday),
      );

      const daysFromEpochToStartDate = Math.floor(
        normalizedStartDate.getTime() / 86400000,
      );

      const daysBetweenStartAndToday =
        daysSinceEpoch - daysFromEpochToStartDate;

      const daysBetweenStartAndTomorrow = daysBetweenStartAndToday + 1;
      const daysBetweenScheduledDeliveries =
        client.weeksBetweenScheduledDeliveries * 7;

      if (
        daysBetweenStartAndToday >= 0 &&
        daysBetweenStartAndToday % daysBetweenScheduledDeliveries === 0
      ) {
        todaysClients.push(client);
      }
      if (
        daysBetweenStartAndTomorrow >= 0 &&
        daysBetweenStartAndTomorrow % daysBetweenScheduledDeliveries === 0
      ) {
        tomorrowsClients.push(client);
      }
    });

    return { todaysClients, tomorrowsClients };
  }
  // static getScheduledClients() {
  //   const todaysClients: Client[] = [];
  //   const tomorrowsClients: Client[] = [];
  //   const daysSinceEpoch = Math.floor(Date.now() / 86400000);
  //   Client.getAllDocs().forEach((client) => {
  //     if (!client.shouldScheduleDeliveriesForThisClient) return;
  //     const isAssignedToCurrentUser = client.assignedTo !== mfs.user.uid;
  //     const userIsOwnerAndClientIsUnassigned =
  //       mfs.user.workspace?.role === `owner` && !exists(client.assignedTo);
  //     if (isAssignedToCurrentUser && userIsOwnerAndClientIsUnassigned) return;
  //     if (!exists(client.weeksBetweenScheduledDeliveries)) return;
  //     if (!exists(client.weekday)) return;
  //     if (!exists(client.scheduledDeliveryStartDate)) return;
  //     const normalizedStartDate = new Date(client.scheduledDeliveryStartDate);
  //     normalizedStartDate.setDate(
  //       normalizedStartDate.getDate() -
  //         normalizedStartDate.getDay() +
  //         getWeekDayAsJsDayOfWeek(client.weekday),
  //     );
  //     const daysFromEpochToStartDate = Math.floor(
  //       normalizedStartDate.getTime() / 86400000,
  //     );
  //     const daysBetweenStartAndToday =
  //       daysSinceEpoch - daysFromEpochToStartDate;
  //     if (daysBetweenStartAndToday < 0) return;
  //     const daysBetweenStartAndTomorrow = daysBetweenStartAndToday + 1;
  //     const daysBetweenScheduledDeliveries =
  //       client.weeksBetweenScheduledDeliveries * 7;
  //     if (daysBetweenStartAndToday % daysBetweenScheduledDeliveries === 0) {
  //       todaysClients.push(client);
  //     }
  //     if (daysBetweenStartAndTomorrow % daysBetweenScheduledDeliveries === 0) {
  //       tomorrowsClients.push(client);
  //     }
  //   });
  //   return { todaysClients, tomorrowsClients };
  // }
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

export type WeekDay = (typeof WeekDay)[keyof typeof WeekDay];
export const WeekDay = {
  monday: `Monday`,
  tuesday: `Tuesday`,
  wednesday: `Wednesday`,
  thursday: `Thursday`,
  friday: `Friday`,
  saturday: `Saturday`,
  sunday: `Sunday`,
  none: null,
} as const;
export function getWeekDayAsJsDayOfWeek(weekDay: Exclude<WeekDay, null>) {
  // JS dates start on sunday
  return (Object.values(WeekDay).indexOf(weekDay) + 1) % 7;
}
