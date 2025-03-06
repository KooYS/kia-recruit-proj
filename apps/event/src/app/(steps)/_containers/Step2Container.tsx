'use client';
import React from 'react';
import RouletteWheel, { type RouletteData } from '../_components/RouletteWheel';
import { useQueryStates, parseAsString } from 'nuqs';
import {
  Dialog,
  DialogContentWithoutX,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@repo/ui/components/ui/dialog';
const Step2Container = () => {
  const [popupOpen, setPopupOpen] = React.useState(false);
  const [prizes, setPrizes] = React.useState<RouletteData[]>([
    {
      option: '1등',
      description: '모바일교환권(1만원)',
      style: { backgroundColor: 'white', textColor: 'black' },
      weight: 10 / 310,
      limit: 1,
    },
    {
      option: '2등',
      description: '커피',
      style: { backgroundColor: 'white', textColor: 'black' },
      weight: 200 / 310,
      limit: 1,
    },
    {
      option: '3등',
      description: '노트북 스티커',
      style: { backgroundColor: 'white', textColor: 'black' },
      weight: 100 / 310,
      limit: 3,
    },
  ]);

  const [prize, setPrize] = React.useState<RouletteData>();

  const [user, setUser] = useQueryStates(
    {
      university: parseAsString,
      major: parseAsString,
      username: parseAsString,
      phone: parseAsString,
    },
    {
      urlKeys: {
        // And remap them to shorter keys in the URL
        university: 'u',
        major: 'm',
        username: 'n',
        phone: 'p',
      },
    }
  );

  const onFinished = (prize: string) => {
    // alert(`축하합니다! ${prize}에 당첨되셨습니다.`);
    setPrize(prizes.find((p) => p.option === prize));
    setPopupOpen(true);
  };

  return (
    <div className="h-full m-auto">
      <div className="flex flex-col items-center justify-center h-full gap-10">
        <RouletteWheel prizes={prizes} onFinished={onFinished} />
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
                <p>축하합니다!</p>
                <p>
                  <b>{prize?.option}</b>에 당첨되셨습니다.
                </p>
                <p>{prize?.description}을/를 OOO으로 오셔서</p>
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
