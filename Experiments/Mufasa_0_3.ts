import type { Prop } from "mosa-js";
import { Session } from "../DocStore";
// Utils
class Schema {
  docId = ``;
}
function relationship(...params: any[]): any {
  const query = initCachedQuery({} as any);
}
function list(...params: any[]): any {
  relationship(params);
}
function readonlyList(...params: any[]): any {
  relationship(params);
}
function prop(...params: any[]): any {
  relationship(params);
}
function formula(...params: any[]): any {}
function savedProp(...params: any[]): any {}
type pending = typeof pending;
const pending = Symbol(`pending`);
type none = typeof none;
const none = Symbol(`none`);
type deleted = typeof deleted;
const deleted = Symbol(`deleted`);
function syncedProp<T>(config: {
  watchCloud: (watcher: (newVal: T) => void) => void;
  jsonPersister: any;
  sessionPersister: any;
}) {
  const prop = config.sessionPersister.useProp(pending) as {
    value: pending | T;
  };
  const savedJson = config.jsonPersister.init(none);
  savedJson.load.then(() => {
    prop.value = savedJson.value;
    config.watchCloud((newVal) => {
      config.jsonPersister.save(newVal);
      prop.value = newVal;
    });
  });
  return prop;
}
function initAuth(config: {
  onAuthChange: (listener: (uid: string | none | deleted) => void) => void;
  sessionPersister: Session.Persister;
  directoryPersister?: any;
  cloudQueryPersister?: any;
}) {
  const userId = syncedProp<none | string | deleted>({
    watchCloud: (watcher) => config.onAuthChange(watcher),
    jsonPersister: config.directoryPersister.jsonFile(`userId`),
    sessionPersister: config.sessionPersister,
  });
  const cachedQuery = config.sessionPersister.useFormula(() => {
    if (userId.value === pending) return pending;
    // Add sign-in options to none.
    if (userId.value === none) return none;
    if (userId.value === deleted) return deleted;
    const cachedQuery = initCachedQuery({
      query: {
        docId: userId.value,
      },
      sessionQueryPersister: config.sessionPersister,
      directoryPersister: config.directoryPersister,
      cloudQueryPersister: config.cloudQueryPersister,
    });
    config.sessionPersister.onDispose(() => cachedQuery.dispose());
    return cachedQuery;
  });
  return config.sessionPersister.useFormula(() => cachedQuery.value?.value);
}
const mfs = {} as any;

// SECTION: Questions
// - How does mfs.initAuth work?
// - How is a user associated with a doc?
// - How does the session persister interface with cachedQueries?

// Secret inside of Mufasa
// Will be pending until the first sync or until loaded from disk.
function initCachedQuery(config: {
  query:
    | {
        docId: string;
      }
    | {
        key: string;
        value: string;
      };
  sessionQueryPersister: any;
  directoryPersister?: any;
  cloudQueryPersister?: any;
}): Prop<pending | none | {} | deleted> & { dispose: () => void } {
  return {
    value: pending,
    dispose: () => {},
  };
}

// Data-plate
class User extends Schema {
  /* NOTE: This property is actually owned by the team. The user has no permission to
   * change it. Or maybe it requires joint permission between the user and the team.
   * I'm not sure yet. */
  readonly team = prop(Team, `owner`, { query: `` });
}
/**
 * UserTeam {
 *   user: User,
 *   role: `owner` | `member`,
 *   team: Team,
 * }
 */
const user: { value: User } = mfs.initAuth(User);
class Team extends Schema {
  readonly owner = prop(User);
  readonly entitlements = readonlyList(String);
  readonly clients = list(Client, `team`, { query: ``, defining: true });
  readonly assets = list(Asset, `team`, { query: ``, defining: true });
  readonly photos = list(Photo, `team`, { query: ``, defining: true });
}
class Client extends Schema {
  static get clients() {
    return user.value.team.clients;
  }
  readonly team = prop(Team);
  readonly asset = formula(() =>
    this.team.assets.find((asset: Asset) => asset.client.docId === this),
  );
}
class Asset extends Schema {
  readonly team = prop(Team);
  readonly client = prop(Client);
  readonly photos = formula(() =>
    this.team.photos.filter((photo: Photo) => photo.asset.docId === this),
  );
}
class Photo extends Schema {
  readonly team = prop(Team);
  readonly asset = prop(Asset);
}
