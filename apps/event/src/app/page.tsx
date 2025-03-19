import { redirect } from 'next/navigation';
import { parseAsString, createLoader } from 'nuqs/server';

export const university = {
  u: parseAsString,
};
const loadSearchParams = createLoader(university);
import type { SearchParams } from 'nuqs/server';

type PageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function Page({ searchParams }: PageProps) {
  const { u } = await loadSearchParams(searchParams);

  if (!u || u === '') {
    return (
      <div className="absolute inset-0 max-w-[640px] h-fit my-auto border rounded-lg p-5 sm:m-auto m-5">
        <div className="text-center font-semibold">
          잘못된 경로입니다. 다시 QR 스캔을 해주세요.
        </div>
      </div>
    );
  }
  redirect(`1${`?u=${encodeURI(u || '')}`}`);
}
