import { redirect } from 'next/navigation';
import { parseAsString, createLoader } from 'nuqs/server';

const university = {
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
      <div className="max-w-[640px] h-full my-auto p-5 sm:m-auto flex flex-col justify-center items-center">
        <div className="text-center h-fit font-semibold text-black border rounded-lg  bg-white p-5 ">
          잘못된 경로입니다. 다시 QR 스캔을 해주세요.
        </div>
      </div>
    );
  }
  redirect(`1${`?u=${encodeURI(u || '')}`}`);
}
