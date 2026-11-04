"use client";
import { useSyncExternalStore } from "react";

/** true solo en cliente tras hidratar (evita desajustes con datos de localStorage). */
export function useHydrated() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}
