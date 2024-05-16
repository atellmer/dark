import { component } from '@dark-engine/core';
import { Metatags } from '@dark-engine/platform-browser';

type MetadataProps = {
  marker: 'products-list' | 'products-analytics' | 'products-balance' | 'operations' | 'invoices';
};

const Metadata = component<MetadataProps>(({ marker }) => {
  const map: Record<MetadataProps['marker'], string> = {
    'products-list': `Products - List 📈`,
    'products-analytics': `Products - Analytics 📈`,
    'products-balance': 'Products - Balance 📈',
    operations: 'Operations 💵',
    invoices: 'Invoices 🛒',
  };
  const title = map[marker] || '';
  const description = `This is description for ${title}`;

  return (
    <Metatags>
      <meta charset='UTF-8' />
      <meta name='viewport' content='width=device-width, initial-scale=1.0' />
      <meta http-equiv='X-UA-Compatible' content='ie=edge' />
      <meta name='theme-color' content='#fdd835' />
      <meta name='description' content={description} />
      <link rel='manifest' href='/static/assets/manifest.webmanifest' />
      <link rel='preload' href='/static/assets/fonts/Roboto-Regular.ttf' _as='font' crossorigin='anonymous' />
      <base href='/' />
      <title>{title}</title>
    </Metatags>
  );
});

export { Metadata };
