import BaseError from './Error';

export default async function errorHandler(
  message: string,
  callback: Function
) {
  try {
    await callback();
  } catch (error) {
    throw new BaseError(message);
  }
}
