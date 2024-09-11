import { getClientLabel, isClientValid, isTankValid } from "@/AppData";
import { Client } from "@/Clients/Client";
import { mfs, premiumEnabled, FuelType } from "@/model/DataModel";
import { createLimitTrackers } from "@/model/LimitUtils";
import { TankGeometry } from "@/Calculator/ShapeUtils";
import { Tank } from "@/Tanks/Tank";
import {
  JUST_FUEL,
  NONE_SELECTED,
  ONE_TIME,
  autoSavingProp,
  formatNumWithCommas,
} from "@/utils";
import { FloatSort, doNow, exists } from "miwi";
import { prop, list, formula } from "mufasa";
import { withLimitConfirmation } from "@/model/LimitUi";
import { calcEffectiveRate, calcSales } from "./CompletedSubDeliveryFields";

// SECTION: Delivery
export type SelectedClient = Client | ONE_TIME | NONE_SELECTED;
export class Delivery extends mfs.Doc(`Delivery`) {
  // General
  static readonly limit = createLimitTrackers({
    free: 30,
    premium: 100000,
    getPremiumEnabled: () => premiumEnabled.value,
    getCount: () => Delivery.getAllDocs().length,
  });
  onDelete() {
    this.sortedSubDeliveries.forEach((subDelivery) => subDelivery.deleteDoc());
  }
  static get currentUsersDeliveries() {
    return Delivery.getAllDocs().filter((delivery) => {
      const isMine = delivery.createdBy === mfs.user.uid;
      const iAmOwner = mfs.user.workspace?.role === `owner`;
      const createdByIsBlank =
        !exists(delivery.createdBy) || delivery.createdBy === ``;
      return isMine || (iAmOwner && createdByIsBlank);
    });
  }
  static get upcomingDeliveries() {
    return FloatSort.toSorted({
      list: Delivery.getAllDocs().filter((delivery) => !delivery.isCompleted),
      getPos: (delivery) => delivery.sortPosition,
      getUid: (delivery) => delivery.docId ?? ``,
    });
  }
  static get currentUsersUpcomingDeliveries() {
    return FloatSort.toSorted({
      list: Delivery.currentUsersDeliveries.filter(
        (delivery) => !delivery.isCompleted,
      ),
      getPos: (delivery) => delivery.sortPosition,
      getUid: (delivery) => delivery.docId ?? ``,
    });
  }
  static get completedDeliveries() {
    return Delivery.getAllDocs()
      .filter((delivery) => delivery.isCompleted)
      .sort(
        (a, b) => (b.completedTimePosix ?? 0) - (a.completedTimePosix ?? 0),
      );
  }
  static get currentUsersCompletedDeliveries() {
    return Delivery.currentUsersDeliveries
      .filter((delivery) => delivery.isCompleted)
      .sort(
        (a, b) => (b.completedTimePosix ?? 0) - (a.completedTimePosix ?? 0),
      );
  }
  static get usersDeliveriesSince3am() {
    const threeAm = doNow(() => {
      const now = new Date();
      const yesterday = new Date(now.valueOf() - 86400000);
      const isBefore3Am = now.getHours() < 3;
      const threeAm = new Date(isBefore3Am ? yesterday : now);
      threeAm.setHours(3, 0, 0, 0);
      return threeAm;
    });
    return [
      ...Delivery.currentUsersUpcomingDeliveries,
      ...Delivery.currentUsersCompletedDeliveries.filter(
        (delivery) => (delivery.completedTimePosix ?? 0) > threeAm.getTime(),
      ),
    ];
  }

  // Client
  _isOneTimeClient = prop(Boolean, false);
  _client = prop([Client, null], null);
  selectedClient: SelectedClient = formula(
    () => (this._isOneTimeClient ? ONE_TIME : this._client ?? NONE_SELECTED),
    (value) => {
      if (value === ONE_TIME) {
        this._isOneTimeClient = true;
        this._client = null;
      } else if (value === NONE_SELECTED) {
        this._isOneTimeClient = false;
        this._client = null;
      } else {
        this._isOneTimeClient = false;
        this._client = value;
      }
    },
  );
  readonly selectedClientDoc = formula(() =>
    this.selectedClient instanceof Client ? this.selectedClient : null,
  );

  // Title
  title = formula<string>(
    () => {
      return this.selectedClient === ONE_TIME
        ? this._manualTitle
        : getClientLabel(this.selectedClient);
    },
    (value) => {
      this._manualTitle = value;
    },
  );
  _manualTitle = prop(String, ``, {
    key: `clientLabel`,
  });
  static getMayEditTitle(selectedClient: SelectedClient) {
    return selectedClient === ONE_TIME;
  }
  readonly mayEditTitle = formula(() =>
    Delivery.getMayEditTitle(this.selectedClient),
  );

  // Address & Phone
  static getMayEditAddressAndPhone(selectedClient: SelectedClient) {
    return selectedClient === ONE_TIME;
  }
  readonly mayEditAddressAndPhone = formula(() =>
    Delivery.getMayEditAddressAndPhone(this.selectedClient),
  );
  address = formula(
    () =>
      this.selectedClient === ONE_TIME
        ? this._manualClientAddress
        : this.selectedClient?.address ?? ``,
    (value) => {
      this._manualClientAddress = value;
    },
  );
  _manualClientAddress = prop(String, ``, {
    key: `clientAddress`,
  });
  phoneNumber = formula(
    () =>
      this.selectedClient === ONE_TIME
        ? this._manualPhoneNumber
        : this.selectedClient?.phoneNumber ?? ``,
    (value) => {
      this._manualPhoneNumber = value;
    },
  );
  _manualPhoneNumber = prop(String, ``, {
    key: `clientPhoneNumber`,
  });

  // Rate Offset
  _manualRateOffset = prop([Number, null], null);
  rateOffsetFromClient: number | null = formula(() =>
    this.selectedClient === ONE_TIME
      ? this._manualRateOffset
      : this.selectedClient === NONE_SELECTED
      ? null
      : this.selectedClient?.rateOffset,
  );

  // Notes
  notes = prop(String, ``);

  // Sort Position
  sortPosition = prop(Number);

  // Sub Deliveries
  // private _subDeliveries: SubDelivery[] = [];
  // private _subDeliveriesSig: Prop<SubDelivery[]> = useProp([]);
  readonly subDeliveries = list(SubDelivery, `mx_parent`);
  readonly sortedSubDeliveries = formula(() =>
    FloatSort.toSorted({
      list: this.subDeliveries,
      getPos: (sub) => sub.sortPosition,
      getUid: (sub) => sub.docId ?? ``,
    }),
  );
  readonly incompleteSubDeliveries = formula(() =>
    this.sortedSubDeliveries.filter((sub) => !sub.isCompleted),
  );
  readonly completedSubDeliveries = formula(() =>
    this.sortedSubDeliveries
      .filter((subDelivery) => subDelivery.isCompleted)
      .sort((a, b) => a.completedTimePosix! - b.completedTimePosix!),
  );
  createSubDelivery() {
    return withLimitConfirmation({
      count: SubDelivery.limit.count,
      limit: SubDelivery.limit.max,
      labelSingular: `Individual Delivery`,
      labelPlural: `Individual Deliveries`,
      action: () =>
        SubDelivery.create({
          mx_parent: this,
          _sortPosition: FloatSort.getNewEndPos({
            list: this.sortedSubDeliveries,
            getPos: (sub) => sub.sortPosition,
            getUid: (sub) => sub.docId ?? ``,
          }),
          _isJustFuel: this.selectedClient === ONE_TIME,
        }),
    });
  }
  readonly totalMoney = formula(() =>
    formatNumWithCommas(
      Math.ceil(
        this.sortedSubDeliveries.reduce(
          (sum, sub) => sum + (sub.isCompleted ? sub.sales : 0),
          0,
        ) * 100,
      ) / 100,
      2,
    ),
  );

  // Creation Time
  creationTimePosix = prop(Number);

  // User
  user = prop(String, ``);
  createdBy = prop([String, null]);

  // Checks
  readonly isValid = formula(() => !exists(this.invalidError));
  readonly invalidError = formula((): string | undefined => {
    if (this.selectedClient === NONE_SELECTED) return "Please select a client.";
    if (this.selectedClient === ONE_TIME && this.title.trim() === ``)
      return "Please enter a name.";
    if (this.selectedClient !== ONE_TIME && !isClientValid(this.selectedClient))
      return "Please select a valid client.";
    if (this.isDeleted) return `This delivery has been deleted.`;
    return undefined;
  });
  readonly isCompleted = formula(() => this.completedTimePosix !== null);
  readonly completedTimePosix = formula(() => {
    let mostRecent: number | null = null;
    for (const sub of this.sortedSubDeliveries) {
      if (!sub.isCompleted) return null;
      mostRecent = Math.max(mostRecent ?? 0, sub.completedTimePosix ?? 0);
    }
    return mostRecent;
  });
}

// SECTION: SubDelivery
export type SelectedTank = Tank | JUST_FUEL | NONE_SELECTED;
export type SelectedFuel = FuelType | ONE_TIME | NONE_SELECTED;
export class SubDelivery extends mfs.Doc(`SubDelivery`) {
  static readonly limit = createLimitTrackers({
    free: 90,
    premium: 300000,
    getPremiumEnabled: () => premiumEnabled.value,
    getCount: () => Delivery.getAllDocs().length,
  });

  // Delivery
  mx_parent = prop(Delivery);
  readonly delivery = formula(() => {
    // We have to do this cast otherwise this prop is flagged as required
    return this.mx_parent as Delivery;
  });

  // Sort Position
  _sortPosition = prop([Number, null], null);

  // Tank
  _isJustFuel = prop([Boolean, null], null);
  _tank = prop([Tank, null], null);
  readonly shouldShowTankSelector = formula(() =>
    exists(this.delivery?.selectedClientDoc),
  );
  selectedTank: SelectedTank = formula(
    () => {
      return this._isJustFuel ||
        (!this.shouldShowTankSelector && !exists(this._tank))
        ? JUST_FUEL
        : this._tank ?? NONE_SELECTED;
    },
    (value) => {
      if (value === JUST_FUEL) {
        this._isJustFuel = true;
        this._tank = null;
      } else if (value === NONE_SELECTED) {
        this._isJustFuel = false;
        this._tank = null;
      } else {
        this._isJustFuel = false;
        this._tank = value;
      }
    },
  );
  readonly selectedKnownTank = formula(() =>
    this.selectedTank !== JUST_FUEL && this.selectedTank !== NONE_SELECTED
      ? this.selectedTank
      : null,
  );
  readonly tankGeometry: TankGeometry | null = formula(
    () => this.selectedKnownTank ?? null,
  );

  // Fuel
  _isOneTimeFuel = prop(Boolean, false);
  _fuelType = prop([FuelType, null], null);
  readonly shouldShowFuelSelector = formula(
    () => this.selectedTank === JUST_FUEL,
  );
  selectedFuel: SelectedFuel = formula(
    () => {
      return this._isOneTimeFuel ? ONE_TIME : this._fuelType ?? NONE_SELECTED;
    },
    (value) => {
      if (value === ONE_TIME) {
        this._isOneTimeFuel = true;
        this._fuelType = null;
      } else if (value === NONE_SELECTED) {
        this._isOneTimeFuel = false;
        this._fuelType = null;
      } else {
        this._isOneTimeFuel = false;
        this._fuelType = value;
      }
    },
  );

  readonly showFuelNameAndRate = formula(() => this.selectedFuel === ONE_TIME);

  // Fuel Name
  _fuelName = prop(String, ``, {
    key: `fuelName`,
  });
  explicitFuelName: string = formula(
    () => this._fuelName ?? ``,
    (value) => {
      this._fuelName = value;
    },
  );
  // Rate
  _rate = prop([Number, null], null, {
    key: `rate`,
  });
  explicitRate: number | null = formula(
    () => this._rate ?? null,
    (value) => {
      this._rate = value;
    },
  );
  explicitRateOffset = prop([Number, null], null);
  readonly actualFuelType = formula(() =>
    this.selectedTank === JUST_FUEL
      ? this.selectedFuel
      : this.selectedKnownTank?.fuelType ?? NONE_SELECTED,
  );

  readonly fuelSpecs = formula(() => {
    // Only apply rate offset if there is a selected client, and the user has not manually typed a rate.
    const rateOffsetFromClient = this.delivery?.rateOffsetFromClient ?? 0;
    const baseFuelRate = doNow(() => {
      if (this.isCompleted) {
        // Use the explicit value
        return {
          name: this.explicitFuelName,
          baseRate: this.explicitRate,
          rateOffset: this.explicitRateOffset,
        };
      } else if (exists(this.selectedKnownTank)) {
        // Infer from Tank info
        return {
          name: this.selectedKnownTank.fuelType?.name ?? null,
          baseRate: this.selectedKnownTank.fuelType?.rate ?? null,
          rateOffset: rateOffsetFromClient,
        };
      } else {
        // Infer from selected Fuel
        if (this.selectedFuel === ONE_TIME) {
          return {
            name: this.explicitFuelName,
            baseRate: this.explicitRate,
            rateOffset: this.explicitRateOffset,
          };
        } else if (this.selectedFuel instanceof FuelType) {
          return {
            name: this.selectedFuel.name ?? null,
            baseRate: this.selectedFuel.rate ?? null,
            rateOffset: rateOffsetFromClient,
          };
        } else {
          return {
            name: null,
            baseRate: null,
            rateOffset: null,
          };
        }
      }
    });
    return {
      ...baseFuelRate,
      effectiveRate: calcEffectiveRate({
        baseRate: baseFuelRate.baseRate ?? 0,
        rateOffset: baseFuelRate.rateOffset ?? 0,
      }),
    };
  });

  // Gallons
  gallons = prop([Number, null], null);

  //Sticked Inches Before Filling
  stickedInchesBeforeFilling = prop([Number, null], null);

  //sticked Inches After Filling
  stickedInchesAfterFilling = prop([Number, null], null);

  // Sales
  readonly sales = formula(() =>
    calcSales({
      effectiveRate: this.fuelSpecs?.effectiveRate ?? 0,
      gallons: this.gallons ?? 0,
    }),
  );

  // Full Title
  readonly title = formula(() => {
    const gallonsPart = `${formatNumWithCommas(this.gallons ?? 0, 0)} gal.`;
    const fuelPart = `of ${this.fuelSpecs?.name ?? `an unknown fuel`}`;
    const tankPart =
      this.selectedTank instanceof Tank
        ? ` to ${this.selectedTank.getLabel({
            excludeParts: [`fuel`, `volume`],
          })}`
        : ``;

    return `${gallonsPart}${fuelPart}${tankPart}`;
  });

  // Sort Position
  sortPosition = formula(
    () => {
      if (!exists(this._sortPosition)) {
        this._sortPosition = Math.floor(Math.random() * 100);
      }
      return this._sortPosition;
    },
    (value) => {
      this._sortPosition = value;
    },
  );

  // Completion
  isCompleted = formula(() => exists(this.completedTimePosix));
  completedTimePosix = prop([Number, null], null);
  // TODO: In future this should be tied per user not per device. We need to fix that after we upgrade Mufasa.
  static readonly _numSubDeliveriesCompleted = autoSavingProp<number>(
    `numSubDeliveriesCompleted`,
    0,
  );
  static get numSubDeliveriesCompleted() {
    return SubDelivery._numSubDeliveriesCompleted.value;
  }
  complete(props: {
    fuelName: string;
    rate: number;
    gallons: number;
    rateOffset: number;
    stickedInchesBeforeFilling: number;
    stickedInchesAfterFilling: number | null;
  }) {
    this.explicitFuelName = props.fuelName;
    this.explicitRate = props.rate;
    this.gallons = props.gallons;
    this.explicitRateOffset = props.rateOffset;
    this.stickedInchesBeforeFilling = props.stickedInchesBeforeFilling;
    this.stickedInchesAfterFilling = props.stickedInchesAfterFilling;
    this.completedTimePosix = Date.now();
    SubDelivery._numSubDeliveriesCompleted.value += 1;
  }
  unComplete() {
    this.completedTimePosix = null;
  }

  // Validity
  readonly isValid = formula(
    () => !exists(this.subInvalidError) || this.subInvalidError.trim() === ``,
  );
  readonly tanksIsFromADifferentClientThanDelivery = formula(
    () =>
      exists(this.selectedKnownTank) &&
      exists(this.delivery.selectedClient) &&
      this.delivery.selectedClient != ONE_TIME &&
      !this.delivery.selectedClient.tanks?.has(this.selectedKnownTank),
  );
  readonly subInvalidError = formula<string | undefined>(() => {
    const nonGallonsErrorMessage = doNow(() => {
      // Fuel
      const explicitFuelError =
        !exists(this.explicitFuelName) || this.explicitFuelName.trim() === ``
          ? `Give the fuel a name.`
          : !exists(this.explicitRate) || this.explicitRate < 0
          ? `Give the fuel a rate.`
          : undefined;

      // Completed
      if (this.isCompleted) return explicitFuelError;

      if (this.selectedKnownTank?.isDeleted) {
        return `The tank you selected has been deleted.`;
      } else if (this.tanksIsFromADifferentClientThanDelivery) {
        return `This tank is from a different client.`;
      }

      // Selected Tank
      if (this.selectedTank === NONE_SELECTED) {
        // No Tank
        return this.delivery?.selectedClient !== ONE_TIME &&
          this.delivery?.selectedClient !== NONE_SELECTED
          ? `Please select a tank.`
          : explicitFuelError;
      } else if (this.selectedTank === JUST_FUEL) {
        // Just Fuel
        return this.selectedFuel === NONE_SELECTED
          ? `Please select a fuel.`
          : this.selectedFuel === ONE_TIME
          ? explicitFuelError
          : !FuelType.isValid(this.selectedFuel)
          ? `Please select a valid fuel.`
          : undefined;
      } else {
        // Tank
        return !exists(this.selectedTank)
          ? `Please select a tank.`
          : !isTankValid(this.selectedTank)
          ? `Please select a valid tank.`
          : !FuelType.isValid(this.selectedTank.fuelType)
          ? `Please select a valid fuel.`
          : undefined;
      }
    });

    // Gallons
    const gallonsErrorMessage =
      !exists(this.gallons) || this.gallons <= 0
        ? `Gallons must be greater than 0.`
        : undefined;

    // We need Gallons error message to go last because it is the last field.
    return nonGallonsErrorMessage ?? gallonsErrorMessage;
  });
}
