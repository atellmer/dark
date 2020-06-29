// import {
//   h,
//   View,
//   Text,
//   createComponent,
//   Fragment,
// } from '../src/core';
// import { render } from '../src/platform/browser';
// import { useForceUpdate } from '../src/core/fiber';


// const div = (...props) => View({ as: 'div', ...props });
// const host = document.getElementById('root');
// const host2 = document.getElementById('root2');

// let nextId = 0;

// const generateItems = (count: number) => {
//   return Array(count).fill(0).map(x => ({
//     id: ++nextId,
//     name: nextId,
//   }));
// };

// const ListItem = createComponent(({ key, id, slot, onRemove }) => {
//   return (
//     <div key={key} class='list-item'>
//       <div>slot: {slot}</div>
//       <div>
//         <button onClick={() => onRemove(id)}>remove</button>
//       </div>
//     </div>
//   );
// })

// const List = createComponent(({ items }) => {
//   const handleRemove = (id: number) => {
//     const newItems = items.filter(x => x.id !== id);

//     render(App({ items: newItems, host }), host);
//   };

//   return items.map((x => {
//     return (
//       <ListItem key={x.id} id={x.id} onRemove={handleRemove}>
//         {x.name}
//       </ListItem>
//     )
//   }))
// });

// const Counter = createComponent(() => {
//   const[update] = useForceUpdate();

//   const handleIncrement = () => {
//     counter++;
//     update();
//   };

//   return (
//     <div style='display: flex; margin: 20px;'>
//       <button onClick={handleIncrement}>increment</button>
//       {counter > 1 && <div>!!!hello!!!</div>}
//       <div style='margin-left: 20px;'>{counter}</div>
//     </div>
//   );
// }, { displayName: 'Counter' })

// const App = createComponent<{items: Array<any>; host: Element}>(({ items, host }) => {
//   const handleAddItems = () => {
//     render(App({ items: [...generateItems(10), ...items], host }), host);
//   };
//   const handleSwap = () => {
//     const newItems = [...items];
//     newItems[1] = items[items.length - 2];
//     newItems[newItems.length - 2] = items[1];

//     render(App({ items: newItems, host }), host);
//   };

//   return [
//     <div style='display: flex'>
//       <button onClick={handleAddItems}>add items</button>
//       <button onClick={handleSwap}>swap</button>
//     </div>,
//     <Counter />,
//     <List items={items} host={host} />,
//     <div>footer</div>,
//   ]
// });

// let counter = 0;
// const items = generateItems(10);

// render(App({ items, host }), host);

// //render(App({ items, host: host2 }), host2);

export enum EffectTag {
  PLACEMENT = 'PLACEMENT',
  UPDATE = 'UPDATE',
  DELETION = 'DELETION',
  SKIP = 'SKIP',
};

let nextUnitOfWork: Fiber = null;
let wipFiber: Fiber = null;
let currentRootFiber: Fiber = null;
let deletions = [];

type VirtualNode = {
  type: string | Function;
  props: object;
  children: Array<VirtualNode>;
};

const createElement = (type, props, ...args): VirtualNode => {
  return {
    type,
    props,
    children: args.filter(Boolean)
  };
};

class Fiber {
  instance: VirtualNode;
  child: Fiber;
  prevSibling: Fiber;
  nextSibling: Fiber;
  parent: Fiber;
  alternate: Fiber;
  effectTag: EffectTag;

  constructor(options: Partial<Fiber>) {
    this.instance = options.instance;
    this.child = options.child || null;
    this.prevSibling = options.prevSibling || null;
    this.nextSibling = options.nextSibling || null;
    this.parent = options.parent || null;
    this.alternate = options.alternate || null;
    this.effectTag = options.effectTag || null;
  }
}

function workLoop(deadline = null) {
  let shouldYield = false;

  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    shouldYield = deadline ? deadline.timeRemaining() < 1 : false;
  }

  if (!nextUnitOfWork && wipFiber) {
    currentRootFiber = wipFiber;
    wipFiber = null;
    console.log('currentRootFiber', currentRootFiber);
    console.log('deletions', deletions);
  }

  requestIdleCallback(workLoop);
}

let level = 0;
const levelMap = {};

function performUnitOfWork(fiber: Fiber) {
  let isDeepWalking = true;
  let element = fiber.instance;
  let nextFiber = fiber;
  let alternate =  fiber.alternate && fiber.alternate.child || null;

  while (true) {
    if (isDeepWalking) {
      const hasChild = Boolean(element.children[0]);

      if (hasChild) {
        return performChild();
      } else {
        const siblingFiber = performSibling();

        if (siblingFiber) return siblingFiber;
      }
    } else {
      const siblingFiber = performSibling();

      if (siblingFiber) return siblingFiber;
    }

    if (nextFiber.parent === null) {
      wipFiber = nextFiber;
      return null;
    }
  }

  function performChild() {
    const elements = flatten([element.children[0]]);

    element.children.splice(0, 1, ...elements);
    element = element.children[0];

    if (typeof element.type === 'function') {
      element.children = flatten([element.type(element.props)]);
    }

    level++;
    levelMap[level] = 0;

    const fiber = createFiberFromElement(element, alternate);

    nextFiber.child = fiber;
    fiber.parent = nextFiber;
    nextFiber = fiber;

    return nextFiber;
  }

  function performSibling() {
    levelMap[level]++;
    const parent = nextFiber.parent.instance;
    const childrenIdx = levelMap[level];
    const hasSibling = parent.children[childrenIdx];

    alternate = nextFiber.alternate && nextFiber.alternate.nextSibling || null;

    if (hasSibling) {
      isDeepWalking = true;
      const elements = flatten([parent.children[childrenIdx]]);

      parent.children.splice(childrenIdx, 1, ...elements);
      element = parent.children[childrenIdx];

      if (typeof element.type === 'function') {
        element.children = flatten([element.type(element.props)]);
      }

      if (alternate && alternate.instance.children.length > element.children.length) {
        const diffCount = alternate.instance.children.length - element.children.length;
        const list = takeListFromEnd(getSiblingFibers(alternate.child), diffCount);

        deletions.push(...list);
      }

      const fiber = createFiberFromElement(element, alternate);

      fiber.prevSibling = nextFiber;
      nextFiber.nextSibling = fiber;
      fiber.parent = nextFiber.parent;
      nextFiber = fiber;

      return nextFiber;
    } else {
      isDeepWalking = false;
      levelMap[level] = 0;
      nextFiber = nextFiber.parent;
      element = nextFiber.instance;
      level--;
    }

    return null;
  }

  function createFiberFromElement(element: VirtualNode, alternate: Fiber) {
    return new Fiber({
      instance: element,
      alternate: alternate || null,
      effectTag: alternate ? EffectTag.UPDATE : EffectTag.PLACEMENT,
    });
  }
}

function getSiblingFibers(fiber: Fiber) {
  const list = [];
  let nextFiber = fiber;

  while(nextFiber) {
    list.push(nextFiber);
    nextFiber = nextFiber.nextSibling;
  }

  return list;
};

function takeListFromEnd(source: Array<any>, count: number) {
  return [...source].splice(-count);
}

function flatten(source: Array<any>) {
  const list = [];
  const levelMap = { 0: { idx: 0, source } };
  let level = 0;

  do {
    const { source, idx } = levelMap[level];
    const item = source[idx];

    if (idx >= source.length) {
      level--;
      levelMap[level].idx++;
      continue;
    }

    if (Array.isArray(item)) {
      level++;
      levelMap[level] = {
        idx: 0,
        source: item,
      };
    } else {
      list.push(item);
      levelMap[level].idx++;
    }
  } while (!(level === 0 && levelMap[level].idx >= levelMap[level].source.length))

  return list;
}

const h = createElement;

let count = 10;

const Item = ({ idx }) => h(`4:${idx}`, {});

const Nested = () => {
  return Array(count).fill(0).map((x, idx) => h(Item, { idx }));
};

const Input = () => {
  return [h('3:0', {}), h(Nested, {}), h('3:1', {}), h('3:2', {})]
};

const App = () => h('1', {}, h('2:0', {}, h(Input, {})), h('2:1', {}), h('2:2', {}));

const vdom = h(App, {});

nextUnitOfWork = new Fiber({
  instance: h('root', {}, ...flatten([vdom]))
});

requestIdleCallback(workLoop);

setTimeout(() => {
  count = 5;
  nextUnitOfWork = new Fiber({
    instance: h('root', { x: 1 }, ...flatten([vdom])),
    alternate: currentRootFiber,
  });
}, 1000)
