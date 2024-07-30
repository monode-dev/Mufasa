import {
  getClientLabel,
  isClientValid,
  isTankValid,
  tankDisplayName,
} from "@/AppData";
import { Client } from "@/Clients/Client";
import { mfs, premiumEnabled, FuelType } from "@/model/DataModel";
import { createLimitTrackers } from "@/model/LimitUtils";
import { TankGeometry } from "@/Calculator/ShapeUtils";
import { Tank } from "@/Tanks/Tank";
import {
  JUST_FUEL,
  NONE_SELECTED,
  ONE_TIME,
  formatNumWithCommas,
} from "@/utils";
import { FloatSort, doNow, exists, useProp } from "miwi";
import { prop, list, formula } from "mufasa";
import { withLimitConfirmation } from "@/model/LimitUi";

// SECTION: Delivery
export type SelectedClient = Client | ONE_TIME | NONE_SELECTED;

const invalid = `!Invalid - `;
export class Delivery extends mfs.Doc(`Delivery`) {
  static readonly limit = createLimitTrackers({
    free: 30,
    premium: 100000,
    getPremiumEnabled: () => premiumEnabled.value,
    getCount: () => Delivery.getAllDocs().length,
  });
  _isOneTimeClient = prop(Boolean, false);
  _client = prop([Client, null], null);
  clientLabel = prop(String, ``);
  clientAddress = prop(String, ``);
  clientPhoneNumber = prop(String, ``);
  onDelete() {
    this.sortedSubDeliveries.forEach((subDelivery) => subDelivery.deleteDoc());
  }

  static get upcomingDeliveriesForAllUsers() {
    return FloatSort.toSorted({
      list: Delivery.getAllDocs().filter((delivery) => !delivery.isCompleted),
      getPos: (delivery) => delivery.sortPosition,
      getUid: (delivery) => delivery.docId ?? ``,
    });
  }
  static get upcomingDeliveries() {
    return this.upcomingDeliveriesForAllUsers;
  }
  static get completedDeliveriesForAllUsers() {
    return Delivery.getAllDocs()
      .filter((delivery) => delivery.isCompleted)
      .sort(
        (a, b) => (b.completedTimePosix ?? 0) - (a.completedTimePosix ?? 0),
      );
  }
  static get completedDeliveries() {
    return this.completedDeliveriesForAllUsers;
  }

  // Client
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
  readonly selectedKnownClient = formula(() =>
    this.selectedClient !== ONE_TIME && this.selectedClient !== NONE_SELECTED
      ? this.selectedClient
      : null,
  );

  // Label
  static getMayEditLabel(selectedClient: SelectedClient) {
    return selectedClient === ONE_TIME;
  }
  readonly mayEditLabel = formula(() =>
    Delivery.getMayEditLabel(this.selectedClient),
  );
  label = formula(
    () => this.clientLabel ?? ``,
    (value) => {
      this.clientLabel = value;
    },
  );
  readonly invalidError = useProp(``);
  readonly title = formula(() => {
    const v = this.isValid;
    const valid = v[0] ? `` : invalid;
    this.invalidError.value = v[1];
    const client = this.selectedClient;
    const name = client === ONE_TIME ? this.label : getClientLabel(client);
    return valid + name;
  });

  // Address & Phone
  static getMayEditAddressAndPhone(selectedClient: SelectedClient) {
    return selectedClient === ONE_TIME;
  }
  readonly mayEditAddressAndPhone = formula(() =>
    Delivery.getMayEditAddressAndPhone(this.selectedClient),
  );
  explicitAddress = formula(
    () => this.clientAddress ?? ``,
    (value) => {
      this.clientAddress = value;
    },
  );
  readonly address = formula(() =>
    this.selectedClient === ONE_TIME
      ? this.explicitAddress
      : (this.selectedClient?.address ?? ``),
  );
  explicitPhoneNumber = formula(
    () => this.clientPhoneNumber ?? ``,
    (value) => {
      this.clientPhoneNumber = value;
    },
  );
  readonly phoneNumber = formula(() =>
    this.selectedClient === ONE_TIME
      ? this.explicitPhoneNumber
      : (this.selectedClient?.phoneNumber ?? ``),
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

  readonly totalMoney = formula(() =>
    formatNumWithCommas(
      this.sortedSubDeliveries.reduce((sum, sub) => sum + sub.income, 0),
      2,
    ),
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
        }),
    });
  }

  // Creation Time
  creationTimePosix = prop(Number);

  // User
  user = prop(String, ``);

  // Checks
  readonly isValid = formula((): [boolean, string] => {
    if (this.selectedClient === NONE_SELECTED)
      return [false, "Please select a client."];
    if (this.selectedClient === ONE_TIME && this.label.trim() === ``)
      return [false, "Please enter a name."];
    if (this.selectedClient !== ONE_TIME && !isClientValid(this.selectedClient))
      return [false, "Please select a valid client."];
    this.sortedSubDeliveries.forEach((sub) => {
      if (!sub.isValid) {
        return [false, sub.subInvalidError];
      }
    });
    return [true, ``];
  });

  readonly isCompleted = formula(
    () =>
      this.sortedSubDeliveries.length > 0 && this.completedTimePosix !== null,
  );
  readonly completedTimePosix = formula(() => {
    let mostRecent = 0;
    for (const sub of this.sortedSubDeliveries) {
      if (!sub.isCompleted) return null;
      mostRecent = Math.max(mostRecent, sub.completedTimePosix ?? 0);
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
  _isJustFuel = prop([Boolean, null], null);
  _tank = prop([Tank, null], null);
  _isOneTimeFuel = prop(Boolean, false);
  _fuelType = prop([FuelType, null], null);
  fuelName = prop(String, ``);
  rate = prop([Number, null], null);
  _sortPosition = prop([Number, null], null);

  // Tank
  readonly shouldShowTankSelector = formula(
    () =>
      (this.selectedTank !== JUST_FUEL &&
        this.selectedTank !== NONE_SELECTED) ||
      exists(this.delivery?.selectedKnownClient),
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
    () =>
      this.selectedTank === JUST_FUEL ||
      this.delivery?.selectedClient === ONE_TIME,
  );
  selectedFuel: SelectedFuel = formula(
    () => {
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

  // Fuel Name
  readonly shouldShowFuelNameField = formula(
    () => this.selectedFuel === ONE_TIME,
  );
  explicitFuelName: string = formula(
    () => this.fuelName ?? ``,
    (value) => {
      this.fuelName = value;
    },
  );

  // Rate
  readonly shouldShowFuelRateField = formula(
    () => this.selectedFuel === ONE_TIME,
  );
  explicitRate: number | null = formula(
    () => this.rate ?? null,
    (value) => {
      this.rate = value;
    },
  );
  readonly fuelSpecs = formula(() => {
    if (exists(this.selectedKnownTank)) {
      const fuelType = this.selectedKnownTank.fuelType;
      return exists(fuelType)
        ? {
            name: fuelType.name ?? null,
            rate:
              this.explicitRate !== fuelType.rate
                ? this.explicitRate
                : (fuelType.rate ?? null), //Used to be just be fuelType.rate so we would never use the users inputed rate.
          }
        : null;
    } else if (
      !this.shouldShowTankSelector ||
      this.selectedTank === JUST_FUEL
    ) {
      if (this.selectedFuel === ONE_TIME) {
        return {
          name: this.explicitFuelName,
          rate: this.explicitRate,
        };
      } else {
        return exists(this.selectedFuel)
          ? {
              name: this.selectedFuel.name ?? null,
              rate: this.selectedFuel.rate ?? null,
            }
          : null;
      }
    } else {
      return null;
    }
  });

  // Gallons
  gallons = prop([Number, null], null);

  // Income
  readonly income = formula(() => {
    return (this.fuelSpecs?.rate ?? 0) * (this.gallons ?? 0);
  });

  // Full Title
  readonly subTitle = formula(() => {
    const valid = this.isValid ? `` : invalid;
    const tank = this.selectedTank;
    if (tank === JUST_FUEL || !this.shouldShowTankSelector) {
      const fuel = this.selectedFuel;
      const fuelName =
        fuel === ONE_TIME ? this.explicitFuelName : (fuel?.name ?? ``);
      return `${valid}${formatNumWithCommas(this.gallons ?? 0, 0)} gal. of ${fuelName}`;
    } else return valid + tankDisplayName(tank);
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

  readonly isValid = formula(
    () => !exists(this.subInvalidError) || this.subInvalidError.trim() === ``,
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
      !exists(this.gallons) || this.gallons < 0
        ? `Gallons must be greater than 0.`
        : undefined;

    // We need Gallons error message to go last because it is the last field.
    return nonGallonsErrorMessage ?? gallonsErrorMessage;
  });

  complete(props: { fuelName: string; rate: number; gallons: number }) {
    this.explicitFuelName = props.fuelName;
    this.explicitRate = props.rate;
    this.gallons = props.gallons;
    this.completedTimePosix = Date.now();
  }

  unComplete() {
    this.completedTimePosix = null;
  }

  readonly delivery = formula(() => {
    // We have to do this cast otherwise this prop is flagged as required
    return this.mx_parent as Delivery;
  });
}
