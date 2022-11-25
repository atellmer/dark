declare class SyntheticEvent<E extends Event, T = Element> {
  type: string;
  sourceEvent: E;
  target: T;
  private propagation;
  constructor(options: Pick<SyntheticEvent<E, T>, 'sourceEvent' | 'target'>);
  stopPropagation(): void;
  preventDefault(): void;
  getPropagation(): boolean;
}
declare type DelegateEventOptions = {
  target: Element;
  eventName: string;
  handler: (e: Event) => void;
};
declare function delegateEvent(options: DelegateEventOptions): void;
declare const detectIsEvent: (attrName: string) => boolean;
declare const getEventName: (attrName: string) => string;
export { SyntheticEvent, delegateEvent, detectIsEvent, getEventName };
