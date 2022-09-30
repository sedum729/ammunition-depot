import { warn } from 'log';

export const defaultGetPublicPath = (entry) => {
  if (typeof entry === "object") return "/";

  try {
    const { origin, pathname } = new URL(entry, location.href);

    const paths = pathname.split("/");

    paths.pop();

    return `${origin}${paths.join("/")}/`;
  } catch (e) {
    warn(e);

    return "";
  }
}