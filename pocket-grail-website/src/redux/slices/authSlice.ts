import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { AuthUser } from '../../types/auth'
import type { RootState } from '../store'

interface AuthState {
	user: AuthUser | null
	isAuthenticated: boolean
	rehydrated: boolean
}

const initialState: AuthState = {
	user: null,
	isAuthenticated: false,
	rehydrated: false,
}

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		setUser(state, action: PayloadAction<AuthUser>) {
			state.user = action.payload
			state.isAuthenticated = true
		},
		clearUser(state) {
			state.user = null
			state.isAuthenticated = false
		},
		setRehydrated(state) {
			state.rehydrated = true
		},
	},
})

export const { setUser, clearUser, setRehydrated } = authSlice.actions
export default authSlice.reducer

export const selectUser = (s: RootState) => s.auth.user
export const selectIsAuthenticated = (s: RootState) => s.auth.isAuthenticated
export const selectRehydrated = (s: RootState) => s.auth.rehydrated
