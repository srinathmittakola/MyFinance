import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { User } from "../types"

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  updateUser: (data: Partial<User>) => void
}

interface RegisterData {
  fullName: string
  email: string
  password: string
  currency: string
  country?: string
  monthlyIncome?: number
}

const DEMO_USER: User = {
  id: "demo-user-1",
  email: "srinath@example.com",
  fullName: "Srinath Kumar",
  currency: "INR",
  country: "India",
  timezone: "Asia/Kolkata",
  monthlyIncome: 85000,
  createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        await new Promise((resolve) => setTimeout(resolve, 800))
        if (email === "demo@financeos.app" && password === "Demo@1234") {
          set({ user: DEMO_USER, isAuthenticated: true })
          return { success: true }
        }
        const stored = localStorage.getItem("finance-registered-users")
        if (stored) {
          const users: Array<{ user: User; password: string }> = JSON.parse(stored)
          const found = users.find((u) => u.user.email === email && u.password === password)
          if (found) {
            set({ user: found.user, isAuthenticated: true })
            return { success: true }
          }
        }
        return { success: false, error: "Invalid email or password" }
      },

      register: async (data: RegisterData) => {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        const stored = localStorage.getItem("finance-registered-users")
        const users: Array<{ user: User; password: string }> = stored ? JSON.parse(stored) : []
        if (users.some((u) => u.user.email === data.email)) {
          return { success: false, error: "Email already registered" }
        }
        const newUser: User = {
          id: `user-${Date.now()}`,
          email: data.email,
          fullName: data.fullName,
          currency: data.currency || "INR",
          country: data.country || "India",
          timezone: "Asia/Kolkata",
          monthlyIncome: data.monthlyIncome,
          createdAt: new Date().toISOString(),
        }
        users.push({ user: newUser, password: data.password })
        localStorage.setItem("finance-registered-users", JSON.stringify(users))
        set({ user: newUser, isAuthenticated: true })
        return { success: true }
      },

      logout: () => {
        set({ user: null, isAuthenticated: false })
      },

      updateUser: (data: Partial<User>) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        }))
      },
    }),
    { name: "finance-auth" }
  )
)
