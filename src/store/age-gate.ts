"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface AgeGateState {
  verified: boolean;
  hydrated: boolean;
  verify: () => void;
  reset: () => void;
  setHydrated: (v: boolean) => void;
}

export const useAgeGate = create<AgeGateState>()(
  persist(
    (set) => ({
      verified: false,
      hydrated: false,
      verify: () => set({ verified: true }),
      reset: () => set({ verified: false }),
      setHydrated: (v) => set({ hydrated: v }),
    }),
    {
      name: "qf-age-gate",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);
