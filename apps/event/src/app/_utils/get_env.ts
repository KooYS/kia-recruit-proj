export const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';
export const console_dev = (...args: any[]) => {
  if (IS_DEVELOPMENT) console.log(...args);
};
