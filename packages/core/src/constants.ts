export const VERSION = '0.25.1';
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
export const PORTAL_HOST_MASK = 16;
export const SHADOW_MASK = 32;
export const FLUSH_MASK = 64;
export const MOVE_MASK = 128;
export const HOOK_DELIMETER = ':';
export const RESTART_TIMEOUT = 10;
export const YIELD_INTERVAL = 6;

export enum TaskPriority {
  HIGH = 2,
  NORMAL = 1,
  LOW = 0,
}

export enum Flag {
  SKIP_SCAN_OPT = '$skipScanOpt',
  MEMO_SLOT_OPT = '$memoSlotOpt',
  STATIC_SLOT_OPT = '$staticSlotOpt',
}

export const FLAGS = {
  $skipScanOpt: true,
  $memoSlotOpt: true,
  $staticSlotOpt: true,
};

export const ATTR_BLACK_LIST = {
  [KEY_ATTR]: true,
  [REF_ATTR]: true,
  [Flag.SKIP_SCAN_OPT]: true,
  [Flag.MEMO_SLOT_OPT]: true,
  [Flag.STATIC_SLOT_OPT]: true,
};
