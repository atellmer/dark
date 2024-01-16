import { h, component, useMutation, useCache } from '@dark-engine/core';
import { type SyntheticEvent } from '@dark-engine/platform-browser';
import { useMatch, useHistory, useParams } from '@dark-engine/web-router';

import { type Product, type ProductBrief, State, api } from '../api';
import { Card, Input, Textarea, Form, Button } from './ui';

const ProductEdit = component(() => {
  const params = useParams();
  const id = Number(params.get('id'));
  const [changeProduct, { loading }] = useMutation(api.changeProduct, {
    onComplete: (cache, product) => {
      const record = cache.read<Array<ProductBrief>>({ key: State.PRODUCTS });

      if (record) {
        const products = record.data;
        const $product = products.find(x => x.id === id);

        $product.name = product.name;
        cache.optimistic({ key: State.PRODUCTS, data: products });
        cache.optimistic({ key: State.PRODUCT_ITEM, data: product, id });
      }
    },
  });
  const { url } = useMatch();
  const history = useHistory();
  const urlToList = url.replace(`${id}/edit/`, '');
  const cache = useCache();
  const record = cache.read<Product>({ key: State.PRODUCT_ITEM, id });
  const product = record?.data;

  const handleSubmit = async (e: SyntheticEvent<InputEvent, HTMLFormElement>) => {
    e.preventDefault();
    const name = e.target.elements['name'].value as string;
    const description = e.target.elements['desc'].value as string;

    if (loading) return;
    await changeProduct({ ...product, name, description });
    history.push(urlToList);
  };

  return (
    <Card $loading={loading}>
      <h3>Edit product</h3>
      {product ? (
        <Form onSubmit={handleSubmit}>
          <label for='name'>Name:</label>
          <Input id='name' required value={product.name} />
          <label for='desc'>Description:</label>
          <Textarea id='desc' required rows={5} value={product.description} />
          <Button type='submit'>Edit</Button>
        </Form>
      ) : (
        <div>It seems there is no product with #{id} 🤫</div>
      )}
    </Card>
  );
});

export default ProductEdit;
