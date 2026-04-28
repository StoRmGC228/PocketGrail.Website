import { NavLink, useNavigate } from 'react-router-dom'
import { HiHome, HiNewspaper } from 'react-icons/hi'
import { HiMiniXMark, HiArrowRightOnRectangle } from 'react-icons/hi2'
import { useDispatch } from 'react-redux'
import { useLogoutMutation } from '../../../api/authApi'
import { clearUser } from '../../../redux/slices/authSlice'
import { removeUserCookie } from '../../../utils/authCookie'
import type { AppDispatch } from '../../../redux/store'

interface SidebarProps {
	isOpen: boolean
	onClose: () => void
}

interface NavItem {
	to: string
	label: string
	icon: React.ReactNode
}

const navItems: NavItem[] = [
	{ to: '/', label: 'Home', icon: <HiHome size={20} /> },
	{ to: '/news', label: 'News', icon: <HiNewspaper size={20} /> },
]

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
	const dispatch = useDispatch<AppDispatch>()
	const navigate = useNavigate()
	const [logout] = useLogoutMutation()

	const handleLogout = async () => {
		try {
			await logout().unwrap()
		} catch {
			// backend logout failure is non-critical — clear client state regardless
		}
		dispatch(clearUser())
		removeUserCookie()
		onClose()
		navigate('/auth')
	}

	return (
		<>
			{/* Overlay — mobile only */}
			{isOpen && (
				<div
					className='fixed inset-0 z-40 bg-black/40 lg:hidden'
					onClick={onClose}
				/>
			)}

			<aside
				className={`
					bg-(--color-nb) w-[240px] shrink-0 z-50
					fixed left-0 top-[70px] h-[calc(100vh-70px)]
					transition-transform duration-300
					md:top-[80px] md:h-[calc(100vh-80px)]
					lg:sticky lg:top-0 lg:h-[calc(100vh-90px)] lg:translate-x-0
					flex flex-col
					${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
				`}
			>
				{/* Close button — mobile only */}
				<div className='flex justify-end px-3 pt-3 lg:hidden'>
					<button
						onClick={onClose}
						className='text-white/70 hover:text-white p-1 rounded hover:bg-white/10 transition-colors cursor-pointer'
						aria-label='Close menu'
					>
						<HiMiniXMark size={22} />
					</button>
				</div>

				<nav className='flex flex-col gap-1 px-3 pt-2 flex-1'>
					{navItems.map(item => (
						<NavLink
							key={item.to}
							to={item.to}
							end={item.to === '/'}
							onClick={onClose}
							className={({ isActive }) =>
								`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors
								${isActive
									? 'bg-white/20 text-white'
									: 'text-white/70 hover:bg-white/10 hover:text-white'
								}`
							}
						>
							{item.icon}
							{item.label}
						</NavLink>
					))}
				</nav>

				{/* Logout — pinned to bottom right */}
				<div className='flex justify-end px-3 pb-4'>
					<button
						onClick={handleLogout}
						className='flex items-center gap-2 px-4 py-3 lg:py-2 rounded-lg text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-colors cursor-pointer min-h-[44px]'
						aria-label='Logout'
					>
						<HiArrowRightOnRectangle size={20} />
						Logout
					</button>
				</div>
			</aside>
		</>
	)
}
