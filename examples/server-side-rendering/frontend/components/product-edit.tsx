import { component } from '@dark-engine/core';
import { useMatch, useHistory, useParams } from '@dark-engine/web-router';

import { type Product } from '../../contract';
import { useProduct, useChangeProductMutation } from '../hooks';
import { Card } from './ui';
import { ProductForm } from './product-form';

const ProductEdit = component(() => {
  const params = useParams();
  const { url } = useMatch();
  const history = useHistory();
  const id = Number(params.get('id'));
  const { data: product } = useProduct(id);
  const [changeProduct, { isFetching }] = useChangeProductMutation();
  const urlToList = url.replace(`${id}/edit`, '');

  const handleSubmit = async (product: Partial<Product>) => {
    if (isFetching) return;
    await changeProduct(id, product);
    history.push(urlToList);
  };

  return (
    <Card $isFetching={isFetching}>
      <h3>Edit product</h3>
      <ProductForm variant='edit' product={product} onSubmit={handleSubmit} />
    </Card>
  );
});

export default ProductEdit;
