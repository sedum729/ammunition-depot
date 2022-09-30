import { loadErrorHandler } from 'constant';

export const fetchAssets = (
  src: string,
  cache: Object,
  fetch: (input: RequestInfo, init?: RequestInit) => Promise<Response>,
  cssFlag?: boolean,
  loadError?: loadErrorHandler
) => {
  return cache[src] ||
  (cache[src] = fetch(src)
    .then((response) => {
      // usually browser treats 4xx and 5xx response of script loading as an error and will fire a script error event
      // https://stackoverflow.com/questions/5625420/what-http-headers-responses-trigger-the-onerror-handler-on-a-script-tag/5625603
      if (response.status >= 400) {
        cache[src] = null;
        if (cssFlag) {
          // error(WUJIE_TIPS_CSS_ERROR_REQUESTED, { src, response });
          // loadError?.(src, new Error(WUJIE_TIPS_CSS_ERROR_REQUESTED));
          return "";
        } else {
          // error(WUJIE_TIPS_SCRIPT_ERROR_REQUESTED, { src, response });
          // loadError?.(src, new Error(WUJIE_TIPS_SCRIPT_ERROR_REQUESTED));
          // throw new Error(WUJIE_TIPS_SCRIPT_ERROR_REQUESTED);
        }
      }
      return response.text();
    })
    .catch((e) => {
      cache[src] = null;
      if (cssFlag) {
        // error(WUJIE_TIPS_CSS_ERROR_REQUESTED, src);
        loadError?.(src, e);
        return "";
      } else {
        // error(WUJIE_TIPS_SCRIPT_ERROR_REQUESTED, src);
        loadError?.(src, e);
        return "";
      }
    }))
};