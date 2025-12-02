import {
  forwardRef,
  ReactNode,
  SVGAttributes,
  useEffect,
  useState,
} from "react";
import { Parser, SvgNode } from "../parser";
import { buildSvgReactTree } from "./tree";
import { sample } from "../../data";

type LocalSvgProps = SVGAttributes<SVGSVGElement> & {
  name: string;
  baseUrl?: string;
  placeholder?: ReactNode;
};

const fetchSvg = async (url: string): Promise<string> => {
  return sample;
};

const IN_MEMORY_CACHE: Record<string, SvgNode> = {};

const LocalSvg = forwardRef<SVGSVGElement, LocalSvgProps>(
  ({ name, baseUrl = "/", placeholder = <div />, ...props }, ref) => {
    const [node, setNode] = useState<SvgNode>(null);

    useEffect(() => {
      const fullUrl = `${baseUrl}${name}.svg`;

      const loadSvg = async () => {
        if (IN_MEMORY_CACHE[fullUrl]) {
          setNode(IN_MEMORY_CACHE[fullUrl]);
          return;
        }

        const svgString = await fetchSvg(fullUrl);
        const parser = new Parser();
        const parsedNode = parser.parse(svgString);
        IN_MEMORY_CACHE[fullUrl] = parsedNode;
        setNode(parsedNode);
      };

      loadSvg();
    }, []);

    return node ? placeholder : buildSvgReactTree(node, ref, props);
  }
);

export { LocalSvg };
