import React from 'react';
import { _Response, Fetch } from '@/app/_utils/api';
//매번 다른 데이터를 가져와 렌더링해야 하는 페이지인데, API 도 Next.js 내에서 구현을 하다보니 해당 페이지를 정적 페이지로 빌드하려고 하니 문제가 생기는 것 같습니다. 클라이언트 컴포넌트는 해당 에러 X, 기본적인 서버 컴포넌트들이 에러가 되는 것 같습니다. 그 때 아래를 추가해서 동적페이지로 설정
export const dynamic = 'force-dynamic';

interface PrizeType {
  university: string;
  first_prize: number;
  second_prize: number;
  third_prize: number;
  fourth_prize: number;
}

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const { body: data } = await Fetch<_Response<PrizeType[]>>(
    `/api/admin/statistics?u=${decodeURI(id)}`,
    {
      method: 'GET',
    }
  );
  return (
    <div className="h-full w-full">
      <div className=" p-5 min-w-[200px] grid grid-cols-1 gap-2 overflow-scroll h-full content-start">
        {data?.map((item) => {
          const IS_YONSEI = item.university === '연세대학교';
          const IS_DONE =
            +item.first_prize +
              +item.second_prize +
              +item.third_prize +
              +item.fourth_prize ===
            (IS_YONSEI ? 210 : 310);
          return (
            <div
              key={item.university}
              className="relative flex flex-col justify-between  rounded-md p-3 bg-white text-black"
            >
              <div className="font-extrabold text-lg flex flex-col mb-2">
                {item.university}
                <span className="text-xs -mt-1 text-gray-600">
                  (&nbsp;
                  {+item.first_prize +
                    +item.second_prize +
                    +item.third_prize +
                    +item.fourth_prize}
                  &nbsp; / {IS_YONSEI ? '210' : '310'} )
                </span>
              </div>

              <div className="space-y-1 mt-2">
                <p className="font-semibold text-gray-500">
                  1등(EV9 다이캐스트)
                </p>
                <p className="text-[20px]">{item.first_prize}명</p>
              </div>
              <div className="space-y-1 mt-2">
                <p className="font-semibold text-gray-500">2등(아메리카노)</p>
                <p className="text-[20px]">{item.second_prize}명</p>
              </div>
              {!IS_YONSEI && (
                <div className="space-y-1 mt-2">
                  <p className="font-semibold text-gray-500">3등(아이스티)</p>
                  <p className="text-[20px]">{item.third_prize}명</p>
                </div>
              )}
              <div className="space-y-1 mt-2">
                <p className="font-semibold text-gray-500">
                  4등(노트북 스티커)
                </p>
                <p className="text-[20px]">{item.fourth_prize}명</p>
              </div>

              {IS_DONE && (
                <div className="text-lg font-bold bg-black/80 text-white  absolute inset-0">
                  <p className="justify-center items-center h-full flex">
                    마감!
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Page;
