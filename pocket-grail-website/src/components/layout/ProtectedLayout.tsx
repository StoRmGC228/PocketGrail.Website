import { useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectIsAuthenticated } from '../../redux/slices/authSlice'
import { Uppbar, Sidebar } from '../navbar/navbar'

export function ProtectedLayout() {
	const isAuthenticated = useSelector(selectIsAuthenticated)
	const [isSidebarOpen, setIsSidebarOpen] = useState(false)

	if (!isAuthenticated) return <Navigate to='/auth' replace />

	return (
		<div className='flex flex-col h-screen overflow-hidden'>
			<Uppbar onBurgerClick={() => setIsSidebarOpen(prev => !prev)} />
			<div className='flex flex-1 min-h-0'>
				<Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
				<main className='flex-1 overflow-auto p-6'>
					<Outlet />
				</main>
			</div>
		</div>
	)
}
