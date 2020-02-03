import { flatten, isArray, isNull, isFunction, isEmpty, createComponentId, deepClone } from '@helpers';
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
} from '../vnode/vnode';
import {
  setMountedComponentId,
  setMountedComponentFactory,
  resetHooks,
  getComponentVirtualNodesById,
  setComponentPropsById,
  linkComponentIdToParentComponent,
  setComponentVirtualNodesById,
} from '../../scope';
import { ATTR_KEY, COMPONENT_MARKER } from '../../constants';
import { getIsMemo } from '../../memo/memo';

export type MountedSource = VirtualDOM | ComponentFactory | Array<ComponentFactory> | null | undefined;

const $$replaceNodeBeforeMountHook = Symbol('replaceNodeBeforeMountHook');
const $$replaceNodeAfterMountHook = Symbol('replaceNodeAfterMountHook');
const $$nodeRouteHook = Symbol('nodeRouteHook');
const $$skipNodeMountHook = Symbol('skipNodeMountHook');

type WrapWithRooOptions = {
  mountedSource: MountedSource;
  mountedNodeId: string;
  mountedComponentId: string;
};

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

type FlatVirtualDOMOptions = {
  mountedSource: MountedSource;
  mountedNodeId: string;
  mountedComponentId: string;
}

function flatVirtualDOM(options: FlatVirtualDOMOptions): VirtualDOM {
  const {
    mountedSource,
    mountedNodeId,
    mountedComponentId,
  } = options;
  let vNode: VirtualDOM = null;

  if (getIsComponentFactory(mountedSource)) {
    vNode = mountVirtualDOM({
      mountedSource,
      mountedNodeId,
      mountedComponentId,
    });
  } else if (Boolean(mountedSource)) {
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

    const list = [];
    const parentNodeId = getParentNodeId(mountedNodeId);
    const lastId = getLastRouteIdFromNodeId(mountedNodeId);
    let shift = 0;

    for (let i = 0; i < mountedSourceList.length; i++) {
      const source = mountedSourceList[i];
      const nodeId = isList
        ? getCompletedNodeIdFromEnd(parentNodeId, Number(lastId + shift + i))
        : getCompletedNodeIdFromEnd(mountedNodeId, Number(shift + i))
      const componentId = completeComponentIdFromEnd(mountedComponentId, generateComponentRouteKey(source, i))
      const mounted = mountVirtualDOM({
        mountedSource: source,
        mountedNodeId: nodeId,
        mountedComponentId: componentId,
      });

      if (isArray(mounted)) {
        shift += flatten(mounted).length - 1;
      }

      list.push(mounted);
    }

    if (isList) {
      vNode = flatten(list);
    } else if (isVNode) {
      (vNode as VirtualNode).children = flatten(list);
    }
  }

  return vNode;
}

type MountVirtualDOMOptions = {
  mountedSource: MountedSource;
  mountedNodeId?: string;
  mountedComponentId?: string;
  fromRoot?: boolean;
};

function mountVirtualDOM({
  mountedSource,
  mountedNodeId = '0',
  mountedComponentId = '0',
  fromRoot = false,
}: MountVirtualDOMOptions): VirtualDOM {
  let vNode: MountedSource = null;

  if (fromRoot) {
    vNode = wrapWithRoot({
      mountedSource,
      mountedNodeId,
      mountedComponentId,
    });
  } else if (getIsComponentFactory(mountedSource)) {
    const componentFactory = mountedSource as ComponentFactory;
    const key = componentFactory.props[ATTR_KEY];
    const componentId = completeComponentIdFromEnd(mountedComponentId, COMPONENT_MARKER);

    setMountedComponentFactory(componentFactory);
    setMountedComponentId(componentId);

    const nodeId: string = isFunction(componentFactory.props[$$nodeRouteHook])
      ? componentFactory.props[$$nodeRouteHook](mountedNodeId)
      : mountedNodeId;
    const skipMount = isFunction(componentFactory.props[$$skipNodeMountHook])
      ? componentFactory.props[$$skipNodeMountHook](componentId)
      : false;
    const isMemo = getIsMemo(mountedSource);
    let isDifferentNodeIds = false;

    if (skipMount) {
      vNode = getComponentVirtualNodesById(componentId);
      isDifferentNodeIds = vNode[0]
        ? vNode[0].nodeId.slice(0, nodeId.length) !== nodeId
        : false;

      if (isArray(vNode) && vNode.length === 1) {
        vNode = vNode[0];
      }
    } else {
      vNode = componentFactory.createElement();

      if (!isMemo) {
        vNode = getEmptyVirtualNodeIfNodeNotExists(vNode as VirtualDOM, nodeId, mountedComponentId);

        if (!isEmpty(key) && getIsComponentFactory(vNode)) {
          vNode.props[ATTR_KEY] = key;
        }
      }
    }

    !isMemo && resetHooks(componentId);

    vNode = isFunction(componentFactory.props[$$replaceNodeBeforeMountHook])
      ? componentFactory.props[$$replaceNodeBeforeMountHook](
        vNode, componentId, mountedNodeId, skipMount, isDifferentNodeIds)
      : vNode;
    vNode = !skipMount ? flatVirtualDOM({
      mountedSource: vNode,
      mountedNodeId: nodeId,
      mountedComponentId: componentId,
    }) : vNode;
    vNode = isFunction(componentFactory.props[$$replaceNodeAfterMountHook])
      ? componentFactory.props[$$replaceNodeAfterMountHook](vNode, componentId)
      : vNode;

    if (!isMemo) {
      if (!skipMount) {
        if (!isArray(vNode) && !isEmpty(key) && !isEmpty(vNode)) {
          setAttribute(vNode as VirtualNode, ATTR_KEY, key);
        }
        setComponentPropsById(componentId, componentFactory.props);
        linkComponentIdToParentComponent(componentId);
      }

      if (!skipMount || isDifferentNodeIds) {
        const vNodes = (isArray(vNode) ? vNode : [vNode]) as Array<VirtualNode>;

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

  vNode = getEmptyVirtualNodeIfNodeNotExists(vNode as VirtualDOM, mountedNodeId, mountedComponentId);

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
  mountVirtualDOM,
  $$replaceNodeBeforeMountHook,
  $$replaceNodeAfterMountHook,
  $$skipNodeMountHook,
  $$nodeRouteHook,
};
