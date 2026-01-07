// בס"ד
import { backendBaseUrl } from "../config/frcConfig";

const joinUrl = (path: string): string =>
  `${backendBaseUrl}${path.startsWith("/") ? path : `/${path}`}`;

export const fetchFromProxy = async <T>(targetPath: string): Promise<T> => {
  const fullUrl = joinUrl(targetPath);
  return fetch(fullUrl).then((response) => {
    if (response.ok) {
      return response.json() as Promise<T>;
    }
    throw new Error(`HTTP error status: ${response.status}`);
  });
};
