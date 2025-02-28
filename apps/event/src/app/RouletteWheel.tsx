'use client'
import React from 'react'
import dynamic from 'next/dynamic';
import { Button } from '@repo/ui/components/ui/button';
import { Input } from '@repo/ui/components/ui/input';
const Wheel = dynamic(() => import('react-custom-roulette').then((mod) => mod.Wheel), { ssr: false, });


const data = [
    { option: '0', style: { backgroundColor: 'green', textColor: 'black' } },
    { option: '1', style: { backgroundColor: 'white', textColor: 'black' } },
]

const RouletteWheel = () => {

    const [mustSpin, setMustSpin] = React.useState(false);
    const [prizeNumber, setPrizeNumber] = React.useState(0);

    const handleSpinClick = () => {
        if (!mustSpin) {
            const newPrizeNumber = Math.floor(Math.random() * data.length);
            setPrizeNumber(newPrizeNumber);
            setMustSpin(true);
        }
    }


    const onFinished = (winner: string) => {
        alert(`You won ${winner}`)
    }


    return <div className='w-full h-full'>
        <div className='roulette_container'>
            <div className='roulette_board'>
                <Wheel
                    disableInitialAnimation
                    spinDuration={0.5}
                    fontWeight={300}
                    textDistance={50}
                    radiusLineWidth={1}
                    outerBorderWidth={1}
                    mustStartSpinning={mustSpin}
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
            <Input className='w-[200px]' />
        </div>
    </div>
}
export default RouletteWheel