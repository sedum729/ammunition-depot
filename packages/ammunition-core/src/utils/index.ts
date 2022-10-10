const typeJudgment = (type) => (target) => target && Object.prototype.toString.call(target) === `[object ${type}]`;

export const isString = typeJudgment('String');

export const isObject = typeJudgment('Object');

export const isArray = typeJudgment('Array');

export const isNumber = typeJudgment('Number');

export const isFunction = typeJudgment('Function');

export const isSupportProxy = window.Proxy;

/**
 * todo 对 proxy 进行兼容处理
 * @date 2022-10-10
 * @returns {any}
 */
export const customProxy = () => {
  
};
