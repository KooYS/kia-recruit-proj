'use client'
import React from 'react'
import { Button } from '@repo/ui/components/ui/button';
import { Wheel } from './_components/Roulette/RouletteWheel/index';

const data = [
    { option: '0', style: { backgroundColor: 'white', textColor: 'black' }, weight: 5 },
    { option: '1', style: { backgroundColor: 'white', textColor: 'black' }, weight: 5 },
    { option: '2', style: { backgroundColor: 'white', textColor: 'black' }, weight: 90 },
    { option: '3', style: { backgroundColor: 'white', textColor: 'black' }, weight: 5 },
    { option: '4', style: { backgroundColor: 'white', textColor: 'black' }, weight: 5 },
    { option: '5', style: { backgroundColor: 'white', textColor: 'black' }, weight: 5 },
]

const RouletteWheel = () => {

    const [startSpin, setStartSpin] = React.useState(false);
    const [prizeNumber, setPrizeNumber] = React.useState(0);

    const getWeightedIndex = (weights: number[]): number => {
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

        const total = weights.reduce((a, b) => a + b, 0);
        const random = getSecureRandom() * total;
        let cumulative = 0;

        return weights.findIndex((weight) => {
            cumulative += weight;
            return random <= cumulative;
        });
    };


    const handleSpinClick = () => {
        if (!startSpin) {
            const newPrizeNumber = getWeightedIndex(data.map((el) => el.weight));
            setPrizeNumber(newPrizeNumber);
            setStartSpin(true);
        }
    }


    const onFinished = (winner: string) => {
        alert(`You won ${winner}`)
        setStartSpin(false)
    }


    return <div className='w-full h-full'>
        <div className='roulette_container'>
            <div className='roulette_board'>
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
                    onStopSpinning={() => onFinished(data[prizeNumber]?.option || 'error')}
                />
            </div>
            <Button onClick={handleSpinClick} className='mt-4'>
                Spin
            </Button>
        </div>
    </div>
}
export default RouletteWheel