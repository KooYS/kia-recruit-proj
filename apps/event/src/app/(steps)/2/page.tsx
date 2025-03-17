import React, { Suspense } from 'react';
import Step2Container from '../_containers/Step2Container';
import { prisma } from '@repo/db';

const Page = async () => {
  const user = await prisma.user.findFirst();

  console.log(user);
  return (
    <Suspense>
      <Step2Container />
    </Suspense>
  );
};

export default Page;
