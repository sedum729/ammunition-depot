import { isFunction } from 'toolkit';

export const compose = (funList: Array<Function>) => {
  return (code, ...args: Array<any>) => {
    return funList.reduce((prevCode, fun) => {
      return isFunction(fun) ? fun(prevCode, ...args) : prevCode;
    }, code || '');
  }
};