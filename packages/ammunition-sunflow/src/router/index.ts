import {
  createBrowserHistory,
  createHashHistory,
  createMemoryHistory
} from 'history';

/**
 * Indicates the supported routing mode
*/
type THistoryMode = 'brower' | 'hash' | 'memory';

enum EHistoryMode {
  Brower,
  Hash,
  Memory
};

class History {
  constructor(mode: THistoryMode) {
    
  }

}

export default History;

