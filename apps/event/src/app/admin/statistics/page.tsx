import React from 'react';
import { _Response, Fetch } from '@/app/_utils/api';
import { console_dev } from '../_utils/get_env';

//매번 다른 데이터를 가져와 렌더링해야 하는 페이지인데, API 도 Next.js 내에서 구현을 하다보니 해당 페이지를 정적 페이지로 빌드하려고 하니 문제가 생기는 것 같습니다. 클라이언트 컴포넌트는 해당 에러 X, 기본적인 서버 컴포넌트들이 에러가 되는 것 같습니다. 그 때 아래를 추가해서 동적페이지로 설정
export const dynamic = 'force-dynamic';

interface PrizeType {
  university: string;
  first_prize: number;
  second_prize: number;
  third_prize: number;
}

const Page = async () => {
  const { body: data } = await Fetch<_Response<PrizeType[]>>(
    '/api/admin/statistics',
    {
      method: 'GET',
    }
  );
  return (
    <div className="h-full w-full">
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 p-5 min-w-[200px] grid grid-cols-3 gap-2 overflow-scroll h-full content-start">
        {data.map((item) => (
          <div
            key={item.university}
            className="flex flex-col justify-between border rounded-md p-3 "
          >
            <div className="font-extrabold text-lg">{item.university}</div>
            <div className="space-y-1 mt-2">
              <p className="font-semibold text-gray-500">
                1등(모바일교환권(1만원))
              </p>
              <p className="text-[20px]">{item.first_prize}명</p>
            </div>
            <div className="space-y-1 mt-2">
              <p className="font-semibold text-gray-500">2등(커피)</p>
              <p className="text-[20px]">{item.second_prize}명</p>
            </div>
            <div className="space-y-1 mt-2">
              <p className="font-semibold text-gray-500">3등(노트북 스티커)</p>
              <p className="text-[20px]">{item.third_prize}명</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page;
