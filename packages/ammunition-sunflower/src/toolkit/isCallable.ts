/**
 * in safari
 * typeof document.all === 'undefined' // true
 * typeof document.all === 'function' // true
 * We need to discriminate safari for better performance
 */
 const naughtySafari = typeof document.all === "function" && typeof document.all === "undefined";
 const callableFnCacheMap = new WeakMap<CallableFunction, boolean>();
 export const isCallable = (fn: any) => {
   if (callableFnCacheMap.has(fn)) {
     return true;
   }
 
   const callable = naughtySafari ? typeof fn === "function" && typeof fn !== "undefined" : typeof fn === "function";
   if (callable) {
     callableFnCacheMap.set(fn, callable);
   }
   return callable;
 };