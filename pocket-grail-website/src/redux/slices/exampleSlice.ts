import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface ExampleState {
	value: string
}

const initialState: ExampleState = {
	value: '',
}

const exampleSlice = createSlice({
	name: 'example',
	initialState,
	reducers: {
		setValue: (state, action: PayloadAction<string>) => {
			state.value = action.payload
		},
		clearValue: state => {
			state.value = ''
		},
	},
})

export const { setValue, clearValue } = exampleSlice.actions
export default exampleSlice.reducer
