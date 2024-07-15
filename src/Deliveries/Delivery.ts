// noinspection t

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
} from "@/Utils";
import { FloatSort, doNow, exists } from "miwi";
import { prop, list } from "mufasa";

// SECTION: Delivery
export type SelectedClient = Client | ONE_TIME | NONE_SELECTED;

const invalid = `!Invalid - `;
export class Delivery extends mfs.Doc(`Delivery`) {
  static readonly limit = createLimitTrackers({
    free: 10,
    premium: 100,
    getPremiumEnabled: () => premiumEnabled.value,
    getCount: () => Delivery.getAllDocs().length,
  });
  _isOneTimeClient = prop(Boolean, false);
  _client = prop([Client, null], null);
  clientLabel = prop(String, ``);
  clientAddress = prop(String, ``);
  clientPhoneNumber = prop(String, ``);
  onDelete() {
    this.floatSortedSubDeliveries.forEach((subDelivery) =>
      subDelivery.deleteDoc(),
    );
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
  get selectedClient() {
    return this._isOneTimeClient ? ONE_TIME : this._client ?? NONE_SELECTED;
  }
  set selectedClient(value) {
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
  }
  get selectedKnownClient(): Client | null {
    return this.selectedClient !== ONE_TIME &&
      this.selectedClient !== NONE_SELECTED
      ? this.selectedClient
      : null;
  }

  // Label
  static getMayEditLabel(selectedClient: SelectedClient) {
    return selectedClient === ONE_TIME;
  }
  get mayEditLabel() {
    return Delivery.getMayEditLabel(this.selectedClient);
  }
  get label() {
    return this.clientLabel ?? ``;
  }
  set label(value: string) {
    this.clientLabel = value;
  }
  get title() {
    const valid = this.isValid ? `` : invalid;
    const client = this.selectedClient;
    const name = client === ONE_TIME ? this.label : getClientLabel(client);
    return valid + name;
  }

  // Address & Phone
  static getMayEditAddressAndPhone(selectedClient: SelectedClient) {
    return selectedClient === ONE_TIME;
  }
  get mayEditAddressAndPhone() {
    return Delivery.getMayEditAddressAndPhone(this.selectedClient);
  }
  get explicitAddress() {
    return this.clientAddress ?? ``;
  }
  set explicitAddress(value: string) {
    this.clientAddress = value;
  }
  get address() {
    return this.selectedClient === ONE_TIME
      ? this.explicitAddress
      : this.selectedClient?.address ?? ``;
  }
  get explicitPhoneNumber() {
    return this.clientPhoneNumber ?? ``;
  }
  set explicitPhoneNumber(value: string) {
    this.clientPhoneNumber = value;
  }
  get phoneNumber() {
    return this.selectedClient === ONE_TIME
      ? this.explicitPhoneNumber
      : this.selectedClient?.phoneNumber ?? ``;
  }

  // Notes
  notes = prop(String, ``);

  // Sort Position
  sortPosition = prop(Number);

  // Sub Deliveries
  // private _subDeliveries: SubDelivery[] = [];
  // private _subDeliveriesSig: Prop<SubDelivery[]> = useProp([]);
  readonly subDeliveries = list(SubDelivery, `mx_parent`);
  get floatSortedSubDeliveries(): ReadonlyArray<SubDelivery> {
    return FloatSort.toSorted({
      list: this.subDeliveries,
      getPos: (sub) => sub.sortPosition,
      getUid: (sub) => sub.docId ?? ``,
    });
  }

  get incompleteSubDeliveries(): ReadonlyArray<SubDelivery> {
    return this.floatSortedSubDeliveries.filter((sub) => !sub.isCompleted);
  }

  get completedSubDeliveries(): ReadonlyArray<SubDelivery> {
    return this.floatSortedSubDeliveries
      .filter((subDelivery) => subDelivery.isCompleted)
      .sort((a, b) => a.completedTimePosix! - b.completedTimePosix!);
  }

  get sortedSubDeliveries(): ReadonlyArray<SubDelivery> {
    // Combine the two arrays
    return [...this.incompleteSubDeliveries, ...this.completedSubDeliveries];
  }

  get totalMoney() {
    return formatNumWithCommas(
      this.floatSortedSubDeliveries.reduce((sum, sub) => sum + sub.income, 0),
      2,
    );
  }

  createSubDelivery() {
    return SubDelivery.create({
      mx_parent: this,
      _sortPosition: FloatSort.getNewEndPos({
        list: this.floatSortedSubDeliveries,
        getPos: (sub) => sub.sortPosition,
        getUid: (sub) => sub.docId ?? ``,
      }),
    });
  }

  // Creation Time
  creationTimePosix = prop(Number);

  // User
  user = prop(String, ``);

  // Checks
  get isValid() {
    if (this.selectedClient === NONE_SELECTED) return false;
    if (this.selectedClient === ONE_TIME && this.label.trim() === ``)
      return false;
    if (this.selectedClient !== ONE_TIME && !isClientValid(this.selectedClient))
      return false;
    return !this.floatSortedSubDeliveries.some((sub) => !sub.isValid);
  }

  get isCompleted() {
    return (
      this.floatSortedSubDeliveries.length > 0 &&
      this.floatSortedSubDeliveries.every((sub) => sub.isCompleted)
    );
  }
  get completedTimePosix() {
    if (!this.isCompleted) return null;
    return Math.max(
      ...this.floatSortedSubDeliveries.map((sub) => sub.completedTimePosix!),
    );
  }
}

// SECTION: SubDelivery
export type SelectedTank = Tank | JUST_FUEL | NONE_SELECTED;
export type SelectedFuel = FuelType | ONE_TIME | NONE_SELECTED;
export class SubDelivery extends mfs.Doc(`SubDelivery`) {
  static readonly limit = createLimitTrackers({
    free: 10,
    premium: 100,
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
  get shouldShowTankSelector() {
    return (
      (this.selectedTank !== JUST_FUEL &&
        this.selectedTank !== NONE_SELECTED) ||
      exists(this.delivery?.selectedKnownClient)
    );
  }
  get selectedTank() {
    if (!exists(this._isJustFuel) || !exists(this._tank)) {
      return NONE_SELECTED;
    }
    return this._isJustFuel ? JUST_FUEL : this._tank;
  }
  set selectedTank(value: SelectedTank) {
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
  }
  get selectedKnownTank(): Tank | null {
    return this.selectedTank !== JUST_FUEL &&
      this.selectedTank !== NONE_SELECTED
      ? this.selectedTank
      : null;
  }
  get tankGeometry(): TankGeometry | null {
    return this.shouldShowTankSelector &&
      this.selectedTank !== JUST_FUEL &&
      this.selectedTank !== NONE_SELECTED
      ? this.selectedTank
      : null;
  }

  // Fuel
  get shouldShowFuelSelector() {
    return (
      this.selectedTank === JUST_FUEL ||
      this.delivery?.selectedClient === ONE_TIME
    );
  }
  get selectedFuel() {
    if (!exists(this._isOneTimeFuel) || !exists(this._fuelType)) {
      return NONE_SELECTED;
    }
    return this._isOneTimeFuel ? ONE_TIME : this._fuelType;
  }
  set selectedFuel(value: SelectedFuel) {
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
  }

  // Fuel Name
  get shouldShowFuelNameField() {
    return this.selectedFuel === ONE_TIME;
  }
  get explicitFuelName() {
    return this.fuelName ?? ``;
  }
  set explicitFuelName(value: string) {
    this.fuelName = value;
  }

  // Rate
  get shouldShowFuelRateField() {
    return this.selectedFuel === ONE_TIME;
  }
  get explicitRate() {
    return this.rate ?? null;
  }
  set explicitRate(value: number | null) {
    this.rate = value;
  }
  get fuelSpecs(): {
    name: string | null;
    rate: number | null;
  } | null {
    if (exists(this.selectedKnownTank)) {
      const fuelType = this.selectedKnownTank.fuelType;
      return exists(fuelType)
        ? {
            name: fuelType.name ?? null,
            rate: fuelType.rate ?? null,
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
  }

  // Gallons
  gallons = prop([Number, null], null);

  // Income
  get income() {
    return (this.fuelSpecs?.rate ?? 0) * (this.gallons ?? 0);
  }

  // Full Title
  get subTitle() {
    const valid = this.isValid ? `` : invalid;
    const tank = this.selectedTank;
    if (tank === JUST_FUEL || !this.shouldShowTankSelector) {
      const fuel = this.selectedFuel;
      const fuelName =
        fuel === ONE_TIME ? this.explicitFuelName : fuel?.name ?? ``;
      return `${valid}${formatNumWithCommas(this.gallons ?? 0, 0)} gal. of ${fuelName}`;
    } else return valid + tankDisplayName(tank);
  }

  // Sort Position
  get sortPosition() {
    if (!exists(this._sortPosition)) {
      this._sortPosition = Math.floor(Math.random() * 100);
    }
    return this._sortPosition;
  }
  set sortPosition(value: number) {
    this._sortPosition = value;
  }

  // Completion
  get isCompleted() {
    return exists(this.completedTimePosix);
  }
  completedTimePosix = prop([Number, null], null);
  get isValid() {
    const fuelNameIsValid =
      exists(this.explicitFuelName) && this.explicitFuelName.trim() !== ``;
    const rateIsValid = exists(this.explicitRate) && this.explicitRate >= 0;
    const gallonsIsValid = exists(this.gallons) && this.gallons >= 0;
    const payloadIsValid = doNow(() => {
      if (this.isCompleted) {
        return fuelNameIsValid && rateIsValid;
      } else {
        if (this.selectedTank === NONE_SELECTED) {
          if (this.delivery?.selectedClient !== ONE_TIME) return false;
          else return fuelNameIsValid && rateIsValid;
        }
        if (this.selectedTank === JUST_FUEL) {
          if (this.selectedFuel === NONE_SELECTED) return false;
          return this.selectedFuel === ONE_TIME
            ? fuelNameIsValid && rateIsValid
            : FuelType.isValid(this.selectedFuel);
        } else {
          return (
            exists(this.selectedTank) &&
            isTankValid(this.selectedTank) &&
            FuelType.isValid(this.selectedTank.fuelType)
          );
        }
      }
    });
    return payloadIsValid && gallonsIsValid;
  }
  complete(props: { fuelName: string; rate: number; gallons: number }) {
    this.explicitFuelName = props.fuelName;
    this.explicitRate = props.rate;
    this.gallons = props.gallons;
    this.completedTimePosix = Date.now();
  }
  // TODO: Implement an un-complete method

  get delivery() {
    // We have to do this cast otherwise this prop is flagged as required
    return this.mx_parent as Delivery;
  }
}
