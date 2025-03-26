import React, { createRef, RefObject, useEffect } from 'react';
import { WheelCanvasStyle } from './styles';
import { WheelData } from '../RouletteWheel/types';
import { clamp, getQuantity } from '../../../_utils/roulette_wheel';

interface WheelCanvasProps extends DrawWheelProps {
  width: string;
  height: string;
  data: WheelData[];
}

interface DrawWheelProps {
  outerBorderColor: string;
  outerBorderWidth: number;
  innerRadius: number;
  innerBorderColor: string;
  innerBorderWidth: number;
  radiusLineColor: string;
  radiusLineWidth: number;
  fontWeight: number | string;
  fontSize: number;
  fontStyle: string;
  perpendicularText: boolean;
  prizeMap: number[][];
  rouletteUpdater: boolean;
  textDistance: number;
}

const drawRadialBorder = (
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  insideRadius: number,
  outsideRadius: number,
  angle: number
) => {
  ctx.beginPath();
  ctx.moveTo(
    centerX + (insideRadius + 1) * Math.cos(angle),
    centerY + (insideRadius + 1) * Math.sin(angle)
  );
  ctx.lineTo(
    centerX + (outsideRadius - 1) * Math.cos(angle),
    centerY + (outsideRadius - 1) * Math.sin(angle)
  );
  ctx.closePath();
  ctx.stroke();
};

const drawWheel = (
  canvasRef: RefObject<HTMLCanvasElement | null>,
  data: WheelData[],
  drawWheelProps: DrawWheelProps
) => {
  console.log(data);
  /* eslint-disable prefer-const */
  let {
    outerBorderColor,
    outerBorderWidth,
    innerRadius,
    innerBorderColor,
    innerBorderWidth,
    radiusLineColor,
    radiusLineWidth,
    fontWeight,
    fontSize,
    fontStyle,
    perpendicularText,
    prizeMap,
    textDistance,
  } = drawWheelProps;

  const QUANTITY = getQuantity(prizeMap);

  outerBorderWidth *= 2;
  innerBorderWidth *= 2;
  radiusLineWidth *= 2;

  const canvas = canvasRef.current;
  if (canvas?.getContext('2d')) {
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    ctx.clearRect(0, 0, 500, 500);
    ctx.strokeStyle = 'transparent';
    ctx.lineWidth = 0;

    // if (backgroundImage) {
    // const img = new Image();
    // img.src = './board.png';
    // img.onload = () => {
    //   ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    //   // drawWheelContent(canvas, ctx, data, drawWheelProps);
    //   let startAngle = 0;
    //   const outsideRadius = canvas.width / 2 - 10;

    //   const clampedContentDistance = clamp(0, 100, textDistance);
    //   const contentRadius = (outsideRadius * clampedContentDistance) / 100;

    //   const clampedInsideRadius = clamp(0, 100, innerRadius);
    //   const insideRadius = (outsideRadius * clampedInsideRadius) / 100;

    //   const centerX = canvas.width / 2;
    //   const centerY = canvas.height / 2;

    //   for (let i = 0; i < data.length; i++) {
    //     const { optionSize, style } = data[i] || {};

    //     const arc =
    //       (optionSize && (optionSize * (2 * Math.PI)) / QUANTITY) ||
    //       (2 * Math.PI) / QUANTITY;
    //     const endAngle = startAngle + arc;

    //     ctx.fillStyle = (style && style.backgroundColor) as string;

    //     ctx.beginPath();
    //     ctx.arc(centerX, centerY, outsideRadius, startAngle, endAngle, false);
    //     ctx.arc(centerX, centerY, insideRadius, endAngle, startAngle, true);
    //     ctx.stroke();
    //     // ctx.fill();
    //     ctx.save();

    //     // WHEEL RADIUS LINES
    //     ctx.strokeStyle =
    //       radiusLineWidth <= 0 ? 'transparent' : radiusLineColor;
    //     ctx.lineWidth = radiusLineWidth;
    //     drawRadialBorder(
    //       ctx,
    //       centerX,
    //       centerY,
    //       insideRadius,
    //       outsideRadius,
    //       startAngle
    //     );
    //     if (i === data.length - 1) {
    //       drawRadialBorder(
    //         ctx,
    //         centerX,
    //         centerY,
    //         insideRadius,
    //         outsideRadius,
    //         endAngle
    //       );
    //     }

    //     // WHEEL OUTER BORDER
    //     ctx.strokeStyle =
    //       outerBorderWidth <= 0 ? 'transparent' : outerBorderColor;
    //     ctx.lineWidth = outerBorderWidth;
    //     ctx.beginPath();
    //     ctx.arc(
    //       centerX,
    //       centerY,
    //       outsideRadius - ctx.lineWidth / 2,
    //       0,
    //       2 * Math.PI
    //     );
    //     ctx.closePath();
    //     ctx.stroke();

    //     // WHEEL INNER BORDER
    //     ctx.strokeStyle =
    //       innerBorderWidth <= 0 ? 'transparent' : innerBorderColor;
    //     ctx.lineWidth = innerBorderWidth;
    //     ctx.beginPath();
    //     ctx.arc(
    //       centerX,
    //       centerY,
    //       insideRadius + ctx.lineWidth / 2 - 1,
    //       0,
    //       2 * Math.PI
    //     );
    //     ctx.closePath();
    //     ctx.stroke();

    //     // CONTENT FILL
    //     ctx.translate(
    //       centerX + Math.cos(startAngle + arc / 2) * contentRadius,
    //       centerY + Math.sin(startAngle + arc / 2) * contentRadius
    //     );
    //     let contentRotationAngle = startAngle + arc / 2;

    //     if (data[i]?.image) {
    //       // CASE IMAGE
    //       contentRotationAngle +=
    //         data[i]?.image && !data[i]?.image?.landscape ? Math.PI / 2 : 0;
    //       ctx.rotate(contentRotationAngle);

    //       const img = data[i]?.image?._imageHTML || new Image();
    //       ctx.drawImage(
    //         img,
    //         (img.width + (data[i]?.image?.offsetX || 0)) / -2,
    //         -(
    //           img.height -
    //           (data[i]?.image?.landscape ? 0 : 90) + // offsetY correction for non landscape images
    //           (data[i]?.image?.offsetY || 0)
    //         ) / 2,
    //         img.width,
    //         img.height
    //       );
    //     } else {
    //       // CASE TEXT
    //       contentRotationAngle += perpendicularText ? Math.PI / 2 : 0;
    //       ctx.rotate(contentRotationAngle);

    //       const text = data[i]?.option;
    //       ctx.font = `${style?.fontStyle || fontStyle} ${
    //         style?.fontWeight || fontWeight
    //       } ${(style?.fontSize || fontSize) * 2}px ${style?.fontFamily || 'Arial,sans-serif'}`;
    //       ctx.fillStyle = (style && style.textColor) as string;
    //       ctx.fillText(
    //         text || '',
    //         -ctx.measureText(text || '').width / 2,
    //         fontSize / 2.7
    //       );

    //       const textPrize = data[i]?.description;
    //       ctx.font = `${style?.fontStyle || fontStyle} ${'bold'} ${style?.fontSize || fontSize}px ${style?.fontFamily || 'Arial,sans-serif'}`;
    //       ctx.fillStyle = (style && style.textColor) as string;
    //       ctx.fillText(
    //         textPrize || '',
    //         -ctx.measureText(textPrize || '').width / 2,
    //         fontSize * 2
    //       );
    //     }

    //     ctx.restore();

    //     startAngle = endAngle;
    //   }
    // };
    // }

    let startAngle = 0;
    const outsideRadius = canvas.width / 2 - 10;

    const clampedContentDistance = clamp(0, 100, textDistance);
    const contentRadius = (outsideRadius * clampedContentDistance) / 100;

    const clampedInsideRadius = clamp(0, 100, innerRadius);
    const insideRadius = (outsideRadius * clampedInsideRadius) / 100;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    for (let i = 0; i < data.length; i++) {
      const { optionSize, style } = data[i] || {};

      const arc =
        (optionSize && (optionSize * (2 * Math.PI)) / QUANTITY) ||
        (2 * Math.PI) / QUANTITY;
      const endAngle = startAngle + arc;

      ctx.fillStyle = (style && style.backgroundColor) as string;

      ctx.beginPath();
      ctx.arc(centerX, centerY, outsideRadius, startAngle, endAngle, false);
      ctx.arc(centerX, centerY, insideRadius, endAngle, startAngle, true);
      ctx.stroke();
      ctx.fill();
      ctx.save();

      // WHEEL RADIUS LINES
      ctx.strokeStyle = radiusLineWidth <= 0 ? 'transparent' : radiusLineColor;
      ctx.lineWidth = radiusLineWidth;
      drawRadialBorder(
        ctx,
        centerX,
        centerY,
        insideRadius,
        outsideRadius,
        startAngle
      );
      if (i === data.length - 1) {
        drawRadialBorder(
          ctx,
          centerX,
          centerY,
          insideRadius,
          outsideRadius,
          endAngle
        );
      }

      // WHEEL OUTER BORDER
      ctx.strokeStyle =
        outerBorderWidth <= 0 ? 'transparent' : outerBorderColor;
      ctx.lineWidth = outerBorderWidth;
      ctx.beginPath();
      ctx.arc(
        centerX,
        centerY,
        outsideRadius - ctx.lineWidth / 2,
        0,
        2 * Math.PI
      );
      ctx.closePath();
      ctx.stroke();

      // WHEEL INNER BORDER
      ctx.strokeStyle =
        innerBorderWidth <= 0 ? 'transparent' : innerBorderColor;
      ctx.lineWidth = innerBorderWidth;
      ctx.beginPath();
      ctx.arc(
        centerX,
        centerY,
        insideRadius + ctx.lineWidth / 2 - 1,
        0,
        2 * Math.PI
      );
      ctx.closePath();
      ctx.stroke();

      // CONTENT FILL
      ctx.translate(
        centerX + Math.cos(startAngle + arc / 2) * contentRadius,
        centerY + Math.sin(startAngle + arc / 2) * contentRadius
      );
      let contentRotationAngle = startAngle + arc / 2;

      if (data[i]?.image) {
        // CASE IMAGE
        contentRotationAngle +=
          data[i]?.image && !data[i]?.image?.landscape ? Math.PI / 2 : 0;
        ctx.rotate(contentRotationAngle);

        const img = data[i]?.image?._imageHTML || new Image();
        ctx.drawImage(
          img,
          (img.width + (data[i]?.image?.offsetX || 0)) / -2,
          -(
            img.height -
            (data[i]?.image?.landscape ? 0 : 90) + // offsetY correction for non landscape images
            (data[i]?.image?.offsetY || 0)
          ) / 2,
          img.width,
          img.height
        );
      } else {
        // CASE TEXT
        contentRotationAngle += perpendicularText ? Math.PI / 2 : 0;
        ctx.rotate(contentRotationAngle);

        if (
          data[i]?.optionHide === false ||
          data[i]?.optionHide === undefined
        ) {
          const text = data[i]?.option;
          ctx.font = `${style?.fontStyle || fontStyle} ${
            style?.fontWeight || fontWeight
          } ${(style?.fontSize || fontSize) * 2}px ${style?.fontFamily || 'Arial,sans-serif'}`;
          ctx.fillStyle = (style && style.textColor) as string;
          ctx.fillText(
            text || '',
            -ctx.measureText(text || '').width / 2,
            fontSize / 2.7
          );
        }
        const textPrize = data[i]?.description;
        ctx.font = `${style?.fontStyle || fontStyle} ${'bold'} ${(style?.fontSize || fontSize) * 1.5}px ${style?.fontFamily || 'Arial,sans-serif'}`;
        ctx.fillStyle = (style && style.textColor) as string;

        const splitData = textPrize?.split('\n');
        splitData?.forEach((line, index) => {
          const size = fontSize * 2;
          ctx.fillText(
            line,
            -ctx.measureText(line || '').width / 2,
            index * size - (splitData?.length > 1 ? size / 1.5 : 0)
          );
        });
      }

      ctx.restore();

      startAngle = endAngle;
    }
  }
};

const drawWheelContent = (
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  data: WheelData[],
  drawWheelProps: DrawWheelProps
) => {
  let {
    outerBorderColor,
    outerBorderWidth,
    innerRadius,
    innerBorderColor,
    innerBorderWidth,
    radiusLineColor,
    radiusLineWidth,
    fontWeight,
    fontSize,
    fontStyle,
    perpendicularText,
    prizeMap,
    textDistance,
  } = drawWheelProps;

  const QUANTITY = getQuantity(prizeMap);

  let startAngle = 0;
  const outsideRadius = canvas.width / 2 - 10;

  const clampedContentDistance = clamp(0, 100, textDistance);
  const contentRadius = (outsideRadius * clampedContentDistance) / 100;

  const clampedInsideRadius = clamp(0, 100, innerRadius);
  const insideRadius = (outsideRadius * clampedInsideRadius) / 100;

  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

  for (let i = 0; i < data.length; i++) {
    const { optionSize, style } = data[i] || {};

    const arc =
      (optionSize && (optionSize * (2 * Math.PI)) / QUANTITY) ||
      (2 * Math.PI) / QUANTITY;
    const endAngle = startAngle + arc;

    ctx.fillStyle = (style && style.backgroundColor) as string;

    ctx.beginPath();
    ctx.arc(centerX, centerY, outsideRadius, startAngle, endAngle, false);
    ctx.arc(centerX, centerY, insideRadius, endAngle, startAngle, true);
    ctx.stroke();
    ctx.fill();
    ctx.save();

    // WHEEL RADIUS LINES
    ctx.strokeStyle = radiusLineWidth <= 0 ? 'transparent' : radiusLineColor;
    ctx.lineWidth = radiusLineWidth;
    drawRadialBorder(
      ctx,
      centerX,
      centerY,
      insideRadius,
      outsideRadius,
      startAngle
    );
    if (i === data.length - 1) {
      drawRadialBorder(
        ctx,
        centerX,
        centerY,
        insideRadius,
        outsideRadius,
        endAngle
      );
    }

    // WHEEL OUTER BORDER
    ctx.strokeStyle = outerBorderWidth <= 0 ? 'transparent' : outerBorderColor;
    ctx.lineWidth = outerBorderWidth;
    ctx.beginPath();
    ctx.arc(
      centerX,
      centerY,
      outsideRadius - ctx.lineWidth / 2,
      0,
      2 * Math.PI
    );
    ctx.closePath();
    ctx.stroke();

    // WHEEL INNER BORDER
    ctx.strokeStyle = innerBorderWidth <= 0 ? 'transparent' : innerBorderColor;
    ctx.lineWidth = innerBorderWidth;
    ctx.beginPath();
    ctx.arc(
      centerX,
      centerY,
      insideRadius + ctx.lineWidth / 2 - 1,
      0,
      2 * Math.PI
    );
    ctx.closePath();
    ctx.stroke();

    // CONTENT FILL
    ctx.translate(
      centerX + Math.cos(startAngle + arc / 2) * contentRadius,
      centerY + Math.sin(startAngle + arc / 2) * contentRadius
    );
    let contentRotationAngle = startAngle + arc / 2;

    if (data[i]?.image) {
      // CASE IMAGE
      contentRotationAngle +=
        data[i]?.image && !data[i]?.image?.landscape ? Math.PI / 2 : 0;
      ctx.rotate(contentRotationAngle);

      const img = data[i]?.image?._imageHTML || new Image();
      ctx.drawImage(
        img,
        (img.width + (data[i]?.image?.offsetX || 0)) / -2,
        -(
          img.height -
          (data[i]?.image?.landscape ? 0 : 90) + // offsetY correction for non landscape images
          (data[i]?.image?.offsetY || 0)
        ) / 2,
        img.width,
        img.height
      );
    } else {
      // CASE TEXT
      contentRotationAngle += perpendicularText ? Math.PI / 2 : 0;
      ctx.rotate(contentRotationAngle);

      const text = data[i]?.option;
      ctx.font = `${style?.fontStyle || fontStyle} ${
        style?.fontWeight || fontWeight
      } ${(style?.fontSize || fontSize) * 2}px ${style?.fontFamily || 'Arial,sans-serif'}`;
      ctx.fillStyle = (style && style.textColor) as string;
      ctx.fillText(
        text || '',
        -ctx.measureText(text || '').width / 2,
        fontSize / 2.7
      );

      const textPrize = data[i]?.description;
      ctx.font = `${style?.fontStyle || fontStyle} ${'bold'} ${style?.fontSize || fontSize}px ${style?.fontFamily || 'Arial,sans-serif'}`;
      ctx.fillStyle = (style && style.textColor) as string;
      ctx.fillText(
        textPrize || '',
        -ctx.measureText(textPrize || '').width / 2,
        fontSize * 2
      );
    }

    ctx.restore();

    startAngle = endAngle;
  }
};

const WheelCanvas = ({
  width,
  height,
  data,
  outerBorderColor,
  outerBorderWidth,
  innerRadius,
  innerBorderColor,
  innerBorderWidth,
  radiusLineColor,
  radiusLineWidth,
  fontWeight,
  fontSize,
  fontStyle,
  perpendicularText,
  prizeMap,
  rouletteUpdater,
  textDistance,
}: WheelCanvasProps): React.JSX.Element => {
  const canvasRef = createRef<HTMLCanvasElement>();
  const drawWheelProps = {
    outerBorderColor,
    outerBorderWidth,
    innerRadius,
    innerBorderColor,
    innerBorderWidth,
    radiusLineColor,
    radiusLineWidth,
    fontWeight,
    fontSize,
    fontStyle,
    perpendicularText,
    prizeMap,
    rouletteUpdater,
    textDistance,
  };

  useEffect(() => {
    drawWheel(canvasRef, data, drawWheelProps);
  }, [canvasRef, data, drawWheelProps, rouletteUpdater]);

  return (
    <canvas
      style={WheelCanvasStyle}
      ref={canvasRef}
      width={width}
      height={height}
    />
  );
};

export default WheelCanvas;
