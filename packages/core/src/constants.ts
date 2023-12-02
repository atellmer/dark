export const VERSION = '0.25.1';
export const ROOT = 'dark:root';
export const REPLACER = 'dark:matter';
export const INDEX_KEY = 'dark:idx';
export const ATTR_KEY = 'key';
export const ATTR_REF = 'ref';
export const EFFECT_TAG_CREATE = 'C';
export const EFFECT_TAG_UPDATE = 'U';
export const EFFECT_TAG_DELETE = 'D';
export const EFFECT_TAG_SKIP = 'S';
export const MASK_INSERTION_EFFECT_HOST = 1;
export const MASK_LAYOUT_EFFECT_HOST = 2;
export const MASK_ASYNC_EFFECT_HOST = 4;
export const MASK_ATOM_HOST = 8;
export const MASK_PORTAL_HOST = 16;
export const MASK_SHADOW = 32;
export const MASK_FLUSH = 64;
export const MASK_MOVE = 128;
export const RESTART_TIMEOUT = 10;

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
  [ATTR_KEY]: true,
  [ATTR_REF]: true,
  [Flag.SKIP_SCAN_OPT]: true,
  [Flag.MEMO_SLOT_OPT]: true,
  [Flag.STATIC_SLOT_OPT]: true,
};
