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
}

interface RouletteWheelProps {
  prizes: RouletteData[];
  requiredStep: (prize: string, prizeIndex: number) => Promise<boolean>;
  onFinished: (prize: string) => void;
}
const RouletteWheel: React.FC<RouletteWheelProps> = ({
  prizes,
  onFinished,
  requiredStep,
}) => {
  const [data, setData] = React.useState<RouletteData[]>(prizes);

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
      <div className="roulette_board">
        <Wheel
          disableInitialAnimation
          spinDuration={0.5}
          fontWeight={300}
          textDistance={60}
          radiusLineWidth={1}
          fontSize={30}
          outerBorderWidth={1}
          mustStartSpinning={startSpin}
          prizeNumber={prizeNumber}
          data={data}
          backgroundColors={['#3e3e3e', '#df3428']}
          textColors={['#ffffff']}
          onStopSpinning={() =>
            _onFinished(data[prizeNumber]?.option || 'error')
          }
        />
      </div>
      <Button onClick={handleSpinClick} className="mt-4">
        선물받기
      </Button>
    </div>
  );
};
export default RouletteWheel;
