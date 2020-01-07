import { isEmpty, isUndefined, error } from '@helpers';
import { ATTR_KEY, ATTR_SKIP } from '../../constants';
import { createAttribute, getAttribute, getNodeKey, isTagVirtualNode, VirtualNode, isEmptyVirtualNode } from '../vnode';

const ADD_NODE = 'ADD_NODE';
const INSERT_NODE = 'INSERT_NODE';
const REMOVE_NODE = 'REMOVE_NODE';
const REPLACE_NODE = 'REPLACE_NODE';
const ADD_ATTRIBUTE = 'ADD_ATTRIBUTE';
const REMOVE_ATTRIBUTE = 'REMOVE_ATTRIBUTE';
const REPLACE_ATTRIBUTE = 'REPLACE_ATTRIBUTE';

export type VirtualDOMActions =
  | 'ADD_NODE'
  | 'INSERT_NODE'
  | 'REMOVE_NODE'
  | 'REPLACE_NODE'
  | 'ADD_ATTRIBUTE'
  | 'REMOVE_ATTRIBUTE'
  | 'REPLACE_ATTRIBUTE';

export type Commit = {
  action: VirtualDOMActions;
  route: Array<number>;
  oldValue: VirtualNode | Record<string, number | string | boolean>;
  nextValue: VirtualNode | Record<string, number | string | boolean>;
};

const UNIQ_KEY_ERROR = `
  [Dark]: The node must have a unique key (string or number, but not array index), 
  otherwise the comparison algorithm will not work optimally or even will work incorrectly!
`;

const createCommit = (action: VirtualDOMActions, route: Array<number> = [], oldValue: any, nextValue: any): Commit => ({
  action,
  route,
  oldValue,
  nextValue,
});

function mapPrevAttributes(attrName: string, vNode: VirtualNode, nextVNode: VirtualNode, commits: Array<Commit>) {
  if (!isEmpty(vNode.attrs[attrName]) && isEmpty(nextVNode.attrs[attrName])) {
    commits.push(
      createCommit(
        REMOVE_ATTRIBUTE,
        nextVNode.nodeRoute,
        createAttribute(attrName, vNode.attrs[attrName]),
        createAttribute(attrName, undefined),
      ),
    );
  } else if (nextVNode.attrs[attrName] !== vNode.attrs[attrName]) {
    commits.push(createCommit(
      REPLACE_ATTRIBUTE,
      nextVNode.nodeRoute,
      createAttribute(attrName, vNode.attrs[attrName]),
      createAttribute(attrName, nextVNode.attrs[attrName]),
    ));
  }
}

function mapNewAttributes(attrName: string, vNode: VirtualNode, nextVNode: VirtualNode, commits: Array<Commit>) {
  if (isEmpty(vNode.attrs[attrName]) && !isEmpty(nextVNode.attrs[attrName])) {
    commits.push(
      createCommit(
        ADD_ATTRIBUTE,
        nextVNode.nodeRoute,
        createAttribute(attrName, undefined),
        createAttribute(attrName, nextVNode.attrs[attrName]),
      ),
    );
  }
}

function iterateNodes(vNode: VirtualNode, nextVNode: VirtualNode, commits: Array<Commit>) {
  const iterations = Math.max(vNode.children.length, nextVNode.children.length);
  const removingSize = vNode.children.length - nextVNode.children.length;
  const insertingSize = nextVNode.children.length - vNode.children.length;
  let nextVNodeShift = 0;
  let vNodeShift = 0;

  for (let i = 0; i < iterations; i++) {
    const childNextVNode = nextVNode.children[i - nextVNodeShift];
    const childVNode = vNode.children[i - vNodeShift];
    const key = getNodeKey(childVNode);
    const nextKey = getNodeKey(childNextVNode);
    const isDifferentKeys = !isEmpty(key) && !isEmpty(nextKey) && key !== nextKey;
    const isRemovingNodeByKey = nextVNodeShift < removingSize && isDifferentKeys;
    const isInsertingNodeByKey = vNodeShift < insertingSize && isDifferentKeys;

    commits = getDiff(childVNode, childNextVNode, commits, isRemovingNodeByKey, isInsertingNodeByKey, false);

    if (isRemovingNodeByKey) {
      nextVNodeShift++;
    }
    if (isInsertingNodeByKey) {
      vNodeShift++;
    }
  }

  return commits;
}

function getDiff(
  vNode: VirtualNode,
  nextVNode: VirtualNode,
  commits: Array<Commit> = [],
  isRemovingNodeByKey: boolean = false,
  isInsertingNodeByKey: boolean = false,
  fromRoot: boolean = true,
): Array<Commit> {
  if (!vNode && !nextVNode) return commits;

  const key = getNodeKey(vNode);
  const nextKey = getNodeKey(nextVNode);

  if (!vNode) {
    commits.push(createCommit(ADD_NODE, nextVNode.nodeRoute, null, nextVNode));
    if (isUndefined(nextKey) && !isEmptyVirtualNode(nextVNode)) {
      error(UNIQ_KEY_ERROR);
    }
    return commits;
  }

  if (!nextVNode || isRemovingNodeByKey) {
    commits.push(createCommit(REMOVE_NODE, vNode.nodeRoute, vNode, null));
    if (isUndefined(key) && !isEmptyVirtualNode(vNode)) {
      error(UNIQ_KEY_ERROR);
    }
    return commits;
  }

  if (Boolean(vNode && nextVNode && isInsertingNodeByKey)) {
    commits.push(createCommit(INSERT_NODE, nextVNode.nodeRoute, vNode, nextVNode));
    return commits;
  }

  if (
    key !== nextKey ||
    vNode.type !== nextVNode.type ||
    vNode.name !== nextVNode.name ||
    vNode.text !== nextVNode.text
  ) {
    commits.push(createCommit(REPLACE_NODE, nextVNode.nodeRoute, vNode, nextVNode));
    return commits;
  }

  if (getAttribute(nextVNode, ATTR_SKIP)) return commits; // don't move this line

  if (isTagVirtualNode(vNode)) {
    const prevAttrBlackList = [ATTR_SKIP, ATTR_KEY];
    const prevAttrs = Object.keys(vNode.attrs);
    const newAttrBlackList = [...prevAttrBlackList, ...prevAttrs];
    const newAttrs = Object.keys(nextVNode.attrs);

    for (const attrName of prevAttrs) {
      !prevAttrBlackList.includes(attrName) && mapPrevAttributes(attrName, vNode, nextVNode, commits);
    }
    for (const attrName of newAttrs) {
      !newAttrBlackList.includes(attrName) && mapNewAttributes(attrName, vNode, nextVNode, commits);
    }
  }

  commits = iterateNodes(vNode, nextVNode, commits);

  if (fromRoot) {
    commits = getSortedByPriorityCommits(commits);
  }

  return commits;
}

function getSortedByPriorityCommits(commits: Array<Commit>) {
  const replaceCommits = [];
  const removeCommits = [];
  const insertCommits = [];
  const addCommits = [];
  const consistentCommits = [];
  let commitsByPriotity = [];

  for (const commit of commits) {
    if (commit.action === 'REMOVE_NODE') {
      removeCommits.unshift(commit);
    } else if (commit.action === 'INSERT_NODE') {
      insertCommits.unshift(commit);
    } else if (commit.action === 'REPLACE_NODE') {
      replaceCommits.push(commit);
    } else if (commit.action === 'ADD_NODE') {
      addCommits.push(commit);
    } else {
      consistentCommits.push(commit);
    }
  }

  commitsByPriotity = [
    ...removeCommits,
    ...insertCommits,
    ...replaceCommits,
    ...addCommits,
    ...consistentCommits,
  ];

  return commitsByPriotity;
}

export {
  ADD_NODE,
  REMOVE_NODE,
  REPLACE_NODE,
  INSERT_NODE,
  ADD_ATTRIBUTE,
  REMOVE_ATTRIBUTE,
  REPLACE_ATTRIBUTE,
  getDiff,
};
