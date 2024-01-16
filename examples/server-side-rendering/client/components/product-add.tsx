import { h, component } from '@dark-engine/core';
import { type SyntheticEvent } from '@dark-engine/platform-browser';
import { useMatch, useHistory } from '@dark-engine/web-router';

import { useAddProductMutation } from '../hooks';
import { Card, Input, Textarea, Form, Button } from './ui';

const ProductAdd = component(() => {
  const { url } = useMatch();
  const history = useHistory();
  const [addProduct, { loading }] = useAddProductMutation();
  const urlToList = url.replace('add/', '');

  const handleSubmit = async (e: SyntheticEvent<InputEvent, HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;
    const { elements } = e.target;
    const name = elements['name'].value as string;
    const description = elements['desc'].value as string;

    await addProduct({ name, description });
    history.push(urlToList);
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
