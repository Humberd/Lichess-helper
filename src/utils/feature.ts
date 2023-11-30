import { log } from "./utils";

export interface Feature {
  name: string;
  description?: string;
  canExecute: (url: string) => boolean;
  execute: (url: string) => Promise<void> | void;
}

export function createFeature(feature: Feature): Feature {
  return {
    ...feature,
    execute: async (url) => applyExecuteTimeSpent(feature.name, feature.execute, url),
  };
}

const applyExecuteTimeSpent = async (
  name: string,
  callback: (url: string) => Promise<void> | void,
  url: string
) => {
  const start = Date.now();
  await callback(url);
  const end = Date.now();
  log(`Time spent executing ${name}: ${end - start}ms`);
};
