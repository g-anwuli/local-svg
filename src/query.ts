import { minifySVG } from "./minification";
import { Parser, SvgNode } from "./parser";
import { createStore, PromiseCache } from "./store";

const store = createStore();
const promiseCache = new PromiseCache<SvgNode>();

const composeUrl = (name: string, baseUrl = "/") => {
  return baseUrl + name + ".svg";
};

const _fetch = async (url: string) => {
  try {
    const response = await fetch(url);
    return await response.text();
  } catch (error) {
    console.error(error);
    return null;
  }
};

const processSvgText = async (text: string) => {
  try {
    const parser = new Parser();
    return parser.parse(text);
  } catch (error) {
    console.error(error);
  }
};

export const createSvg = async (name: string, baseUrl = "/") => {
  const fullUrl = composeUrl(name, baseUrl);
  const promise = promiseCache.get(fullUrl);

  if (promise) {
    return promise;
  }

  const newPromise = new Promise<SvgNode>(async (resolve, reject) => {
    try {
      let text = await store?.getItem(fullUrl);

      if (!text) {
        text = await _fetch(fullUrl);

        if (text) {
          setTimeout(() => {
            try {
              const minified = minifySVG(text);
              store?.setItem(fullUrl, minified);
            } catch (error) {
              console.warn("Storage is full, cannot cache SVG.");
            }
          });
        }
      }

      if (text) {
        const node = await processSvgText(text);
        resolve(node);
      }

      reject(`Error occured processing Svg ${fullUrl}`);
    } catch (error) {
      reject(error);
    }
  });

  promiseCache.set(fullUrl, newPromise);

  return newPromise;
};
