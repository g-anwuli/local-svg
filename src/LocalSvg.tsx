import { forwardRef, memo, SVGAttributes, useEffect, useState } from "react";
import { SvgNode } from "./parser";
import { buildSvgReactTree } from "./tree";
import { createSvg } from "./query";

export type LocalSvgProps = SVGAttributes<SVGSVGElement> & {
  name: string;
  baseUrl?: string;
  as?: React.ElementType;
};

const LocalSvg = memo(
  forwardRef<SVGSVGElement, LocalSvgProps>(
    ({ name, baseUrl = "/", as = "span", ...props }, ref) => {
      const [node, setNode] = useState<SvgNode | null>(null);

      useEffect(() => {
        const loadSvg = async () => {
          const node = await createSvg(name, baseUrl);
          if (node) {
            setNode(node);
          }
        };

        loadSvg();
      }, []);

      const Com = as;

      return node ? (
        buildSvgReactTree(node, ref, props)
      ) : (
        <Com
          className={props.className}
          style={{
            width: props.width,
            height: props.height,
            display: "inline-block",
            ...props.style,
          }}
        />
      );
    }
  )
);

export { LocalSvg };
