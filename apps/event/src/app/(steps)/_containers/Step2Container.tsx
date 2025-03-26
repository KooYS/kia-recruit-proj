'use client';
import React from 'react';
import RouletteWheel, { type RouletteData } from '../_components/RouletteWheel';
import {
  Dialog,
  DialogContentWithoutX,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@repo/ui/components/ui/dialog';
import { Prize, User } from '@repo/db';
import Image from 'next/image';
import { _Response, Fetch } from '@/app/_utils/api';
import { Button } from '@repo/ui/components/ui/button';

interface Props {
  user?: User & {
    prize: Prize | null;
  };
  receivedPrizeCount: {
    '1등': number;
    '2등': number;
    '3등': number;
    '4등': number;
  };
}
const Step2Container = ({ user, receivedPrizeCount }: Props) => {
  const [popupOpen, setPopupOpen] = React.useState(false);
  const [prizes, setPrizes] = React.useState<RouletteData[]>([
    {
      option: '1등',
      optionHide: true,
      description: '구글\n기프트카드\n1만원권',
      style: { backgroundColor: '#B2DAFC', textColor: 'black' },
      weight: 10 / 310,
      limit:
        10 - receivedPrizeCount['1등'] > 0 ? 10 - receivedPrizeCount['1등'] : 0,
    },
    {
      option: '3등',
      optionHide: true,
      description: '아이스티',
      style: { backgroundColor: '#89B7E8', textColor: 'black' },
      weight: 100 / 310,
      limit:
        100 - receivedPrizeCount['3등'] > 0
          ? 100 - receivedPrizeCount['3등']
          : 0,
    },
    {
      option: '2등',
      optionHide: true,
      description: '커피',
      style: { backgroundColor: '#B2DAFC', textColor: 'black' },
      weight: 100 / 310,
      limit:
        100 - receivedPrizeCount['2등'] > 0
          ? 100 - receivedPrizeCount['2등']
          : 0,
    },
    {
      option: '4등',
      optionHide: true,
      description: '스티커팩',
      style: { backgroundColor: '#89B7E8', textColor: 'black' },
      weight: 100 / 310,
      limit:
        100 - receivedPrizeCount['4등'] > 0
          ? 100 - receivedPrizeCount['4등']
          : 0,
    },
  ]);

  const isAvail =
    prizes.reduce((acc, prize) => {
      acc = acc + prize.limit;
      return acc;
    }, 0) > 0;

  const [prize, setPrize] = React.useState<RouletteData>();
  const requiredStep = async (prize: string, prizeIndex: number) => {
    const res = await Fetch<_Response<{ message: string }>>('/api/prize', {
      method: 'POST',
      body: JSON.stringify({
        user,
        prizeIndex,
        prizeName: prize,
      }),
    });
    if (res.status === 200) return true;
    else {
      alert(res.body.message);
      return false;
    }
  };
  const onFinished = (prize: string) => {
    setPrize(prizes.find((p) => p.option === prize));
    setPopupOpen(true);
    setTimeout(() => {
      document.body.removeAttribute('data-scroll-locked');
      document.body.style['pointerEvents'] = 'auto';
    }, 10);
  };

  return (
    <div className="h-full">
      {isAvail ? (
        <>
          <div className="flex flex-col items-center justify-center h-full my-10">
            <RouletteWheel
              prizes={prizes}
              requiredStep={requiredStep}
              onFinished={onFinished}
            />
          </div>
          <Dialog open={popupOpen} onOpenChange={setPopupOpen}>
            <DialogContentWithoutX
              onInteractOutside={(e) => {
                e.preventDefault();
              }}
            >
              <DialogHeader className="!text-center">
                <DialogTitle className="text-black">축하합니다!</DialogTitle>
                <DialogDescription asChild>
                  <div>
                    <p>축하합니다! {user?.username}님</p>
                    <p>{prize?.description}</p>
                    <p>
                      <Image
                        src={`/prize/${prize?.option}.png`}
                        width={256}
                        height={256}
                        alt={prize?.option || ''}
                        className="m-auto"
                      />
                    </p>
                    <p>이벤트 부스로 오셔서 해당 화면을 보여주시고</p>
                    <p>상품을 수령해 주세요.</p>
                  </div>
                </DialogDescription>
              </DialogHeader>
              <div className="flex gap-2">
                <Button
                  className="flex-1"
                  onClick={() => {
                    setPopupOpen(false);
                  }}
                >
                  수령하기
                </Button>
              </div>
            </DialogContentWithoutX>
          </Dialog>
        </>
      ) : (
        <div className="w-full text-center h-full flex flex-col justify-center items-center my-10">
          <div className="py-5 px-8 bg-white text-black rounded-md h-fit font-semibold">
            상품이 모두 소진되었습니다.
          </div>
        </div>
      )}
    </div>
  );
};

export default Step2Container;
