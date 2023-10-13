import { h, component, memo, useState, useMemo, useDeferredValue } from '@dark-engine/core';
import { render } from '@dark-engine/platform-browser';

function generateProducts() {
  const products: Array<string> = [];

  for (let i = 0; i < 10000; i++) {
    products.push(`Product ${i + 1}`);
  }
  return products;
}

const dummyProducts = generateProducts();

function filterProducts(filterTerm) {
  if (!filterTerm) {
    return dummyProducts;
  }

  return dummyProducts.filter(product => product.toLowerCase().indexOf(filterTerm.toLowerCase()) !== -1);
}

type ProductListProps = {
  name: string;
};

const ProductList = memo(
  component<ProductListProps>(({ name }) => {
    const products = filterProducts(name);
    const items = products.map(product => <li key={product}>{product}</li>);

    return <ul>{items}</ul>;
  }),
  (p, n) => p.name !== n.name,
);

const App = component(() => {
  const [name, setName] = useState('');
  const deferredName = useDeferredValue(name);

  const handleInput = e => setName(e.target.value);

  return (
    <div>
      <input value={name} placeholder='type...' onInput={handleInput} />
      <ProductList name={deferredName} />
    </div>
  );
});

render(<App />, document.getElementById('root'));
