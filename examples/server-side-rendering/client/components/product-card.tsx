import { h, component, useResource } from '@dark-engine/core';
import { RouterLink, useMatch, useParams } from '@dark-engine/web-router';
import { styled } from '@dark-engine/styled';

import { api } from '../api';
import { Spinner } from './spinner';
import { Error } from './error';

const Card = styled.article`
  padding: 16px;
  border: 1px solid #673ab7;
`;

const ProductCard = component(() => {
  const params = useParams();
  const { url } = useMatch();
  const id = Number(params.get('id'));
  const resource = useResource(id => api.fetchProduct(id), [id]);
  const { loading, data, error } = resource;
  const back = url.replace(id + '/', '');

  if (loading) return <Spinner />;
  if (error) return <Error value={error} />;

  return (
    <Card>
      <h3>{data.title}</h3>
      <p>{data.description}</p>
      <RouterLink to={back} className='router-back-link'>
        Back
      </RouterLink>
    </Card>
  );
});

export default ProductCard;
