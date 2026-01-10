import { createElement, Ref } from "react";
import { SvgNode } from "./parser";

export function buildSvgReactTree(
  node: SvgNode | string,
  ref: Ref<SVGSVGElement> | null = null,
  props: Record<string, any> = {},
  keyPath: string = "0"
): React.ReactElement | string {
  if (typeof node === "string") return node;

  return createElement(
    node.type,
    { ...node.props, ...props, ref, key: keyPath },
    ...node.children.map((child, i) =>
      buildSvgReactTree(child, null, {}, `${keyPath}-${i}`)
    )
  );
}
