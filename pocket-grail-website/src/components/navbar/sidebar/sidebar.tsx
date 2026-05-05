import './sidebar.css'
import { NavLink, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useLogoutMutation } from '../../../api/authApi'
import { clearUser } from '../../../redux/slices/authSlice'
import { removeUserCookie } from '../../../utils/authCookie'
import type { AppDispatch } from '../../../redux/store'
import {
	HiHome,
	HiNewspaper,
	HiCollection,
	HiBookOpen,
	HiUsers,
	HiGift,
	HiViewGrid,
} from 'react-icons/hi'
import {
	HiArrowRightOnRectangle,
	HiChevronLeft,
	HiChevronRight,
} from 'react-icons/hi2'
import type { IconType } from 'react-icons'

interface SidebarProps {
	isCollapsed: boolean
	onToggle: () => void
}

interface NavItem {
	to: string
	label: string
	icon: IconType
}

const libraryItems: NavItem[] = [
	{ to: '/', label: 'Home', icon: HiHome },
	{ to: '/news', label: 'News', icon: HiNewspaper },
	{ to: '/campaigns', label: 'Campaigns', icon: HiCollection },
	{ to: '/my-campaigns', label: 'My Campaigns', icon: HiBookOpen },
]

const toolItems: NavItem[] = [
	{ to: '/tools/dice', label: 'Dice', icon: HiViewGrid },
	{ to: '/tools/loot', label: 'Loot Generator', icon: HiGift },
	{ to: '/characters', label: 'Characters', icon: HiUsers },
]

interface NavItemRowProps {
	item: NavItem
	isCollapsed: boolean
}

function NavItemRow({ item, isCollapsed }: NavItemRowProps) {
	return (
		<NavLink to={item.to} end={item.to === '/'} style={{ textDecoration: 'none' }}>
			{({ isActive }) => (
				<div
					className={isActive ? '' : 'sidebar-nav-item'}
					style={{
						display: 'flex',
						alignItems: 'center',
						gap: isCollapsed ? 0 : 10,
						justifyContent: isCollapsed ? 'center' : 'flex-start',
						padding: isCollapsed ? '11px 0' : '10px 12px',
						margin: '1px 8px',
						borderRadius: 10,
						cursor: 'pointer',
						position: 'relative',
						background: isActive
							? 'linear-gradient(90deg, rgba(168,85,247,0.22) 0%, rgba(99,102,241,0.12) 100%)'
							: 'transparent',
						color: isActive ? '#fff' : 'var(--text-dim)',
						boxShadow: isActive
							? 'inset 0 0 0 1px rgba(168,85,247,0.3), 0 8px 24px -8px rgba(168,85,247,0.4)'
							: 'none',
						transition: 'background 150ms, color 150ms',
					}}
				>
					{/* Left accent bar for active state */}
					{isActive && (
						<div
							style={{
								position: 'absolute',
								left: -8,
								top: '50%',
								transform: 'translateY(-50%)',
								width: 3,
								height: 20,
								borderRadius: 2,
								background:
									'linear-gradient(180deg, var(--accent) 0%, var(--accent-2) 100%)',
								boxShadow: '0 0 8px var(--accent)',
							}}
						/>
					)}
					<item.icon size={18} style={{ flexShrink: 0 }} />
					{!isCollapsed && (
						<span
							className="sidebar-label"
							style={{ fontSize: 14, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden' }}
						>
							{item.label}
						</span>
					)}
				</div>
			)}
		</NavLink>
	)
}

export const Sidebar = ({ isCollapsed, onToggle }: SidebarProps) => {
	const dispatch = useDispatch<AppDispatch>()
	const navigate = useNavigate()
	const [logout] = useLogoutMutation()

	const handleLogout = async () => {
		try {
			await logout().unwrap()
		} catch {
			// non-critical — clear client state regardless
		}
		dispatch(clearUser())
		removeUserCookie()
		navigate('/auth')
	}

	return (
		<aside
			className="sidebar"
			data-collapsed={isCollapsed || undefined}
			style={{
				width: isCollapsed ? 68 : 248,
				height: '100vh',
				flexShrink: 0,
				display: 'flex',
				flexDirection: 'column',
				background:
					'linear-gradient(180deg, rgba(76,29,149,0.35), rgba(30,27,75,0.25) 60%, rgba(15,10,31,0.2))',
				borderRight: '1px solid var(--border)',
				backdropFilter: 'blur(20px)',
				WebkitBackdropFilter: 'blur(20px)',
				position: 'sticky',
				top: 0,
				zIndex: 40,
				overflow: 'visible',
				transition: 'width 250ms cubic-bezier(0.2, 0.7, 0.3, 1)',
			}}
		>
			{/* Inner clip wrapper (so content clips but toggle button overflows) */}
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					flex: 1,
					overflowY: 'auto',
					overflowX: 'hidden',
					scrollbarWidth: 'none',
				}}
			>
				{/* Brand area */}
				<div
					className="sidebar-brand"
					style={{
						display: 'flex',
						alignItems: 'center',
						gap: 12,
						padding: isCollapsed ? '22px 16px 18px' : '22px 18px 18px',
						justifyContent: isCollapsed ? 'center' : 'flex-start',
						borderBottom: '1px solid var(--border)',
						position: 'relative',
					}}
				>
					{/* Logo mark */}
					<div
						style={{
							width: 34,
							height: 34,
							borderRadius: 8,
							flexShrink: 0,
							background:
								'linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 100%)',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							fontSize: 16,
							boxShadow: '0 0 12px rgba(168,85,247,0.35)',
						}}
					>
						⚔
					</div>
					{/* Brand text */}
					{!isCollapsed && (
						<div
							className="sidebar-brand-text"
							style={{
								display: 'flex',
								flexDirection: 'column',
								lineHeight: 1.15,
								overflow: 'hidden',
							}}
						>
							<span
								style={{
									fontFamily: 'var(--font-display)',
									fontSize: 20,
									fontWeight: 600,
									color: '#f3eaff',
									whiteSpace: 'nowrap',
									letterSpacing: '0.3px',
								}}
							>
								PocketGrail
							</span>
							<span
								style={{
									fontSize: 10,
									textTransform: 'uppercase',
									letterSpacing: '2.2px',
									color: 'var(--text-dim)',
									marginTop: 2,
									whiteSpace: 'nowrap',
								}}
							>
								Adventure Codex
							</span>
						</div>
					)}
					{/* Collapse toggle button — sits on sidebar right edge */}
					<button
						className="sidebar-collapse-btn"
						onClick={onToggle}
						aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
						style={{
							position: 'absolute',
							right: -10,
							top: '50%',
							transform: 'translateY(-50%)',
							width: 20,
							height: 20,
							borderRadius: '50%',
							border: '1px solid var(--border-2)',
							background: 'var(--bg-2)',
							color: 'var(--text-dim)',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							cursor: 'pointer',
							zIndex: 5,
							padding: 0,
						}}
					>
						{isCollapsed ? <HiChevronRight size={12} /> : <HiChevronLeft size={12} />}
					</button>
				</div>

				{/* Navigation */}
				<nav
					style={{
						padding: '14px 0',
						display: 'flex',
						flexDirection: 'column',
						gap: 2,
						flex: 1,
					}}
				>
					{/* Library section */}
					{!isCollapsed && (
						<div
							className="sidebar-section-label"
							style={{
								fontSize: 10,
								textTransform: 'uppercase',
								letterSpacing: '2.2px',
								color: 'var(--text-faint)',
								padding: '8px 20px 4px',
								fontWeight: 600,
							}}
						>
							Library
						</div>
					)}
					{libraryItems.map(item => (
						<NavItemRow key={item.to} item={item} isCollapsed={isCollapsed} />
					))}

					{/* Tools section */}
					<div style={{ marginTop: 16 }}>
						{!isCollapsed && (
							<div
								className="sidebar-section-label"
								style={{
									fontSize: 10,
									textTransform: 'uppercase',
									letterSpacing: '2.2px',
									color: 'var(--text-faint)',
									padding: '8px 20px 4px',
									fontWeight: 600,
								}}
							>
								Tools
							</div>
						)}
						{toolItems.map(item => (
							<NavItemRow key={item.to} item={item} isCollapsed={isCollapsed} />
						))}
					</div>
				</nav>

				{/* Footer */}
				<div
					style={{
						padding: '12px 0',
						borderTop: '1px solid var(--border)',
						display: 'flex',
						flexDirection: 'column',
						gap: 8,
					}}
				>
					{/* Resume Session card */}
					{!isCollapsed && (
						<div
							className="sidebar-resume-card"
							style={{
								margin: '0 10px 4px',
								padding: 12,
								borderRadius: 12,
								background:
									'linear-gradient(135deg, rgba(168,85,247,0.15), rgba(67,56,202,0.1))',
								border: '1px solid var(--border-2)',
							}}
						>
							<div
								style={{
									fontSize: 9,
									textTransform: 'uppercase',
									letterSpacing: '2px',
									color: 'var(--accent)',
									fontWeight: 600,
								}}
							>
								Resume Session
							</div>
							<div
								style={{
									fontFamily: 'var(--font-display)',
									fontSize: 15,
									fontWeight: 600,
									color: '#fff',
									marginTop: 4,
								}}
							>
								The Hollow King
							</div>
							<div style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 2 }}>
								Ch. 4 · Last played 2d ago
							</div>
							<button
								style={{
									marginTop: 10,
									width: '100%',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									gap: 6,
									padding: 7,
									borderRadius: 8,
									background: 'rgba(168,85,247,0.2)',
									border: '1px solid var(--border-2)',
									color: '#fff',
									fontSize: 11,
									fontWeight: 600,
									cursor: 'pointer',
									fontFamily: 'var(--font-body)',
								}}
							>
								▶ Continue
							</button>
						</div>
					)}

					{/* Logout */}
					<button
						onClick={handleLogout}
						className="sidebar-nav-item"
						style={{
							display: 'flex',
							alignItems: 'center',
							gap: isCollapsed ? 0 : 10,
							justifyContent: isCollapsed ? 'center' : 'flex-start',
							padding: isCollapsed ? '11px 0' : '10px 12px',
							margin: '1px 8px',
							borderRadius: 10,
							background: 'none',
							border: 'none',
							color: 'var(--text-faint)',
							cursor: 'pointer',
							fontFamily: 'var(--font-body)',
							fontSize: 14,
							fontWeight: 500,
						}}
					>
						<HiArrowRightOnRectangle size={18} style={{ flexShrink: 0 }} />
						{!isCollapsed && (
							<span className="sidebar-label" style={{ whiteSpace: 'nowrap' }}>
								Log out
							</span>
						)}
					</button>
				</div>
			</div>
		</aside>
	)
}
