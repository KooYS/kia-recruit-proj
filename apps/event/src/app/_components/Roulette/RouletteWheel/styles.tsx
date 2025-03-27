import { cn } from '@repo/ui/lib/utils';
import React, { CSSProperties, FC, PropsWithChildren } from 'react';

interface RouletteContainerProps extends PropsWithChildren {
  style: CSSProperties;
}

export const RouletteContainer: FC<RouletteContainerProps> = ({
  children,
  style,
}) => (
  <div
    style={style}
    className="relative w-[80vw] max-w-[445px] h-[80vw] max-h-[445px] object-contain flex-shrink-0 z-[5] pointer-events-none"
  >
    {children}
  </div>
);

interface RotationContainerProps extends PropsWithChildren {
  startRotationDegrees: number;
  classKey: string | number;
  startSpinningTime: number;
  disableInitialAnimation?: boolean;
  continueSpinningTime: number;
  stopSpinningTime: number;
  finalRotationDegrees: number;
  className?: string;
}

interface CustomCSSProperties extends CSSProperties {
  [key: `--${string}`]: string | number;
}

export const RotationContainer: FC<RotationContainerProps> = ({
  className,
  children,
  startRotationDegrees,
  classKey,
  startSpinningTime,
  disableInitialAnimation = false,
  continueSpinningTime,
  stopSpinningTime,
  finalRotationDegrees,
}) => {
  const dynamicStyle: CustomCSSProperties = {
    transform: `rotate(${startRotationDegrees}deg)`,
    '--start-spin-time': `${startSpinningTime / 1000}s`,
    '--continue-spin-time': `${continueSpinningTime / 1000}s`,
    '--stop-spin-time': `${stopSpinningTime / 1000}s`,
    '--total-spin-time': `${(startSpinningTime + continueSpinningTime) / 1000}s`,
    '--start-rotation': `${startRotationDegrees}deg`,
    '--final-rotation': `${1440 + finalRotationDegrees}deg`,
  };

  return (
    <div
      className={cn(
        'absolute w-full inset-0 flex justify-center items-center',
        className
      )}
      style={dynamicStyle}
      data-classkey={classKey}
      data-disable-animation={disableInitialAnimation}
    >
      {children}
    </div>
  );
};

interface RoulettePointerImageProps {
  src?: string;
  alt?: string;
  style?: CSSProperties;
}

export const RoulettePointerImage: FC<RoulettePointerImageProps> = () => (
  <svg
    viewBox="0 0 293 478"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="absolute left-1/2 -translate-x-1/2 -top-8 z-[5] w-[10%] select-none pointer-events-none"
  >
    <path d="M0.569946 0L146.53 477.02V118.78L0.569946 0Z" fill="#F76666" />
    <path d="M146.53 118.78V477.02L292.48 0L146.53 118.78Z" fill="#F44A4A" />
  </svg>
);
