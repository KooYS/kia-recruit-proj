import React, { Suspense } from 'react';
import { RequestForm } from '../_components/RequestForm';

const Page = () => {
  return (
    <div className="h-full flex flex-col justify-center items-center ">
      <div className=" max-w-[640px] h-fit my-auto border rounded-lg p-5 md:m-auto  bg-white text-black">
        <Suspense>
          <RequestForm />
        </Suspense>
      </div>
    </div>
  );
};

export default Page;
