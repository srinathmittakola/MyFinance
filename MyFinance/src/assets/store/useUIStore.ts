import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Toast } from "../types"

interface UIState {
  sidebarCollapsed: boolean
  theme: "light" | "dark" | "system"
  currency: string
  toasts: Toast[]
  commandPaletteOpen: boolean
  quickAddOpen: boolean
  toggleSidebar: () => void
  setSidebarCollapsed: (v: boolean) => void
  setTheme: (theme: "light" | "dark" | "system") => void
  setCurrency: (currency: string) => void
  addToast: (message: string, type?: Toast["type"]) => void
  removeToast: (id: string) => void
  setCommandPalette: (open: boolean) => void
  setQuickAdd: (open: boolean) => void
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      theme: "light",
      currency: "INR",
      toasts: [],
      commandPaletteOpen: false,
      quickAddOpen: false,

      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setSidebarCollapsed: (v) => set({ sidebarCollapsed: v }),

      setTheme: (theme) => {
        set({ theme })
        if (theme === "dark") {
          document.documentElement.classList.add("dark")
        } else if (theme === "light") {
          document.documentElement.classList.remove("dark")
        } else {
          const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
          document.documentElement.classList.toggle("dark", prefersDark)
        }
      },

      setCurrency: (currency) => set({ currency }),

      addToast: (message, type = "success") => {
        const id = `toast-${Date.now()}-${Math.random()}`
        set((s) => ({ toasts: [...s.toasts, { id, message, type }] }))
        setTimeout(() => {
          set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }))
        }, 4000)
      },

      removeToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

      setCommandPalette: (open) => set({ commandPaletteOpen: open }),
      setQuickAdd: (open) => set({ quickAddOpen: open }),
    }),
    { name: "finance-ui", partialize: (s) => ({ sidebarCollapsed: s.sidebarCollapsed, theme: s.theme, currency: s.currency }) }
  )
)
