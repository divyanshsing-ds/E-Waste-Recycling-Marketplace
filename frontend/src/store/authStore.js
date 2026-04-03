import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useAuthStore = create(
  persist(
    (set, get) => ({
      accounts: [], // [{ user, accessToken, refreshToken, id }]
      activeAccountId: null,

      // Current Session Shorthands
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,

      // Initialize session from active account
      setSession: (account) => set({
        user: account.user,
        accessToken: account.accessToken,
        refreshToken: account.refreshToken,
        activeAccountId: account.id,
        isAuthenticated: true
      }),

      setUser: (user) => set({ user }),

      setTokens: (access, refresh) => {
        const activeId = get().activeAccountId
        const existingAccounts = get().accounts || []
        const updatedAccounts = existingAccounts.map(a =>
          a.id === activeId ? { ...a, accessToken: access, refreshToken: refresh } : a
        )
        set({
          accounts: updatedAccounts,
          accessToken: access,
          refreshToken: refresh,
        })
      },

      addAccount: (user, access, refresh) => {
        const newAccount = { 
          id: user.id, 
          user, 
          accessToken: access, 
          refreshToken: refresh 
        }
        
        const existingAccounts = get().accounts || []
        const otherAccounts = existingAccounts.filter(a => a.id !== user.id)
        const updatedAccounts = [newAccount, ...otherAccounts]
        
        set({
          accounts: updatedAccounts,
          activeAccountId: user.id,
          user,
          accessToken: access,
          refreshToken: refresh,
          isAuthenticated: true
        })
      },

      switchAccount: (accountId) => {
        const account = (get().accounts || []).find(a => a.id === accountId)
        if (account) {
          set({
            activeAccountId: accountId,
            user: account.user,
            accessToken: account.accessToken,
            refreshToken: account.refreshToken,
            isAuthenticated: true
          })
        }
      },

      logout: () => {
        const activeId = get().activeAccountId
        const remainingAccounts = (get().accounts || []).filter(a => a.id !== activeId)
        
        if (remainingAccounts.length > 0) {
          const next = remainingAccounts[0]
          set({
            accounts: remainingAccounts,
            activeAccountId: next.id,
            user: next.user,
            accessToken: next.accessToken,
            refreshToken: next.refreshToken,
            isAuthenticated: true
          })
        } else {
          set({
            accounts: [],
            activeAccountId: null,
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false
          })
        }
      },

      logoutAll: () => set({
        accounts: [],
        activeAccountId: null,
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false
      })
    }),
    {
      name: 'auth-storage',
      storage: {
        getItem: (name) => {
          const str = sessionStorage.getItem(name)
          if (!str) return null
          return JSON.parse(str)
        },
        setItem: (name, value) => {
          sessionStorage.setItem(name, JSON.stringify(value))
        },
        removeItem: (name) => sessionStorage.removeItem(name),
      }
    }
  )
)

export default useAuthStore
