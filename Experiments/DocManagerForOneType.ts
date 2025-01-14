/** Invalid - There doesn't seem to  be a way to intersect anything with null or undefined without it turning into never. */
// export type invalid = typeof invalid;
// export const invalid = Symbol("invalid");
// Pending
export type pending = typeof pending;
export const pending = undefined;
// None
export type none = typeof none;
export const none = null;

const sourcesOfDmfotReferences: { [sourceId: string]: DmfotReferenceSource } =
  {};

// This needs to story the necessary information to run a firebase query
type DmfotReference = {
  path: string;
  // Maybe this should be an object. I'm not sure yet.
  queryParams: string;
  // I think we need this to track where a reference came from.
  dmfotReferenceSourceId: string;
};
/** This approach is a little flawed. It assumes we haven't loaded anything or have loaded everything.
 * It is quite possible that we will have only loaded some things, but no others yet. Especially when
 * doing start-up in chunks so that the app boots faster. */
type DmfotReferenceSource = pending | DmfotReference[];
export function createDocManagerForOneType(config: {
  typeId: string;
  /** We'll need to use this to help figure out what our emitted references are since some props like
   * lists might not have any values in this doc instead they come from querying the other type with
   * this docId. */
  schema: {};
}) {
  // This should be saved to disk and loaded on start-up. We'll use it to track changes.
  const lastKnownReferencesToThisType: {
    [sourceId: string]: DmfotReference[];
  } = {};
  // TODO: After load we'll need to start watching for changes to each of these.

  /** This will be computed based on docs in this manager. */
  const emittedReferences: DmfotReferenceSource = pending;
  sourcesOfDmfotReferences[config.typeId] = emittedReferences;

  // Create an interface for the doc manager
  return {
    emittedReferences: emittedReferences,
  };
}
