import { h, component } from '@dark-engine/core';
import { useMatch, useHistory } from '@dark-engine/web-router';

import { type Product } from '../../contract';
import { useAddProductMutation } from '../hooks';
import { Card } from './ui';
import { ProductForm } from './product-form';

const ProductAdd = component(() => {
  const { url } = useMatch();
  const history = useHistory();
  const [addProduct, { loading }] = useAddProductMutation();
  const urlToList = url.replace('add/', '');

  const handleSubmit = async (product: Partial<Product>) => {
    if (loading) return;
    await addProduct(product);
    history.push(urlToList);
  };

  return (
    <Card $loading={loading}>
      <h3>Add product</h3>
      <ProductForm variant='add' onSubmit={handleSubmit} />
    </Card>
  );
});

export default ProductAdd;
