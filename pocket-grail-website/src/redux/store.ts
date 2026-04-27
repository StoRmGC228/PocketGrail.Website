import { configureStore } from '@reduxjs/toolkit'
import exampleReducer from './slices/exampleSlice'

const store = configureStore({
	devTools: true,
	reducer: {
		example: exampleReducer,
	},
	middleware: getDefaultMiddleware => getDefaultMiddleware(),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
