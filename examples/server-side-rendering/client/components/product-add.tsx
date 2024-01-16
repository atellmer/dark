import { h, component, useMutation } from '@dark-engine/core';
import { type SyntheticEvent } from '@dark-engine/platform-browser';
import { useMatch, useHistory } from '@dark-engine/web-router';

import { type ProductBrief, State, api } from '../api';
import { Card, Input, Textarea, Form, Button } from './ui';

const ProductAdd = component(() => {
  const [addProduct, { loading }] = useMutation(api.addProduct, {
    onComplete: (cache, product) => {
      const record = cache.read<Array<ProductBrief>>({ key: State.PRODUCTS });

      if (record) {
        const products = record.data;

        products.push(product);
        cache.optimistic({ key: State.PRODUCTS, data: products });
      }
    },
  });
  const { url } = useMatch();
  const history = useHistory();
  const listUrl = url.replace('add/', '');

  const handleSubmit = async (e: SyntheticEvent<InputEvent, HTMLFormElement>) => {
    e.preventDefault();
    const name = e.target.elements['name'].value as string;
    const description = e.target.elements['desc'].value as string;

    if (loading) return;
    await addProduct({ name, description });
    history.push(listUrl);
  };

  return (
    <Card $loading={loading}>
      <h3>Add product</h3>
      <Form onSubmit={handleSubmit}>
        <label for='name'>Name:</label>
        <Input id='name' required />
        <label for='desc'>Description:</label>
        <Textarea id='desc' required rows={3} />
        <Button type='submit'>Add</Button>
      </Form>
    </Card>
  );
});

export default ProductAdd;
