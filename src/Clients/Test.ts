import { mfs } from "@/model/DataModel";
import { exists } from "miwi";
import { formula, prop } from "mufasa";

/* Steps:
 * 1. Combine prop() and list() into rel().
 * 2. Make rel() pass StoreBank to its children, instead of DocClasses
 *    managing their reference to their doc store.
 * 3. Remove legacy properties from DocClass
 * 4. Rewrite the user-doc caching code to use the DocClass instead of its current manual system.
 * 5. Figure out how to merge the StoreBank/StoreManager into doc store on an individual level. */

// User.currentUser // from mfs.UserDoc
// Doc.mfsParent // Make this be a prop of Doc so that is is reserved for mfs
// Maybe use Doc.mfsId instead of Doc.docId, so that all our special props start with "mfs"
class User extends mfs.UserDoc(`User`) {
  workspace = formula(() =>
    exists(this._ownedWorkspace) ? this._ownedWorkspace : this._joinedWorkspace,
  );
  _ownedWorkspace = rel(`one`, Workspace, `owner`);
  _joinedWorkspace = rel(`one`, Workspace, `members`);
}

class Workspace extends mfs.Doc(`Workspace`) {
  owner = rel(`parent`, User, `_ownedWorkspace`);
  members = rel(`many`, User, `_joinedWorkspace`);
  clients = rel(`many`, Client, `workspace`);
  deliveries = rel(`many`, Delivery, `workspace`);
  fuelTypes = rel(`many`, FuelType, `workspace`);
}

class Client extends mfs.Doc(`Client`) {
  workspace = rel(`parent`, Workspace, `clients`);
  name = prop(String);
  phoneNumber = prop(String, ``);
  additionalPhoneNumbers = rel(`many`, AdditionalPhoneNumber, `client`);
  address = prop(String, ``);
  notes = prop(String, ``);
  tanks = rel(`many`, Tank, `client`);
  deliveries = rel(`many`, Delivery, `client`);
}

class AdditionalPhoneNumber extends mfs.Doc(`AdditionalPhoneNumber`) {
  client = rel(`parent`, Client, `additionalPhoneNumbers`);
  name = prop(String);
  number = prop(String);
  sortPosition = prop(Number);
}

class Tank extends mfs.Doc(`Tank`) {
  client = rel(`parent`, Client, `tanks`);
  fuelType = rel(`one`, FuelType, `tanks`);
  shape = prop([String, null], null);
  length = prop([Number, null], null);
  depth = prop([Number, null], null);
  topDepth = prop([Number, null], null);
  fullDepth = prop([Number, null], null);
  height = prop([Number, null], null);
  squareHeight = prop([Number, null], null);
  wideHeight = prop([Number, null], null);
  fullHeight = prop([Number, null], null);
  diameter = prop([Number, null], null);
  notes = prop(String, ``);
  subDeliveries = rel(`many`, SubDelivery, `tank`);
}

class Delivery extends mfs.Doc(`Delivery`) {
  workspace = rel(`parent`, Workspace, `deliveries`);
  client = rel(`one`, Client, `deliveries`);
  deliveryTime = prop(Number);
  subDeliveries = rel(`many`, SubDelivery, `delivery`);
}

class SubDelivery extends mfs.Doc(`SubDelivery`) {
  delivery = rel(`parent`, Delivery, `subDeliveries`);
  tank = rel(`one`, Tank, `subDeliveries`);
  fuelType = rel(`one`, FuelType, `subDeliveries`);
  quantity = prop(Number);
}

class FuelType extends mfs.Doc(`FuelType`) {
  workspace = rel(`parent`, Workspace, `fuelTypes`);
  name = prop(String);
  rate = prop(Number);
  createdPosix = prop(Number);
  sortPos = prop(Number);
  tanks = rel(`many`, Tank, `fuelType`);
  subDeliveries = rel(`many`, SubDelivery, `fuelType`);
}

function rel<DocClass extends { new (): {} }>(
  otherQuantity: `one` | `one requiredOnCreate` | `parent` | `many`,
  otherClass: DocClass,
  otherKey: keyof InstanceType<DocClass>,
  options: {
    key?: string;
    persistance?: any;
  } = {},
) {}
