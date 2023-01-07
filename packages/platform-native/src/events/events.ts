import type { TagNativeElement } from '../native-element';

class SyntheticEvent<E extends Event, T = TagNativeElement> {
  public type = '';
  public sourceEvent: E = null;
  public target: T = null;
  private propagation = true;

  constructor(options: Pick<SyntheticEvent<E, T>, 'sourceEvent' | 'target'>) {
    this.type = options.sourceEvent.type;
    this.sourceEvent = options.sourceEvent;
    this.target = options.target;
  }

  public stopPropagation() {
    this.propagation = false;
    this.sourceEvent.stopPropagation();
  }

  public preventDefault() {
    this.sourceEvent.preventDefault();
  }

  public getPropagation() {
    return this.propagation;
  }
}

const detectIsEvent = (attrName: string) => attrName.startsWith('on');

const getEventName = (attrName: string) => attrName.slice(2, attrName.length).toLowerCase();

export { SyntheticEvent, detectIsEvent, getEventName };
