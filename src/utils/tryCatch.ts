type SuccessCallback<T> = {
  res: T;
  error: null;
};

type FailureCallback<E> = {
  res: null;
  error: E;
};

type Result<T, E = Error> = SuccessCallback<T> | FailureCallback<E>;

export async function tryCatch<T, E = Error>(
  promise: Promise<T>
): Promise<Result<T, E>> {
  try {
    const res = await promise;
    return { res, error: null };
  } catch (error) {
    return { res: null, error: error as E };
  }
}
