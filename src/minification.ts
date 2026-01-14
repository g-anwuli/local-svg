/**
 * Minifies an SVG string for more efficient usage in the browser or inline.
 *
 * Features:
 * 1. Removes unnecessary whitespace, line breaks, tabs, and extra spaces.
 * 2. Strips XML declarations, comments, metadata, `class` attributes, and `xmlns` attributes.
 * 3. Collapses empty tags into self-closing tags.
 * 4. Shortens long IDs (8+ characters) to sequential numeric IDs and updates all corresponding `url(#ID)` references.
 *
 * @param {string} svg - The raw SVG string to minify.
 * @returns {string} The minified SVG string with optimized IDs and whitespace removed.
 *
 * @example
 * const raw = `<svg xmlns="http://www.w3.org/2000/svg">
 *   <defs>
 *     <linearGradient id="longGradient12345678"><stop offset="0%" /></linearGradient>
 *   </defs>
 *   <rect fill="url(#longGradient12345678)" width="100" height="100"/>
 * </svg>`;
 *
 * const minified = minifySVG(raw);
 * console.log(minified);
 */
export function minifySVG(svg: string) {
  if (!svg) return "";

  // 1️⃣ Remove newlines, tabs, multiple spaces
  let min = svg
    .replace(/\n|\r|\t/g, "")
    .replace(/\s{2,}/g, " ")
    .replace(/\s*(=)\s*"/g, '="')
    .replace(/class="[^"]+"/g, "")
    .replace(/<!--.*?-->/g, "") // Remove comments
    .replace(/\sxmlns(?::[a-zA-Z0-9_-]+)?="[^"]*"/g, "") // Remove xmlns attribute
    .replace(/<\?xml[^>]*>/g, "") // Remove XML declaration
    .replace(/<metadata>.*?<\/metadata>/g, "") // Remove metadata
    .replace(/<(\w+)([^>]*)><\/\1>/g, "<$1$2/>") // 4️⃣ Collapse self-closing tags (optional)
    .trim();

  // 2️⃣ Collect all IDs that look like IconifyId* or long random IDs
  const idRegex = /id="([^"]{8,})"/g;
  let match;
  let idMap: Record<string, string> = {};
  let counter = 0;

  while ((match = idRegex.exec(min)) !== null) {
    const longId = match[1];
    if (!idMap[longId]) {
      idMap[longId] = counter.toString();
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

  idMap = {};

  return min;
}
