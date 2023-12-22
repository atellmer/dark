import { h } from '@dark-engine/core';
import { createBrowserEnv, wrapWithStyledTag as style } from '@test-utils';

import { setupGlobal, styled } from '../styled';
import { Keyframes, keyframes } from '../keyframes';

let { host, render } = createBrowserEnv();

beforeEach(() => {
  jest.useFakeTimers();
  ({ host, render } = createBrowserEnv());
  setupGlobal();
});

afterEach(() => {
  document.head.innerHTML = '';
});

describe('[@styled/keyframes]', () => {
  test('creates a keyframes instance', () => {
    const spin = keyframes`
      from {
        transform: rotate(0deg);
      }

      to {
        transform: rotate(360deg);
      }
    `;

    expect(spin).toBeInstanceOf(Keyframes);
    expect(spin.getName()).toBe('dka-bbgcej');
  });

  test('renders an animation correctly', () => {
    const spin = keyframes`
      from {
        transform: rotate(0deg);
      }

      to {
        transform: rotate(360deg);
      }
    `;
    const Spinner = styled('div')`
      width: 100px;
      height: 100px;
      background-color: blueviolet;
      animation: ${spin} 3s infinite;
    `;

    render(<Spinner />);
    jest.runAllTimers();

    expect(host.innerHTML).toBe('<div class="dk-cafcji"></div>');
    expect(document.head.innerHTML).toBe(
      style(
        '.dk-cafcji{width:100px;height:100px;background-color:blueviolet;animation:dka-bbgcej 3s infinite;}@keyframes dka-bbgcej{from{transform:rotate(0deg);}to{transform:rotate(360deg);}}',
      ),
    );
  });

  test('renders a dynamic animation correctly', () => {
    const spin = (to: number) => keyframes`
      from {
        transform: rotate(0deg);
      }

      to {
        transform: rotate(${to}deg);
      }
    `;
    const Spinner = styled('div')`
      width: 100px;
      height: 100px;
      background-color: blueviolet;
      animation: ${spin(45)} 1.5s infinite;
    `;

    render(<Spinner />);
    jest.runAllTimers();

    expect(host.innerHTML).toBe('<div class="dk-bjeead"></div>');
    expect(document.head.innerHTML).toBe(
      style(
        '.dk-bjeead{width:100px;height:100px;background-color:blueviolet;animation:dka-cbdcab 1.5s infinite;}@keyframes dka-cbdcab{from{transform:rotate(0deg);}to{transform:rotate(45deg);}}',
      ),
    );
  });

  test('renders a dynamic animation with props correctly', () => {
    const spin = (to: number) => keyframes`
      from {
        transform: rotate(0deg);
      }

      to {
        transform: rotate(${to}deg);
      }
    `;
    type SpinnerProps = {
      $to: number;
    };
    const Spinner = styled<SpinnerProps>('div')`
      width: 100px;
      height: 100px;
      background-color: blueviolet;
      animation: ${p => spin(p.$to)} 1.5s infinite;
    `;

    render(<Spinner $to={90} />);
    jest.runAllTimers();

    expect(host.innerHTML).toBe('<div class="dk-dhfaea dk-biihcd"></div>');
    expect(document.head.innerHTML).toBe(
      style(
        '.dk-dhfaea{width:100px;height:100px;background-color:blueviolet;}.dk-biihcd{animation:dka-bcghbj 1.5s infinite;}@keyframes dka-bcghbj{from{transform:rotate(0deg);}to{transform:rotate(90deg);}}',
      ),
    );

    render(<Spinner $to={360} />);
    jest.runAllTimers();

    expect(host.innerHTML).toBe('<div class="dk-dhfaea dk-caiifh"></div>');
    expect(document.head.innerHTML).toBe(
      style(
        '.dk-dhfaea{width:100px;height:100px;background-color:blueviolet;}.dk-biihcd{animation:dka-bcghbj 1.5s infinite;}@keyframes dka-bcghbj{from{transform:rotate(0deg);}to{transform:rotate(90deg);}}.dk-caiifh{animation:dka-eaifeg 1.5s infinite;}@keyframes dka-eaifeg{from{transform:rotate(0deg);}to{transform:rotate(360deg);}}',
      ),
    );
  });
});
