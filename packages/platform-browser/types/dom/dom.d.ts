import { type Fiber, type VirtualNode } from '@dark-engine/core';
import type { DOMElement } from './types';
declare let trackUpdate: (nativeElement: Element) => void;
declare function createNativeElement(vNode: VirtualNode): DOMElement;
declare function applyCommit(fiber: Fiber<Element>): void;
declare function finishCommitWork(): void;
declare function setTrackUpdate(fn: typeof trackUpdate): void;
export { createNativeElement, applyCommit, finishCommitWork, setTrackUpdate };
