import React, { Suspense } from 'react';
import Step2Container from '../_containers/Step2Container';

const Page = () => {
  return (
    <Suspense>
      <Step2Container />
    </Suspense>
  );
};

export default Page;
