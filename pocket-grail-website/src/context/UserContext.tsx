import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'

interface UserState {
	name: string
}

interface UserContextValue {
	user: UserState
	setUser: (partial: Partial<UserState>) => void
	clearUser: () => void
}

const defaultState: UserState = {
	name: '',
}

const SESSION_KEY = 'pg_user'

function loadFromStorage(): UserState {
	try {
		const raw = sessionStorage.getItem(SESSION_KEY)
		return raw ? { ...defaultState, ...JSON.parse(raw) } : defaultState
	} catch {
		return defaultState
	}
}

const UserContext = createContext<UserContextValue | null>(null)

export const UserProvider = ({ children }: { children: ReactNode }) => {
	const [user, setUserState] = useState<UserState>(loadFromStorage)

	const setUser = (partial: Partial<UserState>) => {
		setUserState(prev => {
			const next = { ...prev, ...partial }
			sessionStorage.setItem(SESSION_KEY, JSON.stringify(next))
			return next
		})
	}

	const clearUser = () => {
		sessionStorage.removeItem(SESSION_KEY)
		setUserState(defaultState)
	}

	return (
		<UserContext.Provider value={{ user, setUser, clearUser }}>
			{children}
		</UserContext.Provider>
	)
}

export const useUser = (): UserContextValue => {
	const ctx = useContext(UserContext)
	if (!ctx) throw new Error('useUser must be used inside UserProvider')
	return ctx
}
