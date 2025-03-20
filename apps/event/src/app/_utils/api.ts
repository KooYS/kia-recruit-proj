import { console_dev } from './get_env';

export const Fetch = async <T>(
  url: string,
  options?: RequestInit
): Promise<T> => {
  const URL = process.env.NEXT_PUBLIC_API_URL;
  const requestUrl = `${URL}${url}`;
  const res = await fetch(requestUrl, options);

  console_dev(requestUrl, res);

  if (!res.ok) {
    throw new Error(res.statusText);
  }
  return res.json() as Promise<T>;
};

export type _Response<T> = {
  status: number;
  success: boolean;
  body: T;
};
