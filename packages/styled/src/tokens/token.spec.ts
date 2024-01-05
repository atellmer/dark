import {
  StyleSheet,
  StyleRule,
  NestingRule,
  MediaQueryRule,
  ContainerQueryRule,
  KeyframesRule,
  FunctionRule,
} from './tokens';

describe('@styled/tokens', () => {
  test('the StyleRule generates a style correctly', () => {
    const style = new StyleRule();

    style.name = 'background-color';
    style.value = 'red';

    expect(style.generate()).toBe('background-color:red;');
  });

  test('the NestingRule generates styles correctly', () => {
    const nr = new NestingRule();
    const style1 = new StyleRule();
    const style2 = new StyleRule();

    nr.value = '& span';
    nr.children.push(style1, style2);

    style1.name = 'background-color';
    style1.value = 'white';
    style2.name = 'color';
    style2.value = 'black';

    expect(nr.generate('test')).toBe('.test span{background-color:white;color:black;}');
  });

  test('the MediaQueryRule generates styles correctly', () => {
    const mqr = new MediaQueryRule();
    const style = new StyleRule();

    mqr.value = '@media (max-width: 600px)';
    mqr.children.push(style);

    style.name = 'background-color';
    style.value = 'red';

    expect(mqr.generate('test')).toBe('@media (max-width: 600px){.test{background-color:red;}}');
  });

  test('the ContainerQueryRule generates styles correctly', () => {
    const cqr = new ContainerQueryRule();
    const style = new StyleRule();

    cqr.value = '@container abc (max-width: 600px)';
    cqr.children.push(style);

    style.name = 'background-color';
    style.value = 'red';

    expect(cqr.generate('test')).toBe('@container abc (max-width: 600px){.test{background-color:red;}}');
  });

  test('the KeyframesRule generates styles correctly', () => {
    const kr = new KeyframesRule();
    const from = new NestingRule();
    const to = new NestingRule();
    const style1 = new StyleRule();
    const style2 = new StyleRule();

    kr.value = '@keyframes spin';
    kr.children.push(from, to);

    from.value = 'from';
    to.value = 'to';

    from.children.push(style1);
    to.children.push(style2);

    style1.name = 'background-color';
    style1.value = 'red';
    style2.name = 'background-color';
    style2.value = 'yellow';

    expect(kr.generate()).toBe('@keyframes spin{from{background-color:red;}to{background-color:yellow;}}');
  });

  test('the FunctionRule generates styles correctly', () => {
    type Props = { color: string };
    const fr = new FunctionRule();
    const style = new StyleRule();

    fr.style = style;
    fr.args = [1];

    style.name = 'background-color';

    const [styles] = fr.generate(null, { color: 'red' }, [() => {}, (p: Props) => p.color]);

    expect(styles).toBe('background-color:red;');
  });

  test('the StyleSheet generates an empty class without children', () => {
    const sheet = new StyleSheet();

    expect(sheet.generate({ className: 'test' })).toBe('.test{}');
  });

  test('the StyleSheet generates styles correctly', () => {
    const sheet = new StyleSheet();
    const style1 = new StyleRule();
    const style2 = new StyleRule();
    const mqr = new MediaQueryRule();
    const style3 = new StyleRule();

    mqr.value = '@media (max-width: 600px)';
    mqr.children.push(style3);

    sheet.children.push(style1, style2, mqr);

    style1.name = 'background-color';
    style1.value = 'white';
    style2.name = 'color';
    style2.value = 'black';
    style3.name = 'background-color';
    style3.value = 'pink';

    expect(sheet.generate({ className: 'test' })).toBe(
      '.test{background-color:white;color:black;}@media (max-width: 600px){.test{background-color:pink;}}',
    );
  });
});
