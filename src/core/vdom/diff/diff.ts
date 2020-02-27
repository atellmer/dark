import { isEmpty, isUndefined, error, getTime } from '@helpers';
import { ATTR_KEY, ATTR_SKIP } from '../../constants';
import {
  createAttribute,
  getAttribute,
  getNodeKey,
  isTagVirtualNode,
  VirtualNode,
  isEmptyVirtualNode,
  isVirtualNode,
} from '../vnode';


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
  container?: unknown;
  oldValue: VirtualNode | Record<string, number | string | boolean>;
  nextValue: VirtualNode | Record<string, number | string | boolean>;
};

const UNIQ_KEY_ERROR = `
  [Dark]: The node must have a unique key (string or number, but not array index), 
  otherwise the comparison algorithm will not work optimally or even will work incorrectly!
`;

const createCommit = (action: VirtualDOMActions, nodeId: string, oldValue: any, nextValue: any, container?: unknown): Commit => {
  const route = nodeId.split('.').map(Number);

  return {
    action,
    route,
    container,
    oldValue,
    nextValue,
  };
};

type MapAttributesOptions = {
  attrName: string;
  vNode: VirtualNode;
  nextVNode: VirtualNode;
  commits: Array<Commit>;
  container: unknown;
}

function mapPrevAttributes(options: MapAttributesOptions) {
  const {
    attrName,
    vNode,
    nextVNode,
    commits,
    container,
  } = options;
  if (!isEmpty(vNode.attrs[attrName]) && isEmpty(nextVNode.attrs[attrName])) {
    commits.push(
      createCommit(
        REMOVE_ATTRIBUTE,
        nextVNode.nodeId,
        createAttribute(attrName, vNode.attrs[attrName]),
        createAttribute(attrName, undefined),
        container,
      ),
    );
  } else if (nextVNode.attrs[attrName] !== vNode.attrs[attrName]) {
    commits.push(createCommit(
      REPLACE_ATTRIBUTE,
      nextVNode.nodeId,
      createAttribute(attrName, vNode.attrs[attrName]),
      createAttribute(attrName, nextVNode.attrs[attrName]),
      container,
    ));
  }
}

function mapNewAttributes(options: MapAttributesOptions) {
  const {
    attrName,
    vNode,
    nextVNode,
    commits,
    container,
  } = options;
  if (isEmpty(vNode.attrs[attrName]) && !isEmpty(nextVNode.attrs[attrName])) {
    commits.push(
      createCommit(
        ADD_ATTRIBUTE,
        nextVNode.nodeId,
        createAttribute(attrName, undefined),
        createAttribute(attrName, nextVNode.attrs[attrName]),
        container,
      ),
    );
  }
}

type IterateNodesOptions = {
  vNode: VirtualNode;
  nextVNode: VirtualNode;
  commits: Array<Commit>;
  container: unknown;
  startTime: number;
}

function iterateNodes(options: IterateNodesOptions) {
  const {
    vNode,
    nextVNode,
    container,
    startTime,
  } = options;
  let { commits } = options;
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

    commits = getDiff({
      vNode: childVNode,
      nextVNode: childNextVNode,
      commits,
      container,
      isRemovingNodeByKey,
      isInsertingNodeByKey,
      fromRoot: false,
      startTime,
    });

    if (isRemovingNodeByKey) {
      nextVNodeShift++;
    }
    if (isInsertingNodeByKey) {
      vNodeShift++;
    }
  }

  return commits;
}

type GetDiffOptions = {
  vNode: VirtualNode;
  nextVNode: VirtualNode;
  commits?: Array<Commit>;
  container?: unknown;
  isRemovingNodeByKey?: boolean;
  isInsertingNodeByKey?: boolean;
  fromRoot?: boolean;
  startTime: number;
}

function getDiff(options: GetDiffOptions): Array<Commit> {
  const {
    vNode,
    nextVNode,
    container,
    isRemovingNodeByKey = false,
    isInsertingNodeByKey = false,
    fromRoot = true,
    startTime,
  } = options;
  const time = getTime();
  let { commits = [] } = options;

  if (time - startTime >= 32) {
    //throw new Promise(resolve => resolve(commits));
    //to make restore
  }

  if (!vNode && !nextVNode) return commits;
  if ((vNode && !isVirtualNode(vNode)) || (nextVNode && !isVirtualNode(nextVNode))) return commits;

  const key = getNodeKey(vNode);
  const nextKey = getNodeKey(nextVNode);
  let mountPoint = (nextVNode && nextVNode.container) || (vNode && vNode.container) || container;

  if (!vNode) {
    commits.push(createCommit(ADD_NODE, nextVNode.nodeId, null, nextVNode, mountPoint));
    if (isUndefined(nextKey) && !isEmptyVirtualNode(nextVNode)) {
      error(UNIQ_KEY_ERROR);
    }
    return commits;
  }

  if (!nextVNode || isRemovingNodeByKey) {
    commits.push(createCommit(REMOVE_NODE, vNode.nodeId, vNode, null, mountPoint));
    if (isUndefined(key) && !isEmptyVirtualNode(vNode)) {
      error(UNIQ_KEY_ERROR);
    }
    return commits;
  }

  if (Boolean(vNode && nextVNode && isInsertingNodeByKey)) {
    commits.push(createCommit(INSERT_NODE, nextVNode.nodeId, vNode, nextVNode, mountPoint));
    return commits;
  }

  if (
    key !== nextKey ||
    vNode.type !== nextVNode.type ||
    vNode.name !== nextVNode.name ||
    vNode.text !== nextVNode.text
  ) {
    mountPoint = vNode.isPortal && !nextVNode.isPortal ? container : mountPoint;
    commits.push(createCommit(REPLACE_NODE, nextVNode.nodeId, vNode, nextVNode, mountPoint));
    return commits;
  }

  if (getAttribute(nextVNode, ATTR_SKIP)) return commits; // don't move this line

  if (isTagVirtualNode(vNode)) {
    const prevAttrBlackList = [ATTR_SKIP, ATTR_KEY];
    const prevAttrs = Object.keys(vNode.attrs);
    const newAttrBlackList = [...prevAttrBlackList, ...prevAttrs];
    const newAttrs = Object.keys(nextVNode.attrs);

    for (const attrName of prevAttrs) {
      !prevAttrBlackList.includes(attrName) && mapPrevAttributes({
        attrName,
        vNode,
        nextVNode,
        commits,
        container: mountPoint,
      });
    }
    for (const attrName of newAttrs) {
      !newAttrBlackList.includes(attrName) && mapNewAttributes({
        attrName,
        vNode,
        nextVNode,
        commits,
        container: mountPoint,
      });
    }
  }

  commits = iterateNodes({
    vNode,
    nextVNode,
    commits,
    container: mountPoint,
    startTime,
  });

  if (fromRoot) {
    commits = getSortedByPriorityCommits(commits);
  }

  return commits;
}

function getSortedByPriorityCommits(commits: Array<Commit>) {
  const styleChangesCommits = [];
  const replaceCommits = [];
  const removeCommits = [];
  const insertCommits = [];
  const addCommits = [];
  const consistentCommits = [];
  let commitsByPriotity = [];

  for (const commit of commits) {
    if (commit.action === 'REMOVE_NODE') {
      removeCommits.push(commit);
    } else if (commit.action === 'INSERT_NODE') {
      insertCommits.push(commit);
    } else if (commit.action === 'REPLACE_NODE') {
      replaceCommits.push(commit);
    } else if (commit.action === 'ADD_NODE') {
      addCommits.push(commit);
    } else if (commit.action === 'REPLACE_ATTRIBUTE'
      && (Boolean(commit.nextValue['style']) || Boolean(commit.nextValue['class']))) {
        styleChangesCommits.push(commit);
    } else {
      consistentCommits.push(commit);
    }
  }

  commitsByPriotity = [
    ...styleChangesCommits,
    ...removeCommits.reverse(),
    ...insertCommits.reverse(),
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
