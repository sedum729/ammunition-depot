export type lifecycle = (appWindow: Window) => any;

export type loadErrorHandler = (url: string, e: Error) => any;

export type lifecycles = {
  beforeLoad: lifecycle;
  beforeMount: lifecycle;
  afterMount: lifecycle;
  beforeUnmount: lifecycle;
  afterUnmount: lifecycle;
  activated: lifecycle;
  deactivated: lifecycle;
  loadError: loadErrorHandler;
};