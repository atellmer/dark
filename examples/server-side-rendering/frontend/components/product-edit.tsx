import { h, component } from '@dark-engine/core';
import { type SyntheticEvent } from '@dark-engine/platform-browser';
import { useMatch, useHistory, useParams } from '@dark-engine/web-router';

import { useProduct, useChangeProductMutation } from '../hooks';
import { Card, Input, Textarea, Form, Button } from './ui';

const ProductEdit = component(() => {
  const params = useParams();
  const { url } = useMatch();
  const history = useHistory();
  const id = Number(params.get('id'));
  const { data: product } = useProduct(id);
  const [changeProduct, { loading }] = useChangeProductMutation();
  const urlToList = url.replace(`${id}/edit/`, '');

  const handleSubmit = async (e: SyntheticEvent<InputEvent, HTMLFormElement>) => {
    e.preventDefault();
    const { elements } = e.target;
    const name = elements['name'].value as string;
    const description = elements['desc'].value as string;

    if (loading) return;
    await changeProduct(id, { name, description });
    history.push(urlToList);
  };

  return (
    <Card $loading={loading}>
      <h3>Edit product</h3>
      <Form onSubmit={handleSubmit}>
        <label for='name'>Name:</label>
        <Input id='name' required value={product.name} />
        <label for='desc'>Description:</label>
        <Textarea id='desc' required rows={5} value={product.description} />
        <Button type='submit'>Edit</Button>
      </Form>
    </Card>
  );
});

export default ProductEdit;
