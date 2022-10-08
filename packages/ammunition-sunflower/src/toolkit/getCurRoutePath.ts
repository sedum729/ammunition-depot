export function getCurRoutePath(proxyLocation: Object): string {
  const location = proxyLocation as Location;
  return location.protocol + "//" + location.host + location.pathname;
}