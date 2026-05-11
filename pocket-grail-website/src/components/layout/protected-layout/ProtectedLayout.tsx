import './ProtectedLayout.css'
import { useState } from 'react'
import { Navigate, Outlet, NavLink, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectIsAuthenticated } from '../../../redux/slices/authSlice'
import { Uppbar, Sidebar } from '../../navbar/navbar'
import { HiHome, HiNewspaper, HiCollection, HiUsers } from 'react-icons/hi'

const BOTTOM_TABS = [
	{ to: '/', label: 'Home', icon: HiHome },
	{ to: '/news', label: 'News', icon: HiNewspaper },
	{ to: '/campaigns', label: 'Campaigns', icon: HiCollection },
	{ to: '/my-campaigns', label: 'Heroes', icon: HiUsers },
]

function BottomTabBar() {
	const location = useLocation()

	return (
		<nav
			className="bottom-tabs"
			style={{
				position: 'fixed',
				bottom: 0,
				left: 0,
				right: 0,
				gridTemplateColumns: 'repeat(4, 1fr)',
				height: 64,
				background: 'rgba(11, 8, 20, 0.92)',
				backdropFilter: 'blur(14px)',
				WebkitBackdropFilter: 'blur(14px)',
				borderTop: '1px solid var(--border)',
				paddingBottom: 'env(safe-area-inset-bottom)',
				zIndex: 50,
			}}
		>
			{BOTTOM_TABS.map(({ to, label, icon: Icon }) => {
				const isActive = to === '/' ? location.pathname === '/' : location.pathname.startsWith(to)
				return (
					<NavLink
						key={to}
						to={to}
						end={to === '/'}
						style={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							justifyContent: 'center',
							gap: 3,
							textDecoration: 'none',
							color: isActive ? 'var(--accent)' : 'var(--text-faint)',
							fontSize: 10,
							fontFamily: 'var(--font-body)',
							borderRadius: 10,
							transition: 'color 150ms',
						}}
					>
						<Icon
							size={20}
							style={isActive ? { filter: 'drop-shadow(0 0 6px rgba(168,85,247,0.7))' } : undefined}
						/>
						<span>{label}</span>
					</NavLink>
				)
			})}
		</nav>
	)
}

export function ProtectedLayout() {
	const isAuthenticated = useSelector(selectIsAuthenticated)
	const [isCollapsed, setIsCollapsed] = useState(false)

	if (!isAuthenticated) return <Navigate to='/auth' replace />

	return (
		<div
			style={{
				display: 'flex',
				minHeight: '100svh',
				background: `
					radial-gradient(ellipse at 0% 0%, rgba(124,58,237,0.18), transparent 60%),
					radial-gradient(ellipse at 100% 100%, rgba(67,56,202,0.15), transparent 60%),
					linear-gradient(180deg, #0b0814, #06040d)
				`,
			}}
		>
			<Sidebar isCollapsed={isCollapsed} onToggle={() => setIsCollapsed(p => !p)} />
			<div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
				<Uppbar />
				{/* Mobile top bar */}
				<header
					className="mobile-topbar"
					style={{
						height: 52,
						alignItems: 'center',
						justifyContent: 'space-between',
						padding: '0 14px',
						background: 'rgba(11, 8, 20, 0.85)',
						backdropFilter: 'blur(12px)',
						WebkitBackdropFilter: 'blur(12px)',
						borderBottom: '1px solid var(--border)',
						position: 'sticky',
						top: 0,
						zIndex: 30,
						flexShrink: 0,
					}}
				>
					<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
						<div
							style={{
								width: 28,
								height: 28,
								borderRadius: 6,
								background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 100%)',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								fontSize: 14,
							}}
						>
							⚔
						</div>
						<span
							style={{
								fontFamily: 'var(--font-display)',
								fontSize: 18,
								fontWeight: 600,
								color: '#fff',
								letterSpacing: '0.3px',
							}}
						>
							PocketGrail
						</span>
					</div>
				</header>
				<main
					style={{ flex: 1, overflowY: 'auto', padding: '24px 28px 36px' }}
					className="pb-20 sm:pb-9"
				>
					<Outlet />
				</main>
			</div>
			<BottomTabBar />
		</div>
	)
}
