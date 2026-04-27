import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import { Uppbar, Sidebar } from './components/navbar/navbar'
import { UserProvider } from './context/UserContext'
import { HomePage } from './pages/HomePage'

function App() {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false)

	return (
		<UserProvider>
			<div className='flex flex-col h-screen overflow-hidden'>
				<Uppbar onBurgerClick={() => setIsSidebarOpen(prev => !prev)} />
				<div className='flex flex-1 min-h-0'>
					<Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
					<main className='flex-1 overflow-auto p-6'>
						<Routes>
							<Route path='/' element={<HomePage />} />
							<Route path='/news' element={<div>News Page</div>} />
						</Routes>
					</main>
				</div>
			</div>
		</UserProvider>
	)
}

export default App
