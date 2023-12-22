import { detectIsTextBased } from '@dark-engine/core';

import { type TextBased } from '../shared';
import { hash } from '../hash';
import { parse } from '../parse';
import {
  KEYFRAMES_MARK,
  FUNCTION_MARK,
  OPENING_CURLY_BRACE_MARK,
  CLOSING_CURLY_BRACE_MARK,
  ANIMATION_NAME_PREFIX,
} from '../constants';
import { type KeyframesRule } from '../tokens';

class Keyframes {
  constructor(private name: string, private token: KeyframesRule) {}

  getName() {
    return this.name;
  }

  getToken() {
    return this.token;
  }
}

function keyframes(source: TemplateStringsArray, ...args: Array<TextBased>) {
  const joined = join(pad(source), args);
  const name = genAnimationName(joined);
  const [token] = parse(joined.replace(FUNCTION_MARK, name)).children;
  const keyframes = new Keyframes(name, token as KeyframesRule);

  return keyframes;
}

function pad(source: TemplateStringsArray) {
  const start = `${KEYFRAMES_MARK} ${FUNCTION_MARK} ${OPENING_CURLY_BRACE_MARK}`;
  const end = CLOSING_CURLY_BRACE_MARK;
  const strings: Array<string> = [];

  for (let i = 0; i < source.length; i++) {
    const isStart = i === 0;
    const isEnd = i === source.length - 1;

    if (isStart) {
      strings.push(start + source[i]);
    } else if (isEnd) {
      strings.push(source[i] + end);
    } else {
      strings.push(source[i]);
    }
  }

  return strings;
}

function join(source: Array<string>, args: Array<TextBased>) {
  let joined = '';

  for (let i = 0; i < source.length; i++) {
    joined += source[i];

    if (detectIsTextBased(args[i])) {
      joined += args[i];
    }
  }

  return joined;
}

const genAnimationName = (key: string) => `${ANIMATION_NAME_PREFIX}-${hash(key)}`;

const detectIsKeyframes = (x: unknown): x is Keyframes => x instanceof Keyframes;

export { Keyframes, keyframes, detectIsKeyframes };
