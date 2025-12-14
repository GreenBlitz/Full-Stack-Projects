// בס"ד

import { useEffect, useState, type Dispatch } from "react";

const backendURL = "http://localhost:4590/api/v1/";

type HttpMethod = "GET" | "OPTIONS" | "POST" | "PUT" | "PATCH" | "DELETE";

export const fetchData = async (
  endpoint: string,
  method?: HttpMethod,
  body?: object
): Promise<any> =>
  fetch(backendURL + endpoint, {
    method,
    body: JSON.stringify(body),
  }).then(async (response) => response.json());

export const useFetch = <T>(
  ...args: Parameters<typeof fetchData>
): [T | undefined, Dispatch<T>] => {
  const [data, setData] = useState<T>();

  useEffect(() => {
    fetchData(...args)
      .then(setData)
      .catch((error: unknown) => {
        console.log(error);
      });
  }, []);

  return [data, setData];
};
