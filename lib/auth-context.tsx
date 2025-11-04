"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export type UserRole = "Administrator" | "Engineer" | "Operator"

export interface User {
  id: string
  name: string
  username: string
  role: UserRole
  phone: string
  address: string
}

interface AuthContextType {
  user: User | null
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock users for demo purposes
const mockUsers: (User & { password: string })[] = [
  {
    id: "1",
    name: "Admin User",
    username: "admin",
    password: "admin123",
    role: "Administrator",
    phone: "+1-555-0100",
    address: "123 Admin St, HQ",
  },
  {
    id: "2",
    name: "John Engineer",
    username: "engineer",
    password: "eng123",
    role: "Engineer",
    phone: "+1-555-0101",
    address: "456 Tech Ave",
  },
  {
    id: "3",
    name: "Jane Operator",
    username: "operator",
    password: "op123",
    role: "Operator",
    phone: "+1-555-0102",
    address: "789 Factory Rd",
  },
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem("aerocode_user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const login = async (username: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    const foundUser = mockUsers.find((u) => u.username === username && u.password === password)

    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser
      setUser(userWithoutPassword)
      localStorage.setItem("aerocode_user", JSON.stringify(userWithoutPassword))
      return true
    }

    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("aerocode_user")
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
