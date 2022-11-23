import { h, createComponent, useState, useMemo, useDeferredValue } from '@dark-engine/core';
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
  products: Array<string>;
};

const ProductList = createComponent<ProductListProps>(({ products }) => {
  const deferredProducts = useDeferredValue(products);
  const items = useMemo(() => {
    return deferredProducts.map(product => <li key={product}>{product}</li>);
  }, [deferredProducts]);

  return <ul>{items}</ul>;
});

const App = createComponent(() => {
  const [name, setName] = useState('');
  const deferredName = useDeferredValue(name);
  const filteredProducts = useMemo(() => filterProducts(deferredName), [deferredName]);

  const handleInput = e => setName(e.target.value);

  return (
    <div>
      <input value={name} placeholder='type quickly 3456' onInput={handleInput} />
      <ProductList products={filteredProducts} />
    </div>
  );
});

render(<App />, document.getElementById('root'));
