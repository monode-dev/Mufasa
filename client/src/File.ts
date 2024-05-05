import { initializeDocClass, DocClass, prop, DefineDocType } from "./Doc.js";
import { PersistanceConfig, Persistance, StoreBank } from "./DocStore.js";
import { FileStore } from "./FileStore.js";
import { isValid } from "./Utils.js";

export function initializeSyncedFileClass(config: {
  Doc: DocClass;
  storeBank: StoreBank;
}) {
  // TODO: Maybe prevent this file from being directly created.
  class File extends config.Doc {
    static get _fileStore(): FileStore {
      return config.storeBank.getStore({
        storeType: `file`,
        docType: this.docType,
        getStoreConfig: this.getDocStoreConfig,
      });
    }
    get _fileStore() {
      return (this.constructor as typeof File)._fileStore;
    }
    static get _docStore() {
      return this._fileStore.docStore;
    }
    readonly fileIsUploaded = prop(Boolean, false, Persistance.local);
    readonly fileIsDownloaded = prop(Boolean, false, Persistance.local);

    /** Won't resolve until it retrieves and returns the base64String. */
    async getBase64String(): Promise<string> {
      let base64String: string | undefined;
      while (!isValid(base64String)) {
        base64String = await this._fileStore.readFile(this.docId);
        if (!isValid(base64String)) {
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
      }
      return base64String;
    }

    static async createFromBase64String(base64String: string) {
      return this._fromId(await this._fileStore.pushCreate({ base64String }));
    }

    onDelete(): void {
      this._fileStore.pushDelete(this.docId);
    }
  }
  return {
    DefineFile(
      ...params: Parameters<ReturnType<typeof initializeDocClass>[`DefineDoc`]>
    ) {
      return DefineDocType({
        docType: params[0],
        BaseClass: File,
        ...params[1],
      });
    },
  };
}
