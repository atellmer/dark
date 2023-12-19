import { detectIsTextBased } from '@dark-engine/core';

import { type TextBased } from '../shared';
import { hash } from '../hash';
import {
  KEYFRAMES_MARK,
  FUNCTION_MARK,
  CHILDREN_START_MARK,
  CHILDREN_END_MARK,
  ANIMATION_NAME_PREFIX,
} from '../constants';

class Keyframes {
  constructor(private name: string, private value: string) {}

  getName() {
    return this.name;
  }

  getValue() {
    return this.value;
  }
}

function keyframes(strings: TemplateStringsArray, ...args: Array<TextBased>) {
  const joined = join(pad(strings), args);
  const name = genAnimationName(joined);
  const keyframes = new Keyframes(name, joined.replace(FUNCTION_MARK, name));

  return keyframes;
}

function pad(source: TemplateStringsArray) {
  const start = `${KEYFRAMES_MARK} ${FUNCTION_MARK} ${CHILDREN_START_MARK}`;
  const end = CHILDREN_END_MARK;
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

function join(strings: Array<string>, args: Array<TextBased>) {
  let joined = '';

  for (let i = 0; i < strings.length; i++) {
    joined += strings[i];

    if (detectIsTextBased(args[i])) {
      joined += args[i];
    }
  }

  return joined;
}

const genAnimationName = (key: string) => `${ANIMATION_NAME_PREFIX}-${hash(key)}`;

const detectIsKeyframes = (x: unknown): x is Keyframes => x instanceof Keyframes;

export { type Keyframes, keyframes, detectIsKeyframes };
