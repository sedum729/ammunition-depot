import Log from '@ammunition/log';

const logInstance = new Log();

export const log = logInstance.log();
export const warn = logInstance.warn();
export const error = logInstance.error();