import { log } from './utils';

export async function waitFor(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function retry<T>(callback: () => T, waitTimeMs: number, retries = 3): Promise<T> {
  try {
    return await callback();
  } catch (error) {
    if (retries === 0) {
      throw error;
    }
    log(`Retrying in ${waitTimeMs}ms`);
    await waitFor(waitTimeMs);
    return await retry(callback, waitTimeMs, retries - 1);
  }
}
