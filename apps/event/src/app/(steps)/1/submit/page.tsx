import { _Response, Fetch } from '@/app/_utils/api';
import { redirect } from 'next/navigation';
import { createLoader, parseAsString, type SearchParams } from 'nuqs/server';

export const user = {
  university: parseAsString,
  major: parseAsString,
  username: parseAsString,
  phone: parseAsString,
};
const loadSearchParams = createLoader(user);

type PageProps = {
  searchParams: Promise<SearchParams>;
};

const Page = async ({ searchParams }: PageProps) => {
  const { university, major, username, phone } =
    await loadSearchParams(searchParams);
  if (!university || !major || !username || !phone) {
    throw new Error('All fields must be provided and non-null');
  }
  const data = await Fetch<
    _Response<{
      message: string;
      redirect: string;
    }>
  >('/api/user', {
    method: 'POST',
    body: JSON.stringify({ university, major, username, phone }),
  });
  return redirect(data.body.redirect);
};

export default Page;
