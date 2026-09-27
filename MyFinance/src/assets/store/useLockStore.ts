import { create } from "zustand"
import { persist } from "zustand/middleware"

function hashPin(pin: string): string {
  let h = 0x811c9dc5
  for (let i = 0; i < pin.length; i++) {
    h ^= pin.charCodeAt(i)
    h = (h * 0x01000193) >>> 0
  }
  return h.toString(16)
}

interface LockState {
  lockEnabled: boolean
  pinHash: string | null
  isLocked: boolean

  setLockEnabled: (v: boolean) => void
  setPin: (pin: string) => void
  removePin: () => void
  verifyPin: (pin: string) => boolean
  lock: () => void
  unlock: () => void
}

export const useLockStore = create<LockState>()(
  persist(
    (set, get) => ({
      lockEnabled: false,
      pinHash: null,
      isLocked: false,

      setLockEnabled: (v) => set({ lockEnabled: v }),

      setPin: (pin) => set({ pinHash: hashPin(pin) }),
      removePin: () => set({ pinHash: null, lockEnabled: false, isLocked: false }),

      verifyPin: (pin) => {
        const { pinHash } = get()
        return pinHash !== null && hashPin(pin) === pinHash
      },

      lock: () => set({ isLocked: true }),
      unlock: () => set({ isLocked: false }),
    }),
    {
      name: "finance-lock",
      // isLocked is persisted so closing the tab/browser keeps the lock
      partialize: (s) => ({
        lockEnabled: s.lockEnabled,
        pinHash: s.pinHash,
        isLocked: s.isLocked,
      }),
    }
  )
)
