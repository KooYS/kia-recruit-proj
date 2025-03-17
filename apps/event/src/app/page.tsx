import { redirect } from 'next/navigation';
import { parseAsString, createLoader } from 'nuqs/server';

export const university = {
  university: parseAsString,
};
const loadSearchParams = createLoader(university);
import type { SearchParams } from 'nuqs/server';

type PageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function Page({ searchParams }: PageProps) {
  const { university } = await loadSearchParams(searchParams);

  redirect(`1${university ? `?u=${encodeURI(university)}` : ''}`);
}
