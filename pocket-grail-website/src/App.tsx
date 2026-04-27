import { Route, Routes } from 'react-router-dom'

function App() {
	return (
		<div className='flex flex-col min-h-screen'>
			<main className='flex-1 overflow-auto'>
				<Routes>
					<Route path='/' element={<div>Home</div>} />
				</Routes>
			</main>
		</div>
	)
}

export default App
