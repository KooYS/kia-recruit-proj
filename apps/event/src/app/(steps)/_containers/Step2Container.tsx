'use client';
import React, { Suspense } from 'react';
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
import { prizeTitle } from '@/app/_utils/prize';
import Board from '@/app/_components/svg/Board';
import BoardYonsei from '@/app/_components/svg/BoardYonsei';

interface Props {
  university: string;
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
const Step2Container = ({ university, user, receivedPrizeCount }: Props) => {
  const [popupOpen, setPopupOpen] = React.useState(false);

  const IS_YONSEI = university === '연세대학교';
  const [prizes, setPrizes] = React.useState<RouletteData[]>(
    IS_YONSEI
      ? [
          {
            option: '1등',
            optionHide: true,
            description: prizeTitle['1등'],
            style: { backgroundColor: '#B2DAFC', textColor: 'black' },
            weight: 15 / 292,
            limit:
              15 - receivedPrizeCount['1등'] > 0
                ? 15 - receivedPrizeCount['1등']
                : 0,
          },
          {
            option: '2등',
            optionHide: true,
            description: prizeTitle['2등'],
            style: { backgroundColor: '#dbeeff', textColor: 'black' },
            weight: 120 / 292,
            limit:
              120 - receivedPrizeCount['2등'] > 0
                ? 120 - receivedPrizeCount['2등']
                : 0,
          },
          {
            option: '4등',
            optionHide: true,
            description: prizeTitle['4등'],
            style: { backgroundColor: '#89B7E8', textColor: 'black' },
            weight: 157 / 292,
            limit:
              157 - receivedPrizeCount['4등'] > 0
                ? 157 - receivedPrizeCount['4등']
                : 0,
          },
        ]
      : [
          {
            option: '1등',
            optionHide: true,
            description: prizeTitle['1등'],
            style: { backgroundColor: '#B2DAFC', textColor: 'black' },
            weight: 10 / 299,
            limit:
              10 - receivedPrizeCount['1등'] > 0
                ? 10 - receivedPrizeCount['1등']
                : 0,
          },
          {
            option: '3등',
            optionHide: true,
            description: prizeTitle['3등'],
            style: { backgroundColor: '#89B7E8', textColor: 'black' },
            weight: 106 / 299,
            limit:
              106 - receivedPrizeCount['3등'] > 0
                ? 106 - receivedPrizeCount['3등']
                : 0,
          },
          {
            option: '2등',
            optionHide: true,
            description: prizeTitle['2등'],
            style: { backgroundColor: '#B2DAFC', textColor: 'black' },
            weight: 106 / 299,
            limit:
              106 - receivedPrizeCount['2등'] > 0
                ? 106 - receivedPrizeCount['2등']
                : 0,
          },
          {
            option: '4등',
            optionHide: true,
            description: prizeTitle['4등'],
            style: { backgroundColor: '#89B7E8', textColor: 'black' },
            weight: 77 / 299,
            limit:
              77 - receivedPrizeCount['4등'] > 0
                ? 77 - receivedPrizeCount['4등']
                : 0,
          },
        ]
  );

  const isAvail =
    prizes.reduce((acc, prize) => {
      acc = acc + prize.limit;
      return acc;
    }, 0) > 0;

  const [prize, setPrize] = React.useState<RouletteData>();
  const [isGetPrize, setIsGetPrize] = React.useState<boolean>(false);
  const requiredStep = async (prize: string, prizeIndex: number) => {
    const res = await Fetch<
      _Response<{ message: string; pass?: Prize & { user: User } }>
    >('/api/prize', {
      method: 'POST',
      body: JSON.stringify({
        user,
        prizeIndex,
        prizeName: prize,
      }),
    });
    if (res.status === 200) return true;
    else {
      if (res.body.pass) {
        const prizeData = res.body.pass;
        setPrize(prizes.find((p) => p.option === prizeData.prizeName));
        setPopupOpen(true);
        setTimeout(() => {
          document.body.removeAttribute('data-scroll-locked');
          document.body.style['pointerEvents'] = 'auto';
        }, 10);
        return false;
      } else {
        alert(res.body.message);
        return false;
      }
    }
  };

  const onReceived = async (prize: RouletteData) => {
    const res = await Fetch<
      _Response<{ message: string; pass?: Prize & { user: User } }>
    >('/api/prize', {
      method: 'PATCH',
      body: JSON.stringify({
        user,
        prizeName: prize,
      }),
    });

    if (res.status === 200) {
      setIsGetPrize(true);
      return true;
    }
    // else {
    //   if (res.body.pass) {
    //     const prizeData = res.body.pass;
    //     setPrize(prizes.find((p) => p.option === prizeData.prizeName));
    //     setPopupOpen(true);
    //     setTimeout(() => {
    //       document.body.removeAttribute('data-scroll-locked');
    //       document.body.style['pointerEvents'] = 'auto';
    //     }, 10);
    //     return false;
    //   } else {
    //     alert(res.body.message);
    //     return false;
    //   }
    // }
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
              preRender={() => {
                return IS_YONSEI ? (
                  <BoardYonsei className="p-[3px]  w-[80vw] max-w-[445px] h-[80vw] max-h-[445px] object-contain flex-shrink-0 z-[5] pointer-events-none" />
                ) : (
                  <Board className="p-[6px]  w-[80vw] max-w-[445px] h-[80vw] max-h-[445px] object-contain flex-shrink-0 z-[5] pointer-events-none" />
                );
              }}
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
                    <p>카페 럭키드로우 부스에서</p>
                    <p>이 화면을 스태프에게 보여주시면</p>
                    <p>상품(교환권)을 수령하실 수 있습니다.</p>
                  </div>
                </DialogDescription>
              </DialogHeader>
              <div className="flex gap-2">
                <Button
                  className="flex-1"
                  disabled={isGetPrize}
                  onClick={() => {
                    onReceived(prize as RouletteData);
                  }}
                >
                  {isGetPrize ? '수령완료' : '수령확인(스태프전용)'}
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
