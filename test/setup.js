import { requestIdleCallback, intersectionObserver } from '@shopify/jest-dom-mocks';
import 'mutationobserver-shim';

requestIdleCallback.mock();
intersectionObserver.mock();
