export const anchorElementGenerator = (url: string): HTMLAnchorElement => {
  const element = window.document.createElement("a");
  element.href = url;
  return element;
};