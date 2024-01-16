import { h, Fragment, component, useMutation, useCache } from '@dark-engine/core';
import { useMatch, useHistory, useParams } from '@dark-engine/web-router';

import { type ProductBrief, type Product, State, api } from '../api';
import { Card, Button } from './ui';

const ProductRemove = component(() => {
  const { url } = useMatch();
  const history = useHistory();
  const params = useParams();
  const id = Number(params.get('id'));
  const cache = useCache();
  const record = cache.read<Product>({ key: State.PRODUCT_ITEM, id });
  const [removeProduct, { loading }] = useMutation(api.removeProduct, {
    onComplete: cache => {
      const record = cache.read<Array<ProductBrief>>({ key: State.PRODUCTS });

      if (record) {
        const products = record.data;
        const idx = products.findIndex(x => x.id === id);

        if (idx !== -1) {
          products.splice(idx, 1);
          cache.optimistic({ key: State.PRODUCTS, data: products });
        }
      }

      cache.delete({ key: State.PRODUCT_ITEM, id });
    },
  });
  const urlToList = url.replace(`${id}/remove/`, '');

  const handleRemove = async () => {
    if (loading) return;
    await removeProduct(id);
    history.push(urlToList);
  };

  return (
    <Card $loading={loading}>
      {record ? (
        <>
          <h3>Do you want to remove product #{id}? 🤔</h3>
          <Button onClick={handleRemove}>Yes</Button>
          <Button onClick={() => history.back()}>No</Button>
        </>
      ) : (
        <h3>It seems there is no product with #{id} 🤫</h3>
      )}
    </Card>
  );
});

export default ProductRemove;
