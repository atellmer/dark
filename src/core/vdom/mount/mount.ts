import { flatten, isArray, isNull, isFunction, isEmpty, deepClone } from '@helpers';
import { getIsComponentFactory, ComponentFactory } from '../../component';
import {
  createVirtualEmptyNode,
  createVirtualNode,
  isVirtualNode,
  VirtualDOM,
  VirtualNode,
  setAttribute,
  getCompletedNodeIdFromEnd,
  getLastRouteIdFromNodeId,
  completeComponentIdFromEnd,
  getParentNodeId,
  replaceVirtualNode,
} from '../vnode/vnode';
import {
  setMountedComponentId,
  setMountedComponentFactory,
  resetHooks,
  getComponentVirtualNodesById,
  setComponentPropsById,
  linkComponentIdToParentComponent,
  setComponentVirtualNodesById,
  getVirtualDOM,
  getAppUid,
} from '../../scope';
import { ATTR_KEY, COMPONENT_MARKER } from '../../constants';
import { getIsMemo } from '../../memo/memo';
import { getIsPortal } from '../../../platform/browser/portal'; // temp
import { Fiber } from '../../fiber';


export type MountedSource = VirtualDOM | ComponentFactory | Array<ComponentFactory> | null | undefined;

const $$replaceNodeBeforeMountHook = Symbol('replaceNodeBeforeMountHook');
const $$replaceNodeAfterMountHook = Symbol('replaceNodeAfterMountHook');
const $$skipNodeMountHook = Symbol('skipNodeMountHook');

type SharedOptions = {
  mountedSource: MountedSource;
  mountedNodeId: string;
  mountedComponentId: string;
  async?: boolean;
};

type WrapWithRooOptions = {} & SharedOptions;

function wrapWithRoot(options: WrapWithRooOptions): VirtualNode {
  const {
    mountedNodeId,
    mountedComponentId,
  } = options;
  let {
    mountedSource,
  } = options;
  let vNode = null;

  if (isNull(mountedSource)) {
    mountedSource = createVirtualEmptyNode();
  }

  const mountedVDOM = mountVirtualDOM({
    mountedSource,
    mountedNodeId: getCompletedNodeIdFromEnd(mountedNodeId, 0),
    mountedComponentId,
  });

  vNode = createVirtualNode('TAG', {
    name: 'root',
    nodeId: mountedNodeId,
    componentId: '0.-1',
    children: isArray(mountedVDOM) ? mountedVDOM : [mountedVDOM],
  });

  return vNode;
}

function generateComponentRouteKey(source: MountedSource, fallback: number): number | string {
  const key = (getIsComponentFactory(source) && source.props.key) || null;
  const formattedKey = !isEmpty(key) ? `[${key}]` : fallback;

  return formattedKey;
}

type FlatVirtualDOMOptions = {} & SharedOptions;

function flatVirtualDOM(options: FlatVirtualDOMOptions): VirtualDOM {
  const {
    mountedSource,
    mountedNodeId,
    mountedComponentId,
  } = options;
  let vNode: VirtualDOM = null;
  const isList = isArray(mountedSource);
  const isVNode = isVirtualNode(mountedSource);
  let mountedSourceList: Array<MountedSource> = [];

  if (isList) {
    mountedSourceList = mountedSource as Array<MountedSource>
  } else if (isVNode) {
    vNode = mountedSource as VirtualNode;
    vNode.nodeId = mountedNodeId;
    vNode.componentId = mountedComponentId;
    mountedSourceList = vNode.children;
  }

  const list =  [];

  const parentNodeId = getParentNodeId(mountedNodeId);
  const lastId = getLastRouteIdFromNodeId(mountedNodeId);
  let shift = 0;

  for (let i = 0; i < mountedSourceList.length; i++) {
    const source = mountedSourceList[i];
    const nodeId = isList
      ? parentNodeId + '.' + +(lastId + shift + i)
      : mountedNodeId + '.' + +(shift + i)
    const componentId = mountedComponentId + '.' + generateComponentRouteKey(source, i)
    const vDOM = mountVirtualDOM({
      mountedSource: source,
      mountedNodeId: nodeId,
      mountedComponentId: componentId,
    });

    if (isArray(vDOM)) {
      shift += flatten(vDOM).length - 1;
    }

    list.push(vDOM);
  }

  if (isList) {
    vNode = flatten(list);
  } else if (isVNode) {
    (vNode as VirtualNode).children = flatten(list);
  }

  return vNode;
}

type MountVirtualDOMOptions = {
  mountedSource: MountedSource;
  fromRoot?: boolean;
} & Partial<Omit<SharedOptions, 'mountedSource'>>;

function mountVirtualDOM(options: MountVirtualDOMOptions): VirtualDOM {
  const {
    mountedSource,
    mountedComponentId = '0',
    fromRoot = false,
  } = options;
  let { mountedNodeId = '0' } = options;
  let vNode: MountedSource = null;
  let isList = false;

  if (fromRoot) {
    vNode = wrapWithRoot({
      mountedSource,
      mountedNodeId,
      mountedComponentId,
    });
  } else if (getIsComponentFactory(mountedSource)) {
    const componentFactory = mountedSource as ComponentFactory;

    if (getIsPortal(componentFactory)) {
      mountedNodeId = '0';
    }

    const key = componentFactory.props[ATTR_KEY];
    const componentId = completeComponentIdFromEnd(mountedComponentId, COMPONENT_MARKER);

    setMountedComponentFactory(componentFactory);
    setMountedComponentId(componentId);

    const nodeId: string = mountedNodeId;
    const skipMount = isFunction(componentFactory.props[$$skipNodeMountHook])
      ? componentFactory.props[$$skipNodeMountHook](componentId)
      : false;
    const isMemo = getIsMemo(mountedSource);
    let isDifferentNodeIds = false;

    if (skipMount) {
      vNode = getComponentVirtualNodesById(componentId);
      isDifferentNodeIds = vNode[0] ? vNode[0].nodeId !== nodeId : false;
      isList = isArray(vNode);

      if (isList && vNode.length === 1) {
        vNode = vNode[0];
      }
    } else {
      vNode = componentFactory.createElement();
      isList = isArray(vNode);

      if (!isMemo) {
        if (!vNode || isList && !vNode[0]) {
          vNode = getEmptyVirtualNodeIfNodeNotExists(vNode as VirtualDOM, nodeId, mountedComponentId);
        }

        if (!isEmpty(key) && getIsComponentFactory(vNode)) {
          vNode.props[ATTR_KEY] = key;
        }
      }
    }

    !isMemo && resetHooks(componentId);

    vNode = isFunction(componentFactory.props[$$replaceNodeBeforeMountHook])
      ? componentFactory.props[$$replaceNodeBeforeMountHook](vNode, componentId, nodeId, skipMount, isDifferentNodeIds)
      : vNode;

    if (!skipMount) {
      if (getIsComponentFactory(vNode)) {
        vNode = mountVirtualDOM({
          mountedSource: vNode,
          mountedNodeId: nodeId,
          mountedComponentId: componentId,
        });
      } else if (Boolean(vNode)) {
        vNode = flatVirtualDOM({
          mountedSource: vNode,
          mountedNodeId: nodeId,
          mountedComponentId: componentId,
        });
      }
    }

    vNode = isFunction(componentFactory.props[$$replaceNodeAfterMountHook])
      ? componentFactory.props[$$replaceNodeAfterMountHook](vNode, componentId)
      : vNode;
    isList = isArray(vNode);

    if (!isMemo) {
      if (!skipMount) {
        if (!isList && !isEmpty(key) && !isEmpty(vNode)) {
          setAttribute(vNode as VirtualNode, ATTR_KEY, key);
        }
        setComponentPropsById(componentId, componentFactory.props);
        linkComponentIdToParentComponent(componentId);
      }

      if (!skipMount || isDifferentNodeIds) {
        const vNodes = (isList ? vNode : [vNode]) as Array<VirtualNode>;

        setComponentVirtualNodesById(componentId, vNodes.filter(Boolean));
      }
    }
  } else if (Boolean(mountedSource)) {
    vNode = flatVirtualDOM({
      mountedSource,
      mountedNodeId,
      mountedComponentId,
    });
  }

  if (!vNode || isList && !vNode[0]) {
    vNode = getEmptyVirtualNodeIfNodeNotExists(vNode as VirtualDOM, mountedNodeId, mountedComponentId);
  }

  return vNode as VirtualDOM;
}

function getEmptyVirtualNodeIfNodeNotExists(
  vNode: VirtualDOM | null | undefined, nodeId: string, componentId: string): VirtualDOM {
  let vdom = vNode;

  if (isArray(vdom) && !vdom[0]) {
    vdom[0] = createVirtualEmptyNode();
    vdom[0].nodeId = nodeId;
    vdom[0].componentId = componentId;
  } else if (!vdom) {
    vdom = createVirtualEmptyNode();
    vdom.nodeId = nodeId;
    vdom.componentId = componentId;
  }

  return vdom;
}

export {
  $$replaceNodeBeforeMountHook,
  $$replaceNodeAfterMountHook,
  $$skipNodeMountHook,
  mountVirtualDOM,
};
