export const getRotationDegrees = (
  prizeNumber: number,
  numberOfPrizes: number,
  randomDif = true
): number => {
  const degreesPerPrize = 360 / numberOfPrizes;

  const initialRotation = degreesPerPrize / 2 + 90;

  let randomDifference = (-1 + Math.random() * 2) * degreesPerPrize * 0.3;
  randomDifference =
    Math.abs(randomDifference) > degreesPerPrize / 2
      ? degreesPerPrize / 2
      : randomDifference;

  const perfectRotation =
    degreesPerPrize * (numberOfPrizes - prizeNumber) - initialRotation;

  const imperfectRotation =
    degreesPerPrize * (numberOfPrizes - prizeNumber) -
    initialRotation +
    randomDifference;

  const prizeRotation = randomDif ? imperfectRotation : perfectRotation;

  return numberOfPrizes - prizeNumber > numberOfPrizes / 2
    ? -360 + prizeRotation
    : prizeRotation;
};

export const clamp = (min: number, max: number, val: number): number =>
  Math.min(Math.max(min, +val), max);

export const getQuantity = (prizeMap: number[][]): number =>
  ((prizeMap.slice(-1)[0] || []).slice(-1)[0] || 0) + 1;

const characters =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

export const makeClassKey = (length: number): string => {
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
};
