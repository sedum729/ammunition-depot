import { isArray, isFunction } from 'toolkit';

import { EnumMessage } from 'constant';

import { error } from 'log';

export type EventObj = {
  [event: string]: Array<Function>;
};

export const baseStationMap = window.__SUNFLOWER_EXIST__ ? window.__SUNFLOWER__.inject.appEventMap : new Map();

export class MassageEngine {
  private name: string;
  private eventObj: EventObj;

  constructor(appName: string) {
    this.name = appName;

    if (!baseStationMap.get(appName)) {
      baseStationMap.set(appName, {});
    }

    this.eventObj = baseStationMap.get(appName);
  }

  public on(eventName: string, fn: Function): MassageEngine {
    const eventQueue = this.eventObj[eventName];

    if (!eventQueue) {
      this.eventObj[eventName] = [fn];
      return this;
    }

    if (!eventQueue.includes(fn)) {
      eventQueue.push(fn);
    }

    return this;
  }

  public emit(eventName: string, ...args: Array<any>): MassageEngine {
    let collectEvent = [];

    baseStationMap.forEach(eventObject => {
      if (eventObject[eventName]) {
        collectEvent = collectEvent.concat(eventObject[eventName]);
      }
    });

    if (collectEvent && isArray(collectEvent)) {
      collectEvent.forEach(execFn => {
        if (execFn && isFunction(execFn)) {
          try {
            execFn(...args);
          } catch(errorMsg) {
            error(`${EnumMessage.MessageEngineEventExecError}${errorMsg}`);
          }
        }
      });
    }

    return this;
  }


};