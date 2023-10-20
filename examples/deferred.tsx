import { h, Fragment, component, useState, useMemo, useDeferredValue } from '@dark-engine/core';
import { render } from '@dark-engine/platform-browser';

function generateProducts() {
  const products: Array<string> = [];

  for (let i = 0; i < 500; i++) {
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

type SlowListItemProps = {
  slot: string;
};

const SlowListItem = component<SlowListItemProps>(({ slot }) => {
  const startTime = performance.now();

  while (performance.now() - startTime < 3) {
    // Do nothing for 3 ms per item to emulate extremely slow code
  }

  return <li>{slot}</li>;
});

type ProductListProps = {
  name: string;
  isStale: boolean;
};

const ProductList = component<ProductListProps>(({ name, isStale }) => {
  const items = useMemo(() => {
    const products = filterProducts(name);

    return (
      <>
        {products.map(product => (
          <SlowListItem key={product}>{product}</SlowListItem>
        ))}
      </>
    );
  }, [name]);

  return <ul style={`color: ${isStale ? 'red' : 'yellow'}`}>{items}</ul>;
});

const App = component(() => {
  const [name, setName] = useState('');
  const deferredName = useDeferredValue(name);
  const isStale = name !== deferredName;

  const handleInput = e => setName(e.target.value);

  return (
    <div>
      <input value={name} placeholder='type...' onInput={handleInput} />
      <ProductList name={deferredName} isStale={isStale} />
    </div>
  );
});

render(<App />, document.getElementById('root'));
