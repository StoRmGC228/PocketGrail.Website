import { useSelector } from 'react-redux'
import { selectUser } from '../../../redux/slices/authSlice'
import { HiBell, HiMagnifyingGlass, HiArrowRight } from 'react-icons/hi2'
import { HiViewGrid } from 'react-icons/hi'

export const Uppbar = () => {
	const user = useSelector(selectUser)

	return (
		<header
			className="topbar"
			style={{
				height: 52,
				flexShrink: 0,
				display: 'flex',
				alignItems: 'center',
				gap: 12,
				padding: '0 22px',
				background: 'rgba(11, 8, 20, 0.75)',
				backdropFilter: 'blur(14px)',
				WebkitBackdropFilter: 'blur(14px)',
				borderBottom: '1px solid var(--border)',
				position: 'sticky',
				top: 0,
				zIndex: 30,
			}}
		>
			{/* Breadcrumb */}
			<div
				className="topbar-crumbs"
				style={{
					display: 'flex',
					alignItems: 'center',
					gap: 6,
					fontSize: 13,
					color: 'var(--text-dim)',
					paddingRight: 14,
					borderRight: '1px solid var(--border)',
					height: 32,
					flexShrink: 0,
				}}
			>
				<HiArrowRight size={14} style={{ color: 'var(--accent)', transform: 'rotate(-135deg)' }} />
				<span style={{ color: 'var(--text)' }}>Home</span>
			</div>

			{/* Search */}
			<div
				style={{
					flex: 1,
					maxWidth: 460,
					display: 'flex',
					alignItems: 'center',
					gap: 8,
					background: 'rgba(20, 14, 36, 0.6)',
					border: '1px solid var(--border)',
					borderRadius: 8,
					padding: '6px 11px',
				}}
			>
				<HiMagnifyingGlass size={15} style={{ color: 'var(--text-faint)', flexShrink: 0 }} />
				<input
					type="text"
					placeholder="Search lore, characters, items…"
					className="search-input"
					style={{
						flex: 1,
						background: 'none',
						border: 'none',
						color: 'var(--text)',
						fontFamily: 'var(--font-body)',
						fontSize: 13,
					}}
				/>
				<kbd
					style={{
						fontFamily: 'var(--font-body)',
						fontSize: 11,
						padding: '2px 6px',
						background: 'rgba(168,85,247,0.1)',
						border: '1px solid var(--border)',
						borderRadius: 4,
						color: 'var(--text-dim)',
						flexShrink: 0,
					}}
				>
					⌘K
				</kbd>
			</div>

			{/* Spacer */}
			<div style={{ flex: 1 }} />

			{/* Dice quick-cast */}
			<div
				className="topbar-quickcast"
				style={{
					display: 'flex',
					alignItems: 'center',
					gap: 6,
					padding: '5px 10px',
					background:
						'linear-gradient(135deg, rgba(168,85,247,0.15), rgba(99,102,241,0.1))',
					border: '1px solid var(--border-2)',
					borderRadius: 8,
					cursor: 'pointer',
					flexShrink: 0,
				}}
			>
				<HiViewGrid size={14} style={{ color: 'var(--accent)' }} />
				<span style={{ fontSize: 12, color: 'var(--text)', fontWeight: 500 }}>1d20</span>
				<span
					style={{
						fontFamily: 'var(--font-display)',
						fontSize: 15,
						fontWeight: 600,
						color: 'var(--gold)',
						paddingLeft: 6,
						borderLeft: '1px solid var(--border-2)',
						lineHeight: 1,
					}}
				>
					17
				</span>
			</div>

			{/* Bell */}
			<button
				style={{
					width: 32,
					height: 32,
					borderRadius: 8,
					background: 'rgba(20, 14, 36, 0.6)',
					border: '1px solid var(--border)',
					color: 'var(--text-dim)',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					cursor: 'pointer',
					position: 'relative',
					flexShrink: 0,
					padding: 0,
				}}
			>
				<HiBell size={16} />
				<span
					style={{
						position: 'absolute',
						top: 7,
						right: 7,
						width: 6,
						height: 6,
						borderRadius: '50%',
						background: 'var(--gold)',
						boxShadow: '0 0 6px var(--gold)',
					}}
				/>
			</button>

			{/* User */}
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					gap: 8,
					paddingLeft: 8,
					borderLeft: '1px solid var(--border)',
					height: 32,
					flexShrink: 0,
					cursor: 'pointer',
				}}
			>
				<div
					style={{
						width: 28,
						height: 28,
						borderRadius: '50%',
						background:
							'linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 100%)',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						color: '#fff',
						fontWeight: 700,
						fontSize: 12,
						boxShadow:
							'0 0 0 2px rgba(168,85,247,0.2), 0 4px 12px rgba(168,85,247,0.4)',
						flexShrink: 0,
					}}
				>
					{user?.username ? user.username.charAt(0).toUpperCase() : '?'}
				</div>
				<div
					className="topbar-userinfo"
					style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}
				>
					<span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>
						{user?.username ?? '—'}
					</span>
					<span
						style={{
							fontSize: 10,
							color: 'var(--text-faint)',
							textTransform: 'uppercase',
							letterSpacing: '1.2px',
						}}
					>
						{user?.role ?? 'Adventurer'}
					</span>
				</div>
			</div>
		</header>
	)
}
