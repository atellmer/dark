import { createComponent } from '@core/component';
import render from '../../../platform/browser/render';
import { Text, View } from '../../vdom/vnode';
import { getRegistery, createApp, setAppUid } from '../../scope';
import useState from './use-state';

const div = (props = {}) => View({ ...props, as: 'div' });

beforeEach(() => {
	const registry = getRegistery();
	const app = createApp(null);

	registry.set(0, app);
	setAppUid(0);
});

test('[useState]: hook returns correctly tuple', () => {
	const initialValue = 'testStr';
	createComponent(() => {
		const [ value, setValue ] = useState(initialValue);

		expect(value).toBe(initialValue);
		expect(typeof setValue).toBe('function');

		return null;
	});
});

test(
	'[useState]: update state correctly in root component',
	async () => {
		const domElement = document.createElement('div');
		const initialValue = 'test';
		let value = null;
		let setValue = null;
		const App = createComponent(() => {
			[ value, setValue ] = useState(initialValue);

			return [
				div({
					slot: Text('value: ' + value)
				})
			];
		});

		render(App(), domElement);

		expect(domElement.innerHTML).toBe('<div>value: test</div>');

		await new Promise((resolve) =>
			setTimeout(() => {
				setValue('123');
				expect(domElement.innerHTML).toBe('<div>value: 123</div>');
				resolve();
			}, 100)
		);

		await new Promise((resolve) =>
			setTimeout(() => {
				setValue('xxx');
				expect(domElement.innerHTML).toBe('<div>value: xxx</div>');
				resolve();
			}, 200)
		);
	},
	500
);

test(
	'[useState]: update state correctly in nested component',
	async () => {
		const domElement = document.createElement('div');
		const initialValue = 'test';
		let value = null;
		let setValue = null;

		const Item = createComponent(() => {
			[ value, setValue ] = useState(initialValue);

			return [
				div({
					slot: Text('value: ' + value)
				})
			];
		});

		const App = createComponent(() => {
			return [
				div({
					slot: Item()
				})
			];
		});

		render(App(), domElement);

		expect(domElement.innerHTML).toBe('<div><div>value: test</div></div>');

		await new Promise((resolve) =>
			setTimeout(() => {
				setValue('some text');
				expect(domElement.innerHTML).toBe('<div><div>value: some text</div></div>');
				resolve();
			}, 100)
		);

		await new Promise((resolve) =>
			setTimeout(() => {
				setValue('hello world');
				expect(domElement.innerHTML).toBe('<div><div>value: hello world</div></div>');
				resolve();
			}, 200)
		);
	},
	500
);

test(
	'[useState]: update state correctly with many hooks',
	async () => {
		const domElement = document.createElement('div');
		let value = null;
		let setValue = null;
		let count = null;
		let setCount = null;

		const Item = createComponent(() => {
			[ value, setValue ] = useState('test');
			[ count, setCount ] = useState(1);

			return [
				div({
					slot: [ Text('value: ' + value) ]
				}),
				div({
					slot: [ Text('count: ' + count) ]
				})
			];
		});

		const App = createComponent(() => {
			return Item();
		});

		render(App(), domElement);

		expect(domElement.innerHTML).toBe('<div>value: test</div><div>count: 1</div>');

		await new Promise((resolve) =>
			setTimeout(() => {
				setValue('some text');
				expect(domElement.innerHTML).toBe('<div>value: some text</div><div>count: 1</div>');
				setCount(2);
				expect(domElement.innerHTML).toBe('<div>value: some text</div><div>count: 2</div>');
				resolve();
			}, 100)
		);
	},
	500
);
