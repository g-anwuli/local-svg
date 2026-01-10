import { TOKEN_TYPE } from "./enums";

export class Token {
  constructor(public name: TOKEN_TYPE, public value: string) {}
}

const Spec: [RegExp, TOKEN_TYPE | null][] = [
  [/^\s+/, null],
  [/^<\?xml[^]*\?>/, null],
  [/^<!--[\s\S]*?-->/, null],
  [
    /^<[a-zA-Z_][\w\-.]*(?::[a-zA-Z_][\w\-.]*)?(?=[\s>/>])/,
    TOKEN_TYPE.BEGIN_TAG,
  ],
  [
    /^[a-zA-Z_][\w\-.]*(?::[a-zA-Z_][\w\-.]*)?=["|'][^"']*["|']/,
    TOKEN_TYPE.ATTRIBUTE,
  ],
  [/^>/, TOKEN_TYPE.END_TAG],
  [/^<\/[a-zA-Z_][\w\-.]*(?::[a-zA-Z_][\w\-.]*)?>/, TOKEN_TYPE.CLOSE_TAG],
  [/^\/>/, TOKEN_TYPE.END_CLOSE_TAG],
  [/^.+(?=<\/)/, TOKEN_TYPE.TEXT],
];

class Tokenizer {
  private _cursor = 0;
  private _string = "";

  init(str: string) {
    this._string = str;
  }

  isEOF() {
    return this._cursor === this._string.length;
  }

  hasMoreTokens() {
    return this._cursor < this._string.length;
  }

  getNextToken(): Token | null {
    if (!this.hasMoreTokens()) {
      return null;
    }

    const string = this._string.slice(this._cursor);

    for (const [regexp, tokenType] of Spec) {
      const tokenValue = this._match(regexp, string);

      if (tokenValue == null) {
        continue;
      }

      if (tokenType == null) {
        return this.getNextToken();
      }

      return new Token(tokenType, tokenValue);
    }

    throw new SyntaxError(`Unknown token type ${string.slice(0, 10)}`);
  }

  _match(reg: RegExp, string: string) {
    let matched = reg.exec(string);

    if (matched === null) {
      return null;
    }

    this._cursor += matched[0].length;
    return matched[0];
  }
}

export { Tokenizer };
