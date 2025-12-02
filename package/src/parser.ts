import { TOKEN_TYPE } from "./enums";
import { Tokenizer } from "./tokenizer";

class SvgNode {
  public children: (SvgNode | string)[] = [];
  constructor(
    public type: string,
    public props: { [key: string]: string } = {}
  ) {}

  addChild(node: SvgNode | string) {
    this.children.push(node);
  }

  addProp(key: string, value: string) {
    this.props[key] = value;
  }
}

const AllowedLookAhead = {
  [TOKEN_TYPE.BEGIN_TAG]: {
    [TOKEN_TYPE.ATTRIBUTE]: true,
    [TOKEN_TYPE.END_TAG]: true,
    [TOKEN_TYPE.END_CLOSE_TAG]: true,
  },
  [TOKEN_TYPE.ATTRIBUTE]: {
    [TOKEN_TYPE.ATTRIBUTE]: true,
    [TOKEN_TYPE.END_TAG]: true,
    [TOKEN_TYPE.END_CLOSE_TAG]: true,
  },
  [TOKEN_TYPE.END_TAG]: {
    [TOKEN_TYPE.BEGIN_TAG]: true,
    [TOKEN_TYPE.CLOSE_TAG]: true,
    [TOKEN_TYPE.TEXT]: true,
  },
  [TOKEN_TYPE.CLOSE_TAG]: {
    [TOKEN_TYPE.BEGIN_TAG]: true,
    [TOKEN_TYPE.CLOSE_TAG]: true,
  },
  [TOKEN_TYPE.END_CLOSE_TAG]: {
    [TOKEN_TYPE.BEGIN_TAG]: true,
    [TOKEN_TYPE.CLOSE_TAG]: true,
  },
  [TOKEN_TYPE.TEXT]: {
    [TOKEN_TYPE.CLOSE_TAG]: true,
  },
};

class Parser {
  tokenizer: Tokenizer;

  constructor() {
    this.tokenizer = new Tokenizer();
  }

  parse(str: string) {
    this.tokenizer.init(str);
    const root = new SvgNode("ROOT");
    let tags: SvgNode[] = [root];
    let lookAhead = this.tokenizer.getNextToken();

    while (true) {
      if (this.tokenizer.isEOF()) {
        break;
      }

      const token = lookAhead;
      lookAhead = this.tokenizer.getNextToken();

      if (lookAhead && !AllowedLookAhead[token.name][lookAhead.name]) {
        throw new SyntaxError(
          `Unexpected token ${lookAhead.name} after ${token.name}`
        );
      }

      switch (token.name) {
        case TOKEN_TYPE.BEGIN_TAG:
          const node = new SvgNode(token.value.slice(1));
          tags[tags.length - 1].addChild(node);
          tags.push(node);
          break;

        case TOKEN_TYPE.ATTRIBUTE:
          const [name, value] = token.value.split("=");
          tags[tags.length - 1].addProp(name, value.slice(1, -1));
          break;

        case TOKEN_TYPE.END_TAG:
          //Do nothing
          break;

        case TOKEN_TYPE.CLOSE_TAG:
          if (tags.length <= 1) {
            // ✅ NOW in the right place
            throw new SyntaxError("Unexpected closing tag");
          }
          const current = tags.pop();
          if (current.type !== token.value.slice(2, -1)) {
            throw new SyntaxError(
              `Mismatched tag: expected </${current.type}>, got ${token.value}`
            );
          }
          break;

        case TOKEN_TYPE.END_CLOSE_TAG:
          if (tags.length <= 1) {
            // ✅ NOW in the right place
            throw new SyntaxError("Unexpected closing tag");
          }
          tags.pop();
          break;

        case TOKEN_TYPE.TEXT:
          tags[tags.length - 1].addChild(token.value);
          break;

        default:
          throw new SyntaxError(`Unknown token type: ${token.name}`);
      }
    }

    if (tags.length > 1) {
      throw new SyntaxError(
        `Invalid SVG structure: Missing </${tags[tags.length - 1].type}>`
      );
    }

    return root.children[0] as SvgNode;
  }
}

export { Parser, SvgNode };
