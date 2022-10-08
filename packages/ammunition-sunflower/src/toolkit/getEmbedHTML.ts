import { StyleResultList, genLinkReplaceSymbol, getInlineStyleReplaceSymbol } from 'toolkit';

/**
 * convert external css link to inline style for performance optimization
 * @return embedHTML
 */
export async function getEmbedHTML(template, styleResultList: StyleResultList): Promise<string> {
  let embedHTML = template;

  return Promise.all(
    styleResultList.map((styleResult, index) =>
      styleResult.contentPromise.then((content) => {
        if (styleResult.src) {
          embedHTML = embedHTML.replace(
            genLinkReplaceSymbol(styleResult.src),
            styleResult.ignore
              ? `<link href="${styleResult.src}" rel="stylesheet" type="text/css">`
              : `<style>/* ${styleResult.src} */${content}</style>`
          );
        } else if (content) {
          embedHTML = embedHTML.replace(
            getInlineStyleReplaceSymbol(index),
            `<style>/* inline-style-${index} */${content}</style>`
          );
        }
      })
    )
  ).then(() => embedHTML);
}