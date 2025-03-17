import { redirect } from 'next/navigation';
import { prisma } from '@repo/db';
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
  try {
    const user = await prisma.user.create({
      data: { university, major, username, phone },
    });

    console.log(user);
    return redirect(
      `2?u=${encodeURIComponent(user.university)}&m=${encodeURIComponent(user.major)}&n=${encodeURIComponent(user.username)}&p=${encodeURIComponent(user.phone)}`
    );
  } catch (error) {
    console.error('Error creating user:', error);
    // redirect(`1${university ? `?u=${encodeURI(university)}` : ''}`);
  }
};

export default Page;
