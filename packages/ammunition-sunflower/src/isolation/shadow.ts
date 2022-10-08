import { getContainer, rawElementAppendChild, rawElementRemoveChild } from 'toolkit';

export const renderElementToContainer = (element: Element, selectorOrElement: string | HTMLElement): HTMLElement => {
  const container = getContainer(selectorOrElement);

  if (container && element &&!container.contains(element)) {
    rawElementAppendChild.call(container, element)
  }

  return container;
};

export const cleanChildElement = (root: ShadowRoot | Node): boolean => {
  try {

    while(root?.firstChild) {
      rawElementRemoveChild.call(root, root.firstChild);
    }

    return true;
  } catch {
    return false;
  }
};