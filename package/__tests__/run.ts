import { sample } from "../data";
import { buildSvgReactTree } from "../src/tree";
import { Parser } from "../src/parser";

const parser = new Parser();
const start = Date.now();
const node = parser.parse(sample);
const reactNode = buildSvgReactTree(node);
console.log(JSON.stringify(reactNode, null, 1));
console.log(`It took ${Date.now() - start}ms`);