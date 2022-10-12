import {
  createBrowserHistory,
  createHashHistory,
  createMemoryHistory,
  History as IHistory,
  Action,
  Location,
  To,
  Listener,
  Blocker,
} from 'history';

/**
 * Indicates the supported routing mode
*/
type THistoryMode = 'brower' | 'hash' | 'memory';

export enum EHistoryMode {
  Brower = 'brower',
  Hash = 'hash',
  Memory = 'memory',
};

class History implements IHistory {
  history: IHistory;

  readonly action: Action;
  readonly location: Location;
  createHref: (to: To) => string;
  push: (to: To, state?: any) => void;
  replace: (to: To, state?: any) => void;
  go: (delta: number) => void;
  back: () => void;
  forward: () => void;
  listen: (listener: Listener) => () => void;
  block: (blocker: Blocker) => () => void;

  constructor(mode: THistoryMode = EHistoryMode.Memory, historyConfig?: any) {
    if (mode === EHistoryMode.Brower) {
      this.genBrowserHistory(historyConfig);
    }

    if (mode === EHistoryMode.Hash) {
      this.genHashHistory(historyConfig);
    }

    if (mode === EHistoryMode.Memory) {
      this.genMemoryHistory(historyConfig);
    }
  }

  genBrowserHistory(historyConfig: any) {
    const history = createBrowserHistory(historyConfig);

    this.assignmentHistoryToThis(history);
  };

  genHashHistory(historyConfig: any) {
    const history = createHashHistory(historyConfig);

    this.assignmentHistoryToThis(history);
  };

  genMemoryHistory(historyConfig: any) {
    const history = createMemoryHistory(historyConfig);

    this.assignmentHistoryToThis(history);
  };

  assignmentHistoryToThis(history: any) {
    if (history && Object.keys(history).length) {
      Object.keys(history).forEach(historyKey => {
        this[historyKey] = history[historyKey];
      });
    }
  }
}

export default History;

