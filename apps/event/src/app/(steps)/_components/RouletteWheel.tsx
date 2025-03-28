'use client';
import React from 'react';
import { Button } from '@repo/ui/components/ui/button';
import { Wheel } from '../../_components/Roulette/RouletteWheel/index';
import { ImagePropsLocal } from '@/app/_components/Roulette/RouletteWheel/types';

export interface RouletteData {
  option: string;
  description: string;
  style: { backgroundColor: string; textColor: string };
  weight: number;
  limit: number;
  image?: ImagePropsLocal;
  optionHide?: boolean;
}

interface RouletteWheelProps {
  prizes: RouletteData[];
  requiredStep: (prize: string, prizeIndex: number) => Promise<boolean>;
  onFinished: (prize: string) => void;
  preRender?: () => React.ReactNode;
}
const RouletteWheel: React.FC<RouletteWheelProps> = ({
  prizes,
  onFinished,
  requiredStep,
  preRender = () => {
    return <></>;
  },
}) => {
  const [data, setData] = React.useState<RouletteData[]>(prizes);
  const [isCanvasReady, setIsCanvasReady] = React.useState(false);
  const [startSpin, setStartSpin] = React.useState(false);
  const [prizeNumber, setPrizeNumber] = React.useState(0);

  const getWeightedIndex = (_data: RouletteData[]): number => {
    // 암호학적으로 안전한 난수 생성
    const getSecureRandom = (): number => {
      const cryptoObj = window.crypto || (window as any).msCrypto;
      if (cryptoObj && cryptoObj.getRandomValues) {
        const array = new Uint32Array(1);
        cryptoObj.getRandomValues(array);
        return (array[0] || 0) / (0xffffffff + 1);
      }
      // 폴백: 암호학적으로 안전하지 않지만, 마지막 수단으로 Math.random() 사용
      console.warn('Crypto API not available, falling back to Math.random()');
      return Math.random();
    };

    const weights = _data.map((el) => {
      if (el.limit === 0) return 0;
      return el.weight;
    });
    const total = weights.reduce((a, b) => a + b, 0);
    const random = getSecureRandom() * total;
    let cumulative = 0;

    if (weights.every((weight) => weight === 0)) return -1;
    return weights.findIndex((weight, index) => {
      cumulative += weight;
      return random <= cumulative;
    });
  };

  const handleSpinClick = async () => {
    if (!startSpin) {
      const newPrizeNumber = getWeightedIndex(data);
      if (newPrizeNumber === -1) {
        alert('모든 상품이 소진되었습니다.');
        return;
      }
      if (
        requiredStep &&
        (await requiredStep(data[newPrizeNumber]?.option || '', newPrizeNumber))
      ) {
        setPrizeNumber(newPrizeNumber);
        setStartSpin(true);
        return;
      }
    }
  };

  const _onFinished = (prize: string) => {
    if (onFinished) onFinished(prize);

    const newRemainingPrizes = [...data];
    if (newRemainingPrizes[prizeNumber]) {
      console.log(newRemainingPrizes[prizeNumber]);
      newRemainingPrizes[prizeNumber].limit -= 1;
    }
    setData(newRemainingPrizes);
    setStartSpin(false);
  };

  return (
    <div className="roulette_container">
      <div className="relative roulette_board rounded-full p-3 bg-white border-[#82898F] border-8">
        {!isCanvasReady && preRender()}
        <div
          style={{
            opacity: isCanvasReady ? 1 : 0,
            position: isCanvasReady ? 'relative' : 'absolute',
            // transition: 'opacity 0.3s ease-in-out',
          }}
        >
          <Wheel
            onRendered={() => setIsCanvasReady(true)}
            disableInitialAnimation
            spinDuration={0.5}
            fontWeight={300}
            textDistance={60}
            radiusLineWidth={0}
            fontSize={30}
            outerBorderWidth={4}
            outerBorderColor="#89B7E8"
            mustStartSpinning={startSpin}
            prizeNumber={prizeNumber}
            data={data}
            onStopSpinning={() =>
              _onFinished(data[prizeNumber]?.option || 'error')
            }
          />
          <Button
            onClick={handleSpinClick}
            className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 z-10 rounded-full border-8 border-[#6A9DDE] w-[70px] h-[70px] md:w-[90px] md:h-[90px] font-bold"
          >
            START
          </Button>
        </div>
      </div>
    </div>
  );
};
export default RouletteWheel;
