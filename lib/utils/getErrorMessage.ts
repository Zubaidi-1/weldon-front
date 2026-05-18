type ApiError = {
  status?: number;
  message?: string | string[];
  data?: {
    message?: string | string[];
  };
};

export const getErrorMessage = (
  error: unknown,
  fallback = "Something went wrong",
) => {
  if (error instanceof Error) return error.message;

  if (typeof error === "object" && error !== null) {
    const apiError = error as ApiError;
    const message = apiError.message ?? apiError.data?.message;

    if (Array.isArray(message)) return message.join(", ");
    if (message) return message;
  }

  return fallback;
};
