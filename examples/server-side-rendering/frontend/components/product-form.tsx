import { component, useRef, useEffect } from '@dark-engine/core';
import { type SyntheticEvent } from '@dark-engine/platform-browser';

import { type Product } from '../../contract';
import { Input, Textarea, Form, Button } from './ui';

type ProductFormProps = {
  onSubmit: (x: Partial<Product>) => void;
} & (ProductAddFormProps | ProductEditFormProps);

type ProductAddFormProps = {
  variant: 'add';
};

type ProductEditFormProps = {
  variant: 'edit';
  product: Partial<Product>;
};

const ProductForm = component<ProductFormProps>(props => {
  const { variant, onSubmit } = props;
  const { product } = props as ProductEditFormProps;
  const inputRef = useRef<HTMLInputElement>(null);
  const isEdit = variant === 'edit';

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const handleSubmit = (e: SyntheticEvent<InputEvent, HTMLFormElement>) => {
    e.preventDefault();
    const { elements } = e.target;
    const name = elements['name'].value as string;
    const description = elements['desc'].value as string;

    onSubmit({ name, description });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <label for='name'>Name:</label>
      <Input ref={inputRef} id='name' required value={isEdit ? product.name : undefined} />
      <label for='desc'>Description:</label>
      <Textarea id='desc' required rows={3} value={isEdit ? product.description : undefined} />
      <Button type='submit'>{isEdit ? 'Edit' : 'Add'}</Button>
    </Form>
  );
});

export { ProductForm };
