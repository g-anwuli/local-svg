import { Parser, SvgNode } from "./parser";

type ResultPromise = Promise<SvgNode | undefined>;
const promiseCache: Record<string, ResultPromise | null> = {};

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

//   const fullUrl = composeUrl(name, baseUrl);

const processSvgText = async (text: string) => {
  try {
    const parser = new Parser();
    return parser.parse(text);
  } catch (error) {
    console.log(error);
  }
};

/**
 * Minify SVG string dynamically
 * - Removes whitespace, line breaks
 * - Collapses multiple spaces
 * - Shortens linearGradient and other IDs
 * @param {string} svg
 * @returns {string} minified SVG
 */

function minifySVG(svg: string) {
  if (!svg) return "";

  // 1️⃣ Remove newlines, tabs, multiple spaces
  let min = svg
    .replace(/\n|\r|\t/g, "")
    .replace(/\s{2,}/g, " ")
    .replace(/\s*(=)\s*"/g, '="')
    .trim();

  // 2️⃣ Collect all IDs that look like IconifyId* or long random IDs
  const idRegex = /id="([^"]{8,})"/g;
  let match;
  const idMap: Record<string, string> = {};
  let counter = 0;
  const letters = "abcdefghijklmnopqrstuvwxyz";

  while ((match = idRegex.exec(min)) !== null) {
    const longId = match[1];
    if (!idMap[longId]) {
      idMap[longId] = letters[counter] || `id${counter}`;
      counter++;
    }
  }

  // 3️⃣ Replace IDs and corresponding url(#ID) references
  for (const key in idMap) {
    const [longId, shortId] = [key, idMap[key]];
    const idPattern = new RegExp(`id="${longId}"`, "g");
    min = min.replace(idPattern, `id="${shortId}"`);
    const urlPattern = new RegExp(`url\\(#${longId}\\)`, "g");
    min = min.replace(urlPattern, `url(#${shortId})`);
  }

  // 4️⃣ Collapse self-closing tags (optional)
  min = min.replace(/<(\w+)([^>]*)><\/\1>/g, "<$1$2/>");

  return min;
}

export const createSvg = async (name: string, baseUrl = "/") => {
  const fullUrl = composeUrl(name, baseUrl);

  if (promiseCache[fullUrl]) {
    return promiseCache[fullUrl];
  }

  promiseCache[fullUrl] = new Promise(async (resolve, reject) => {
    try {
      let text = localStorage.getItem(fullUrl);

      if (!text) {
        text = await _fetch(fullUrl);

        if (text) {
          try {
            localStorage.setItem(fullUrl, text);
          } catch (error) {
            console.warn("LocalStorage is full, cannot cache SVG.");
          }
        }
      }

      if (text) {
        setTimeout(() => {
          const diff = text.length - minifySVG(text).length;
          console.log(
            text.length,
            text.length - diff,
            `SVG Minification saved ${diff} bytes for ${name}, percentage: ${(
              (diff / text.length) *
              100
            ).toFixed(2)}%`
          );
        });

        const node = await processSvgText(text);
        resolve(node);
      }
      resolve(undefined);
    } catch (error) {
      reject(error);
    }
  });

  return promiseCache[fullUrl]!;
};
