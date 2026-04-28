import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useLazyMeQuery } from '../api/authApi'
import { setUser, clearUser, setRehydrated } from '../redux/slices/authSlice'
import { readUserCookie, saveUserCookie, removeUserCookie } from '../utils/authCookie'
import type { AppDispatch } from '../redux/store'

export function useAuthInit(): void {
	const dispatch = useDispatch<AppDispatch>()
	const [triggerMe] = useLazyMeQuery()

	useEffect(() => {
		// Phase 1: instantly populate Redux from cookie (no network delay)
		const cached = readUserCookie()
		if (cached) dispatch(setUser(cached))

		// Phase 2: verify session with backend
		triggerMe()
			.unwrap()
			.then(user => {
				dispatch(setUser(user))
				saveUserCookie(user)
			})
			.catch(() => {
				dispatch(clearUser())
				removeUserCookie()
			})
			.finally(() => {
				dispatch(setRehydrated())
			})
	}, []) // eslint-disable-line react-hooks/exhaustive-deps
}
