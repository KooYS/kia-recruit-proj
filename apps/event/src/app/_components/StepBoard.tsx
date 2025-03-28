'use client';
import { Button } from '@repo/ui/components/ui/button';
import { redirect, useRouter } from 'next/navigation';
import React from 'react';

const StepBoard = ({ university }: { university: string }) => {
  return (
    <div className="flex flex-col gap-10 my-20 mx-10">
      <Button
        className="relative py-10 text-lg text-bold bg-white text-black hover:bg-white border-4"
        onClick={() => {
          window.open('https://dkzl.me/Kia_luckydraw', '_blank');
        }}
      >
        Kia 인재채용 회원가입
        <span className="absolute -top-5 -left-5 bg-white text-black border-4 text-sm h-10 px-4 rounded-full flex items-center justify-center">
          STEP 1
        </span>
      </Button>
      <Button
        className="relative py-10 text-lg text-bold bg-white text-black hover:bg-white border-4"
        onClick={() => {
          redirect(`1${`?u=${encodeURI(university || '')}`}`);
        }}
      >
        룰렛 돌리기
        <span className="absolute -top-5 -left-5 bg-white text-black border-4 text-sm h-10 px-4 rounded-full flex items-center justify-center">
          STEP 2
        </span>
      </Button>
    </div>
  );
};

export default StepBoard;
