function fastUpdate(fiber: Fiber) {
  if (!fiber.alternate) return;
  const children = hasChildrenProp(fiber.instance) ? fiber.instance.children : [];
  if (children.length !== fiber.alternate.childrenCount || children.length < 5) return;
  const idxs = [];
  let idx = 0;
  let nextFiber = fiber.alternate.child;

  for (const instance of children) {
    if (nextFiber && detectIsMemo(instance) && detectIsMemo(nextFiber.instance)) {
      const alternateFactory = nextFiber.instance as ComponentFactory;
      const factory = instance as ComponentFactory;
      const props = alternateFactory.props;
      const nextProps = factory.props;
      const needUpdate = factory.shouldUpdate(props, nextProps);

      if (needUpdate) {
        idxs.push(idx);
      }
    } else {
      return;
    }

    nextFiber = nextFiber ? nextFiber.nextSibling : null;

    idx++;
  }

  console.log('idxs', idxs);
}