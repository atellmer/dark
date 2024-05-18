export const VERSION = '1.3.0';
export const LIB = '@dark-engine/core';
export const ROOT = 'dark:root';
export const REPLACER = 'dark:matter';
export const INDEX_KEY = 'dark:idx';
export const KEY_ATTR = 'key';
export const REF_ATTR = 'ref';
export const CREATE_EFFECT_TAG = 'C';
export const UPDATE_EFFECT_TAG = 'U';
export const DELETE_EFFECT_TAG = 'D';
export const SKIP_EFFECT_TAG = 'S';
export const INSERTION_EFFECT_HOST_MASK = 1;
export const LAYOUT_EFFECT_HOST_MASK = 2;
export const ASYNC_EFFECT_HOST_MASK = 4;
export const ATOM_HOST_MASK = 8;
export const FLUSH_MASK = 16;
export const MOVE_MASK = 32;
export const IS_WIP_HOOK_MASK = 1;
export const IS_PORTAL_HOOK_NASK = 2;
export const IS_SUSPENSE_HOOK_MASK = 4;
export const IS_PENDING_HOOK_MASK = 8;
export const HOOK_DELIMETER = ':';
export const YIELD_INTERVAL = 6;
export const STATE_SCRIPT_TYPE = 'text/dark-state';

export enum TaskPriority {
  LOW = 0,
  NORMAL = 1,
  HIGH = 2,
}

export enum Flag {
  SKIP_SCAN_OPT = '__skipScanOpt',
  MEMO_SLOT_OPT = '__memoSlotOpt',
  STATIC_SLOT_OPT = '__staticSlotOpt',
}

export const FLAGS = {
  __skipScanOpt: true,
  __memoSlotOpt: true,
  __staticSlotOpt: true,
};

export const ATTR_BLACK_LIST = {
  [KEY_ATTR]: true,
  [REF_ATTR]: true,
  [Flag.SKIP_SCAN_OPT]: true,
  [Flag.MEMO_SLOT_OPT]: true,
  [Flag.STATIC_SLOT_OPT]: true,
};
