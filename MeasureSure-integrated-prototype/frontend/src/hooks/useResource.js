import { useCallback, useEffect, useRef, useState } from "react";
// Stable loaders are service functions or useCallback wrappers from pages.
export function useResource(loader) {
  const [state, setState] = useState({ data: null, loading: true, error: "" });
  const sequence = useRef(0);
  const reload = useCallback(async () => {
    const current = ++sequence.current;
    setState((previous) => ({ ...previous, loading: true, error: "" }));
    try {
      const data = await loader();
      if (current === sequence.current)
        setState({ data, loading: false, error: "" });
    } catch (error) {
      if (current === sequence.current)
        setState((previous) => ({
          ...previous,
          loading: false,
          error: error.message,
        }));
    }
  }, [loader]);
  useEffect(() => {
    reload();
    const counter = sequence;
    return () => {
      counter.current += 1;
    };
  }, [reload]);
  return { ...state, reload };
}
