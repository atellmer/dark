import { componentFiberHelper } from '@core/scope';
import { useState } from '@core/use-state';


function useError(): Error | null {
  const fiber = componentFiberHelper.get();
  const [error, setError] = useState<Error>(null);

  fiber.catchException = (error: Error) => setError(error);;

  return error;
}

export {
  useError,
};
