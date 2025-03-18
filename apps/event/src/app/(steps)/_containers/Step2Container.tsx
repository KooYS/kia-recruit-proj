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
import { console_dev } from '@/app/_utils/get_env';
import { _Response, Fetch } from '@/app/_utils/api';

interface Props {
  user?: User & {
    prize: Prize | null;
  };
  receivedPrizeCount: { '1등': number; '2등': number; '3등': number };
}
const Step2Container = ({ user, receivedPrizeCount }: Props) => {
  const [popupOpen, setPopupOpen] = React.useState(false);
  const [prizes, setPrizes] = React.useState<RouletteData[]>([
    {
      option: '1등',
      description: '모바일교환권(1만원)',
      style: { backgroundColor: 'white', textColor: 'black' },
      weight: 10 / 310,
      limit:
        10 - receivedPrizeCount['1등'] > 0 ? 10 - receivedPrizeCount['1등'] : 0,
    },
    {
      option: '2등',
      description: '커피',
      style: { backgroundColor: 'white', textColor: 'black' },
      weight: 200 / 310,
      limit:
        200 - receivedPrizeCount['2등'] > 0
          ? 200 - receivedPrizeCount['2등']
          : 0,
    },
    {
      option: '3등',
      description: '노트북 스티커',
      style: { backgroundColor: 'white', textColor: 'black' },
      weight: 100 / 310,
      limit:
        100 - receivedPrizeCount['3등'] > 0
          ? 100 - receivedPrizeCount['3등']
          : 0,
    },
  ]);

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
  };

  return (
    <div className="h-full m-auto">
      <div className="flex flex-col items-center justify-center h-full gap-10">
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
          <DialogHeader>
            <DialogTitle>안내</DialogTitle>
            <DialogDescription asChild>
              <div>
                <p>축하합니다! {user?.username}님</p>
                <p>
                  <b>{prize?.option}</b>에 당첨되셨습니다.
                </p>
                <p>{prize?.description}을/를 이벤트 부스로 오셔서</p>
                <p>해당 화면을 보여주시고 수령해 주세요.</p>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContentWithoutX>
      </Dialog>
    </div>
  );
};

export default Step2Container;
