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
  static get upcomingDeliveries() {
    return FloatSort.toSorted({
      list: Delivery.getAllDocs().filter((delivery) => !delivery.isCompleted),
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

  // Client
  _isOneTimeClient = prop(Boolean, false);
  _client = prop([Client, null], null);
  selectedClient: SelectedClient = formula(
    () => (this._isOneTimeClient ? ONE_TIME : (this._client ?? NONE_SELECTED)),
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
      console.log(
        `this._manualTitle: ${JSON.stringify(this._manualTitle, null, 2)}`,
      );
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
        : (this.selectedClient?.address ?? ``),
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
        : (this.selectedClient?.phoneNumber ?? ``),
    (value) => {
      this._manualPhoneNumber = value;
    },
  );
  _manualPhoneNumber = prop(String, ``, {
    key: `clientPhoneNumber`,
  });

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
      this.sortedSubDeliveries.reduce((sum, sub) => sum + sub.sales, 0),
      2,
    ),
  );

  // Creation Time
  creationTimePosix = prop(Number);

  // User
  user = prop(String, ``);

  // Checks
  readonly isValid = formula(() => !exists(this.invalidError));
  readonly invalidError = formula((): string | undefined => {
    if (this.selectedClient === NONE_SELECTED) return "Please select a client.";
    if (this.selectedClient === ONE_TIME && this.title.trim() === ``)
      return "Please enter a name.";
    if (this.selectedClient !== ONE_TIME && !isClientValid(this.selectedClient))
      return "Please select a valid client.";
    if (this.isDeleted) return `This delivery has been deleted.`;
    const subInvalidError = this.sortedSubDeliveries.find(
      (sub) => !sub.isValid,
    )?.subInvalidError;
    if (subInvalidError) return subInvalidError;
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
  mx_parent = prop(Delivery);
  _isOneTimeFuel = prop(Boolean, false);
  _fuelType = prop([FuelType, null], null);
  fuelName = prop(String, ``);
  rate = prop([Number, null], null);
  _sortPosition = prop([Number, null], null);

  // Tank
  _isJustFuel = prop([Boolean, null], null);
  _tank = prop([Tank, null], null);
  readonly justFuelIsOnlyOptions = formula(
    () => !exists(this.delivery?.selectedClientDoc),
  );
  readonly shouldShowTankSelector = formula(
    () =>
      (this.selectedTank !== JUST_FUEL &&
        this.selectedTank !== NONE_SELECTED) ||
      exists(this.delivery?.selectedClientDoc),
  );
  selectedTank: SelectedTank = formula(
    () => {
      return this._isJustFuel ? JUST_FUEL : (this._tank ?? NONE_SELECTED);
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
  readonly tankGeometry: TankGeometry | null = formula(() =>
    this.shouldShowTankSelector &&
    this.selectedTank !== JUST_FUEL &&
    this.selectedTank !== NONE_SELECTED
      ? this.selectedTank
      : null,
  );

  // Fuel
  readonly shouldShowFuelSelector = formula(
    () => this.selectedTank === JUST_FUEL,
  );
  selectedFuel: SelectedFuel = formula(
    () => {
      const selectedFuel = this._isOneTimeFuel
        ? ONE_TIME
        : (this._fuelType ?? NONE_SELECTED);
      console.log(
        `selectedFuel instanceof FuelType: ${selectedFuel instanceof FuelType}`,
      );
      return this._isOneTimeFuel ? ONE_TIME : (this._fuelType ?? NONE_SELECTED);
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
  computedFuelType: FuelType | null = formula(() =>
    this.selectedFuel === ONE_TIME ? null : (this.selectedFuel as FuelType),
  );

  readonly showFuelNameAndRate = formula(() => this.selectedFuel === ONE_TIME);

  // Fuel Name
  explicitFuelName: string = formula(
    () => this.fuelName ?? ``,
    (value) => {
      this.fuelName = value;
    },
  );

  // Rate
  explicitRate: number | null = formula(
    () => this.rate ?? null,
    (value) => {
      this.rate = value;
    },
  );

  readonly fuelSpecs = formula(() => {
    if (this.isCompleted) {
      // Use the explicit value
      return {
        name: this.explicitFuelName,
        rate: this.explicitRate,
      };
    } else if (exists(this.selectedKnownTank)) {
      // Infer from Tank info
      return {
        name: this.selectedKnownTank.fuelType?.name ?? null,
        rate: this.selectedKnownTank.fuelType?.rate ?? null,
      };
    } else {
      // Infer from selected Fuel
      if (this.selectedFuel === ONE_TIME) {
        return {
          name: this.explicitFuelName,
          rate: this.explicitRate,
        };
      } else if (this.selectedFuel instanceof FuelType) {
        return {
          name: this.selectedFuel.name ?? null,
          rate: this.selectedFuel.rate ?? null,
        };
      } else {
        return {
          name: null,
          rate: null,
        };
      }
    }
  });

  // Gallons
  gallons = prop([Number, null], null);

  // Sales
  readonly sales = formula(() => {
    return (this.fuelSpecs?.rate ?? 0) * (this.gallons ?? 0) * (Number(this.delivery?.selectedClientDoc?.offsetRate) <= 0 ? 1 : Number(this.delivery?.selectedClientDoc?.offsetRate));
  });

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
  complete(props: { fuelName: string; rate: number; gallons: number }) {
    this.explicitFuelName = props.fuelName;
    this.explicitRate = props.rate;
    this.gallons = props.gallons;
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
      this.delivery.selectedClient != ONE_TIME &&
      !this.delivery.selectedClient?.tanks?.has(this.selectedKnownTank),
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

  readonly delivery = formula(() => {
    // We have to do this cast otherwise this prop is flagged as required
    return this.mx_parent as Delivery;
  });
}
