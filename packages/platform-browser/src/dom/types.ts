export type DOMElement = HTMLElement | SVGElement | Text | Comment;

export type DOMFragment = {
  fragment: DocumentFragment;
  callback: () => void;
};
