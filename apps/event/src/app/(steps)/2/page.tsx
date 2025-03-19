import React, { Suspense } from 'react';
import Step2Container from '../_containers/Step2Container';
import { prisma } from '@repo/db';
import { parseAsString, createLoader } from 'nuqs/server';
import type { SearchParams } from 'nuqs/server';
import { Fetch } from '@/app/_utils/api';

const user = {
  u: parseAsString,
  m: parseAsString,
  n: parseAsString,
  p: parseAsString,
};
const loadSearchParams = createLoader(user);

type PageProps = {
  searchParams: Promise<SearchParams>;
};

const Page = async ({ searchParams }: PageProps) => {
  const { u, m, n, p } = await loadSearchParams(searchParams);

  if (!u || !m || !n || !p) {
    return <div>URL 접근이 잘못되었습니다. 다시 처음 QR 스캔을 해주세요.</div>;
  }
  const user = await prisma.user.findFirst({
    relationLoadStrategy: 'join',
    include: {
      prize: true,
    },
    where: {
      university: u,
      major: m,
      username: n,
      phone: p,
    },
  });

  const { data: receivedPrizeCount } = await Fetch<{
    data: { '1등': number; '2등': number; '3등': number };
  }>(`/api/prize?u=${u}`, {});

  console.log(receivedPrizeCount);

  return (
    <Suspense>
      {user && (
        <Step2Container user={user} receivedPrizeCount={receivedPrizeCount} />
      )}
    </Suspense>
  );
};

export default Page;
