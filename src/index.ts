import { produce, Draft, freeze } from "immer";
import { useCallback, useMemo, useRef, useState } from "react";

export type DraftFunction<S> = (draft: Draft<S>) => void;
export type Updater<S> = (arg: S | DraftFunction<S>) => void;
export type ImmerHook<S> = [
  S,
  {
    setState: Updater<S>;
    getLatest: () => S;
  }
];

export function useLatestImmer<S = any>(
  initialValue: S | (() => S)
): ImmerHook<S>;

export function useLatestImmer(initialValue: any) {
  const [_, setUpdate] = useState({});
  const stateRef = useRef(
    useMemo(
      () =>
        freeze(
          typeof initialValue === "function" ? initialValue() : initialValue,
          true
        ),
      []
    )
  );
  return [
    stateRef.current,
    {
      getLatest: useCallback(() => stateRef.current, []),
      setState: useCallback((updater: any) => {
        if (typeof updater === "function")
          stateRef.current = produce(stateRef.current, updater);
        else stateRef.current = freeze(updater);
        setUpdate({});
      }, []),
    },
  ];
}
