import { EMPTY_NODE } from '@core/vdom/vnode';


function createEmptyNode(): Comment {
  return document.createComment(EMPTY_NODE);
}

export {
  createEmptyNode,
};
