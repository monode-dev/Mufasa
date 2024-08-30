const savedJson = (defaultValue: any) => ({}) as any;

// NOTE: Each unique DocClass should have a tableCache.
const tableCache = async (config: {
  sessionPersister: any;
  directoryPersister: any;
  cloudPersister: any;
}) => {
  const data = savedJson({
    queries: {} as {
      [query: string]: string[]; // docIds
    },
    // NOTE: Ideally should be reactive
    docs: {} as {
      [docId: string]: Record<string, any>; // docData
    },
  });
  await data.onLoad;
  // TODO: Start syncing all queries
  // NOTE: Query syncing should not double sync docs, and should only discard docs if they are not in any query.

  return {
    addQuery: (query: string) => {
      data.batchUpdate((data: any) => {
        data.queries[query] = [];
        // TODO: Start syncing this query
      });
    },
    removeQuery: (query: string) => {
      data.batchUpdate((data: any) => {
        delete data.queries[query];
        // TODO: Stop syncing this query
      });
    },
    // TODO: Flesh out doc interface.
  };
};
