import React from 'react';
import { RequestForm } from '../_components/RequestForm';

const Page = () => {
  return (
    <div className="absolute inset-0 max-w-[640px] h-fit my-auto border rounded-lg p-5 sm:m-auto m-5">
      <RequestForm />
    </div>
  );
};

export default Page;
