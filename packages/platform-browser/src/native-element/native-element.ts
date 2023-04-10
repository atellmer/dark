export type NativeElement = TagNativeElement | TextNativeElement | CommentNativeElement;

export type TagNativeElement = HTMLElement | SVGElement;

export type TextNativeElement = Text;

export type CommentNativeElement = Comment;

export type AttributeValue = string | number | boolean;

export type NativeNode = NativeElement | ChildNode | DocumentFragment;
