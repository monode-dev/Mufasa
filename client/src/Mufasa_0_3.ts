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
function initAuth(...params: any[]): any {}
const mfs = {} as any;

// SECTION: Questions
// - How does mfs.initAuth work?
// - How is a user associated with a doc?
// - How does the session persister interface with cachedQueries?

// Secret inside of Mufasa
function initCachedQuery(config: {
  sessionQueryPersister: any;
  directoryPersister?: any;
  cloudQueryPersister?: any;
}) {
  return {
    dispose: () => {},
  };
}

// Data-plate
class User extends Schema {
  readonly team = prop(Team, `owner`, { query: `` });
}
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
