export type WorkspaceIntegration = {
  onUserMetadata: (handle: (metadata: UserMetadata | null) => void) => () => void;
  createWorkspace: (params: { stage: string }) => Promise<void>;
  createWorkspaceInterface: (params: {
    inviteCode: string;
    workspaceId: string;
    validForDays: number;
  }) => Promise<void>;
  joinWorkspace: (params: { inviteCode: string; stage: string }) => Promise<void>;
  leaveWorkspace: (params: { stage: string } | undefined) => Promise<void>;
  // deleteWorkspace: (params: { stage: string } | undefined) => Promise<void>;
};
export type UserMetadata = {
  workspaceId: string | null;
  role: `member` | `owner` | null;
};