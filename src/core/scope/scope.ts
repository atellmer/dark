import { Fiber } from '../fiber';


let wipRoot: Fiber = null;
let currentRoot: Fiber = null;
let nextUnitOfWork: Fiber = null;

const wipRootHelper = {
  get: () => wipRoot,
  set: (fiber: Fiber) => (wipRoot = fiber),
};

const currentRootHelper = {
  get: () => currentRoot,
  set: (fiber: Fiber) => (currentRoot = fiber),
};

const nextUnitOfWorkHelper = {
  get: () => nextUnitOfWork,
  set: (fiber: Fiber) => (nextUnitOfWork = fiber),
};

export {
  wipRootHelper,
  currentRootHelper,
  nextUnitOfWorkHelper,
};
