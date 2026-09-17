import { flushSync } from "react-dom";
import { useSearchParams } from "react-router-dom";

// Commit each filter change before another control can read the URL state.
export function useQueryFilters() {
  const [params, setParams] = useSearchParams();
  const update = (key, value) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    flushSync(() => setParams(next, { replace: true }));
  };
  const clear = () => flushSync(() => setParams({}, { replace: true }));
  return { params, update, clear };
}
