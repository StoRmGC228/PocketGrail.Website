import { configureStore } from '@reduxjs/toolkit'
import exampleReducer from './slices/exampleSlice'
import authReducer from './slices/authSlice'
import { authApi } from '../api/authApi'

const store = configureStore({
	devTools: true,
	reducer: {
		example: exampleReducer,
		auth: authReducer,
		[authApi.reducerPath]: authApi.reducer,
	},
	middleware: getDefaultMiddleware =>
		getDefaultMiddleware().concat(authApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
