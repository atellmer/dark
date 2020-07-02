export const DARK = 'Dark';
export const EMPTY_NODE = 'dark:matter';
export const ATTR_KEY = 'key';
export const ROOT = 'root';
export const MAX_FIBERS_RENDERED_PER_FRAME = 25000;
export const SHADOW_UPDATE_TIMEOUT = 1000;
export const UNIQ_KEY_ERROR = `
  [${DARK}]: Operation of inserting, adding, replacing elements into list requires to have a unique key for every node (string or number, but not array index),
  otherwise the comparison algorithm won't work optimally!
`;
export const IS_ALREADY_USED_KEY_ERROR = `
  [${DARK}]: Some key of node already has been used!
`;
