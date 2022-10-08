import { EnumPrivateAttr } from 'constant';

interface IgenIframe {
  src?: string;
  id?: string;
}

export const genIframe = (options: IgenIframe) => {
  const iframe = document.createElement("iframe");
  iframe.setAttribute("style", "width: 100%; height:100%");

  if (options?.src) {
    iframe.setAttribute('src', options.src);
  }

  if (options?.id) {
    iframe.setAttribute(EnumPrivateAttr.DataId, options.id);
  }

  return iframe;
};