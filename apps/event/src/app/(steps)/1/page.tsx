import React, { Suspense } from 'react';
import { RequestForm } from '../_components/RequestForm';

const Page = () => {
  return (
    <div className=" max-w-[640px] h-fit my-auto border rounded-lg p-5 md:m-auto m-10 bg-white text-black">
      <Suspense>
        <RequestForm />
      </Suspense>
    </div>
  );
};

export default Page;
