// בס"ד
import { backendBaseUrl } from "../config/frcConfig";

const joinUrl = (path: string): string =>
  `${backendBaseUrl}${path.startsWith("/") ? path : `/${path}`}`;

export const fetchFromProxy = async <T>(targetPath: string): Promise<T> => {
  const fullUrl = joinUrl(targetPath);
  const response = await fetch(fullUrl);
  if (response.ok) {
    return (await response.json()) as T;
  }
  throw new Error(`HTTP error status: ${response.status}`);
};
