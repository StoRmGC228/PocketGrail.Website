import { configureStore } from '@reduxjs/toolkit'
import exampleReducer from './slices/exampleSlice'
import authReducer from './slices/authSlice'
import { authApi } from '../api/authApi'
import { campaignApi } from '../api/campaignApi'
import { characterApi } from '../api/characterApi'

const store = configureStore({
	devTools: true,
	reducer: {
		example: exampleReducer,
		auth: authReducer,
		[authApi.reducerPath]: authApi.reducer,
		[campaignApi.reducerPath]: campaignApi.reducer,
		[characterApi.reducerPath]: characterApi.reducer,
	},
	middleware: getDefaultMiddleware =>
		getDefaultMiddleware().concat(authApi.middleware, campaignApi.middleware, characterApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
