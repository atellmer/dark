/** @jsx h */
import { render } from '@dark-engine/platform-browser';

import { dom, createReplacerString } from '@test-utils';
import { h } from '../element';
import { component } from '../component';
import { type LazyModule, lazy } from '../lazy';
import { Suspense } from './suspense';
import { Fragment } from '../fragment';

let host: HTMLElement = null;
const replacer = createReplacerString();

jest.useRealTimers();

beforeEach(() => {
  host = document.createElement('div');
});

describe('[Suspense]', () => {
  test('shows fallback correctly', done => {
    const Lazy = lazy(
      () =>
        new Promise<LazyModule>(resolve => {
          setTimeout(() => {
            resolve({ default: component(() => <div>lazy</div>) });
          }, 10);
        }),
      () => {
        expect(host.innerHTML).toBe(content2());
        render(App(), host);
        expect(host.innerHTML).toBe(content2());
        done();
      },
    );

    const content1 = () => dom`${replacer}<div>loading...</div>`;

    const content2 = () => dom`<div>lazy</div>`;

    const App = component(() => {
      return (
        <Suspense fallback={<div>loading...</div>}>
          <Lazy />
        </Suspense>
      );
    });

    render(App(), host);
    expect(host.innerHTML).toBe(content1());
  });

  test('can render and wait more than one lazy components correctly', done => {
    const Lazy1 = lazy(
      () =>
        new Promise<LazyModule>(resolve => {
          setTimeout(() => {
            resolve({ default: component(() => <div>lazy 1</div>) });
          }, 10);
        }),
      () => {
        expect(host.innerHTML).toBe(content2());
      },
    );
    const Lazy2 = lazy(
      () =>
        new Promise<LazyModule>(resolve => {
          setTimeout(() => {
            resolve({ default: component(() => <div>lazy 2</div>) });
          }, 20);
        }),
      () => {
        expect(host.innerHTML).toBe(content3());
        setTimeout(() => done());
      },
    );

    const content1 = () => dom`
      ${replacer}
      ${replacer}
      <div>loading...</div>
    `;

    const content2 = () => dom`
      ${replacer}
      <div>loading...</div>
    `;

    const content3 = () =>
      dom`
        <div>lazy 1</div>
        <div>lazy 2</div>
      `;

    const App = component(() => {
      return (
        <Suspense fallback={<div>loading...</div>}>
          <Lazy1 />
          <Lazy2 />
        </Suspense>
      );
    });

    render(App(), host);
    expect(host.innerHTML).toBe(content1());
  });

  test('can render and wait nested lazy components correctly', done => {
    const Lazy1 = lazy(
      () =>
        new Promise<LazyModule>(resolve => {
          setTimeout(() => {
            resolve({
              default: component(() => (
                <>
                  <div>lazy 1</div>
                  <Lazy2 />
                </>
              )),
            });
          }, 10);
        }),
      () => {
        expect(host.innerHTML).toBe(content2());
      },
    );
    const Lazy2 = lazy(
      () =>
        new Promise<LazyModule>(resolve => {
          setTimeout(() => {
            resolve({ default: component(() => <div>lazy 2</div>) });
          }, 20);
        }),
      () => {
        expect(host.innerHTML).toBe(content3());
        setTimeout(() => done());
      },
    );

    const content1 = () => dom`
      ${replacer}
      <div>loading...</div>
    `;

    const content2 = () => dom`
      <div>loading...</div>
      ${replacer}
    `;

    const content3 = () =>
      dom`
        <div>lazy 1</div>
        <div>lazy 2</div>
    `;

    const App = component(() => {
      return (
        <Suspense fallback={<div>loading...</div>}>
          <Lazy1 />
        </Suspense>
      );
    });

    render(App(), host);
    expect(host.innerHTML).toBe(content1());
  });

  test('can render and wait nested lazy components with many root tags correctly', done => {
    const Lazy1 = lazy(
      () =>
        new Promise<LazyModule>(resolve => {
          setTimeout(() => {
            resolve({
              default: component(() => (
                <>
                  <div>lazy 1</div>
                  <div>lazy 11</div>
                  <Lazy2 />
                  <div>lazy 111</div>
                </>
              )),
            });
          }, 10);
        }),
      () => {
        expect(host.innerHTML).toBe(content2());
      },
    );
    const Lazy2 = lazy(
      () =>
        new Promise<LazyModule>(resolve => {
          setTimeout(() => {
            resolve({
              default: component(() => (
                <>
                  <div>lazy 2</div>
                  <div>lazy 22</div>
                  <div>lazy 222</div>
                </>
              )),
            });
          }, 20);
        }),
      () => {
        expect(host.innerHTML).toBe(content3());
        setTimeout(() => done());
      },
    );

    const content1 = () => dom`
      ${replacer}
      <div>loading 1...</div>
      <div>loading 2...</div>
    `;

    const content2 = () => dom`
      <div>loading 1...</div>
      <div>loading 2...</div>
      ${replacer}
    `;

    const content3 = () =>
      dom`
        <div>lazy 1</div>
        <div>lazy 11</div>
        <div>lazy 2</div>
        <div>lazy 22</div>
        <div>lazy 222</div>
        <div>lazy 111</div>
    `;

    const App = component(() => {
      return (
        <Suspense
          fallback={
            <>
              <div>loading 1...</div>
              <div>loading 2...</div>
            </>
          }>
          <Lazy1 />
        </Suspense>
      );
    });

    render(App(), host);
    expect(host.innerHTML).toBe(content1());
  });

  test('can render nested suspenses correctly', done => {
    const Lazy1 = lazy(
      () =>
        new Promise<LazyModule>(resolve => {
          setTimeout(() => {
            resolve({
              default: component(() => (
                <>
                  <div>lazy 1</div>
                  <div>lazy 11</div>
                  <Lazy2 />
                  <div>lazy 111</div>
                </>
              )),
            });
          }, 10);
        }),
      () => {
        expect(host.innerHTML).toBe(content2());
      },
    );
    const Lazy2 = lazy(
      () =>
        new Promise<LazyModule>(resolve => {
          setTimeout(() => {
            resolve({
              default: component(() => (
                <Suspense fallback={<div>nested loading...</div>}>
                  <Lazy3 />
                </Suspense>
              )),
            });
          }, 20);
        }),
      () => {
        expect(host.innerHTML).toBe(content3());
      },
    );
    const Lazy3 = lazy(
      () =>
        new Promise<LazyModule>(resolve => {
          setTimeout(() => {
            resolve({
              default: component(() => (
                <>
                  <div>lazy 3</div>
                  <div>lazy 33</div>
                  <div>lazy 333</div>
                </>
              )),
            });
          }, 30);
        }),
      () => {
        expect(host.innerHTML).toBe(content4());
        setTimeout(() => done());
      },
    );

    const content1 = () => dom`
      ${replacer}
      <div>loading 1...</div>
      <div>loading 2...</div>
    `;

    const content2 = () => dom`
      <div>loading 1...</div>
      <div>loading 2...</div>
      ${replacer}
    `;

    const content3 = () =>
      dom`
        <div>lazy 1</div>
        <div>lazy 11</div>
        ${replacer}
        <div>nested loading...</div>
        <div>lazy 111</div>
    `;

    const content4 = () =>
      dom`
        <div>lazy 1</div>
        <div>lazy 11</div>
        <div>lazy 3</div>
        <div>lazy 33</div>
        <div>lazy 333</div>
        <div>lazy 111</div>
    `;

    const App = component(() => {
      return (
        <Suspense
          fallback={
            <>
              <div>loading 1...</div>
              <div>loading 2...</div>
            </>
          }>
          <Lazy1 />
        </Suspense>
      );
    });

    render(App(), host);
    expect(host.innerHTML).toBe(content1());
  });
});
