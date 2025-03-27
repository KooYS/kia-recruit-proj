import React, { Suspense } from 'react';
import { RequestForm } from '../_components/RequestForm';

const Page = () => {
  return (
    <div className="h-fit my-10 flex flex-col justify-center items-center mx-5">
      <div className=" max-w-[640px] h-fit border rounded-lg p-5 m-auto w-full   bg-white text-black">
        <Suspense>
          <RequestForm />
        </Suspense>
      </div>
    </div>
  );
};

export default Page;
