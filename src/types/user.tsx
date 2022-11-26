export type User = {
  name: string;
  surname: string;
  handle: string;
  avatarURI: string;
  landscapeURI: string;
  listenWithMeURI: string;
  initials: string;
};

export type WaitAtType = {
  locationAliasA: string;
  locationAliasB: string;
  locationAliasC: string;
  createdAt: number;
  expiresAt: number;
};

export type WaitingForType = WaitAtType & {
  handleForWaiter: string;
};

export type WaiterType = {
  user: User;
  arrivedAt: number;
  leavesAt: number;
};

export type WaitingForYouType = {
  at: WaitAtType;
  waiters: WaiterType[];
};

export type WaitingForThemType = WaitAtType & {
  handleForAwaited: string;
};

export type UserCredentials = {
  token: string;
  handle: string;
};

type ConnectionType = {
  metOn: number;
};

export type WFYType = {
  [at: string]: {
    createdAt: number;
    expiresAt: number;
    waiters: {
      [handle: string]: {
        arrivedAt: number;
        leavesAt: number;
        avatarURI: string;
      };
    };
  };
};

export type WFTType = {
  [handle: string]: {
    at: string;
    createdAt: number;
    expiresAt: number;
  };
};

export type Profile = User & {
  lastmodified: number;
  connections: {[handle: string]: ConnectionType};
  waitingForYou: WFYType;
  waitingForThem: WFTType;
  token: string,
};
