import { configureStore } from '@reduxjs/toolkit'
import exampleReducer from './slices/exampleSlice'
import authReducer from './slices/authSlice'
import { authApi } from '../api/authApi'
import { campaignApi } from '../api/campaignApi'
import { characterApi } from '../api/characterApi'
import { classApi } from '../api/classApi'
import { raceApi } from '../api/raceApi'

const store = configureStore({
	devTools: true,
	reducer: {
		example: exampleReducer,
		auth: authReducer,
		[authApi.reducerPath]: authApi.reducer,
		[campaignApi.reducerPath]: campaignApi.reducer,
		[characterApi.reducerPath]: characterApi.reducer,
		[classApi.reducerPath]: classApi.reducer,
		[raceApi.reducerPath]: raceApi.reducer,
	},
	middleware: getDefaultMiddleware =>
		getDefaultMiddleware().concat(authApi.middleware, campaignApi.middleware, characterApi.middleware, classApi.middleware, raceApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
