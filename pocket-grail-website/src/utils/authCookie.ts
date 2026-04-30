import Cookies from 'js-cookie'
import type { AuthUser } from '../types/auth'

const KEY = 'pg_user'

export const saveUserCookie = (user: AuthUser): void => {
	Cookies.set(KEY, JSON.stringify(user), { expires: 180, sameSite: 'Lax' })
}

export const readUserCookie = (): AuthUser | null => {
	try {
		const raw = Cookies.get(KEY)
		return raw ? (JSON.parse(raw) as AuthUser) : null
	} catch {
		return null
	}
}

export const removeUserCookie = (): void => {
	Cookies.remove(KEY)
}
