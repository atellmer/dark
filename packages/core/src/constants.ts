export const VERSION = '0.25.1';
export const ROOT = 'dark:root';
export const REPLACER = 'dark:matter';
export const INDEX_KEY = 'dark:idx';
export const ATTR_KEY = 'key';
export const ATTR_REF = 'ref';
export const RESTART_TIMEOUT = 10;

export enum TaskPriority {
  HIGH = 2,
  NORMAL = 1,
  LOW = 0,
}

export enum Flag {
  SKIP_SCAN_OPT = 'skipScanOpt$',
  MEMO_TREE_OPT = 'memoTreeOpt$',
}

export const FLAGS = {
  skipScanOpt$: true,
  memoTreeOpt$: true,
};

export const ATTR_BLACK_LIST = {
  [ATTR_KEY]: true,
  [ATTR_REF]: true,
  [Flag.SKIP_SCAN_OPT]: true,
  [Flag.MEMO_TREE_OPT]: true,
};
