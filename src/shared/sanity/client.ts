import sanityClient from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
const { VITE_SANITY_PROJECT_ID, VITE_SANITY_TOKEN } = import.meta.env;

export const client = sanityClient({
  projectId: VITE_SANITY_PROJECT_ID,
  dataset: 'production',
  apiVersion: '2022-02-01',
  useCdn: true,
  token: VITE_SANITY_TOKEN,
  ignoreBrowserTokenWarning: true,
});

const builder = imageUrlBuilder(client);

export const urlFor = (source: string) => source ? builder.image(source)?.url(): '';