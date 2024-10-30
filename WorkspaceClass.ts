import { Doc, prop } from "./Doc";

export class WorkspaceClass extends Doc.customize({
  docType: null,
}) {
  readonly entitlements = prop([[String], null], null);
}
