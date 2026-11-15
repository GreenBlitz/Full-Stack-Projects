import axios from "axios";

export const getErrorMessage = (error: unknown): string => {
  return axios.isAxiosError(error)
    ? error.response?.data || error.message
    : error instanceof Error
      ? error.message
      : "Network error.";
};
