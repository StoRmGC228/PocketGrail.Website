import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { HiUsers, HiGift, HiViewGrid } from 'react-icons/hi'
import { HiArrowRight, HiHeart } from 'react-icons/hi2'
import type { IconType } from 'react-icons'

/* ── Codex Tile ──────────────────────────────────────────────────── */
interface CodexTileProps {
	to: string
	label: string
	sub?: string
	eyebrow: string
	gradient: string
	large?: boolean
	centered?: boolean
	minHeight?: number
}

function CodexTile({
	to,
	label,
	sub,
	eyebrow,
	gradient,
	large,
	centered,
	minHeight = 150,
}: CodexTileProps) {
	const navigate = useNavigate()
	const [hovered, setHovered] = useState(false)

	return (
		<div
			onClick={() => navigate(to)}
			onMouseEnter={() => setHovered(true)}
			onMouseLeave={() => setHovered(false)}
			style={{
				position: 'relative',
				borderRadius: 16,
				overflow: 'hidden',
				border: `1px solid ${hovered ? 'var(--border-2)' : 'var(--border)'}`,
				cursor: 'pointer',
				display: 'flex',
				flexDirection: 'column',
				justifyContent: centered ? 'center' : 'flex-end',
				alignItems: centered ? 'center' : undefined,
				padding: 22,
				minHeight,
				background: gradient,
				transition: 'transform 200ms, box-shadow 200ms, border-color 200ms',
				transform: hovered ? 'translateY(-3px)' : 'none',
				boxShadow: hovered
					? '0 16px 40px -12px rgba(168,85,247,0.4)'
					: '0 4px 20px rgba(0,0,0,0.3)',
				isolation: 'isolate',
			}}
		>
			{/* Grain */}
			<div className="grain-overlay" />
			{/* Bottom scrim */}
			<div
				style={{
					position: 'absolute',
					inset: 0,
					background: 'linear-gradient(180deg, transparent 30%, rgba(0,0,0,0.65) 100%)',
					zIndex: 1,
				}}
			/>
			{/* Content */}
			<div
				style={{
					position: 'relative',
					zIndex: 2,
					textAlign: centered ? 'center' : undefined,
				}}
			>
				<div
					style={{
						display: 'inline-flex',
						alignItems: 'center',
						gap: 5,
						fontSize: 10,
						textTransform: 'uppercase',
						letterSpacing: '1.8px',
						color: 'rgba(255,255,255,0.85)',
						fontWeight: 600,
						marginBottom: 8,
						padding: '4px 8px',
						background: 'rgba(255,255,255,0.1)',
						borderRadius: 999,
						backdropFilter: 'blur(8px)',
					}}
				>
					{eyebrow}
				</div>
				<div
					style={{
						fontFamily: 'var(--font-display)',
						fontSize: large ? 32 : 24,
						fontWeight: 600,
						color: '#fff',
						lineHeight: 1.1,
					}}
				>
					{label}
				</div>
				{sub && (
					<div style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', marginTop: 6 }}>
						{sub}
					</div>
				)}
			</div>
			{/* Arrow button */}
			<div
				style={{
					position: 'absolute',
					top: 16,
					right: 16,
					zIndex: 2,
					width: 32,
					height: 32,
					borderRadius: '50%',
					background: hovered ? 'var(--accent)' : 'rgba(255,255,255,0.1)',
					border: '1px solid rgba(255,255,255,0.2)',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					color: '#fff',
					backdropFilter: 'blur(8px)',
					transition: 'background 200ms, transform 200ms',
					transform: hovered ? 'rotate(-45deg)' : 'none',
				}}
			>
				<HiArrowRight size={14} />
			</div>
		</div>
	)
}

/* ── Tool Card ───────────────────────────────────────────────────── */
interface ToolCardProps {
	to: string
	icon: IconType
	iconColor: string
	iconBg: string
	label: string
	meta: string
	external?: boolean
}

function ToolCard({ to, icon: Icon, iconColor, iconBg, label, meta, external }: ToolCardProps) {
	const navigate = useNavigate()
	const [hovered, setHovered] = useState(false)

	return (
		<div
			onClick={() => (external ? window.open(to, '_blank') : navigate(to))}
			onMouseEnter={() => setHovered(true)}
			onMouseLeave={() => setHovered(false)}
			style={{
				display: 'flex',
				alignItems: 'center',
				gap: 12,
				padding: 14,
				background: hovered ? 'rgba(30, 20, 52, 0.7)' : 'rgba(20, 14, 36, 0.5)',
				border: `1px solid ${hovered ? 'var(--border-2)' : 'var(--border)'}`,
				borderRadius: 12,
				cursor: 'pointer',
				textDecoration: 'none',
				transition: 'background 150ms, border-color 150ms, transform 150ms',
				transform: hovered ? 'translateY(-1px)' : 'none',
			}}
		>
			<div
				style={{
					width: 38,
					height: 38,
					borderRadius: 10,
					background: iconBg,
					border: '1px solid var(--border-2)',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					flexShrink: 0,
				}}
			>
				<Icon size={18} style={{ color: iconColor }} />
			</div>
			<div>
				<div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{label}</div>
				<div style={{ fontSize: 11, color: 'var(--text-faint)', marginTop: 2 }}>{meta}</div>
			</div>
		</div>
	)
}

/* ── Button styles ───────────────────────────────────────────────── */
const btnPrimary: React.CSSProperties = {
	display: 'inline-flex',
	alignItems: 'center',
	gap: 8,
	padding: '11px 20px',
	borderRadius: 10,
	border: 'none',
	cursor: 'pointer',
	background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
	color: '#fff',
	fontSize: 13,
	fontWeight: 600,
	fontFamily: 'var(--font-body)',
	boxShadow: '0 8px 24px -8px rgba(168,85,247,0.6)',
}

const btnGhost: React.CSSProperties = {
	display: 'inline-flex',
	alignItems: 'center',
	gap: 8,
	padding: '11px 20px',
	borderRadius: 10,
	cursor: 'pointer',
	background: 'rgba(255,255,255,0.06)',
	color: 'var(--text)',
	border: '1px solid var(--border-2)',
	fontSize: 13,
	fontWeight: 500,
	fontFamily: 'var(--font-body)',
}

/* ── Home Page ───────────────────────────────────────────────────── */
export const HomePage = () => {
	const navigate = useNavigate()

	return (
		<div style={{ display: 'flex', flexDirection: 'column', gap: 26 }}>

			{/* ── Hero ───────────────────────────────────────────────────── */}
			<section
				style={{
					position: 'relative',
					borderRadius: 20,
					overflow: 'hidden',
					border: '1px solid var(--border-2)',
					minHeight: 420,
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'flex-end',
					boxShadow:
						'0 20px 60px -20px rgba(0,0,0,0.6), 0 0 0 1px rgba(168,85,247,0.15)',
				}}
			>
				{/* Background image */}
				<img
					src="/homeHeaderImage.jpg"
					alt=""
					aria-hidden
					style={{
						position: 'absolute',
						inset: 0,
						width: '100%',
						height: '100%',
						objectFit: 'cover',
						zIndex: 0,
					}}
				/>
				{/* Gradient scrim */}
				<div
					style={{
						position: 'absolute',
						inset: 0,
						background:
							'linear-gradient(180deg, rgba(11,8,20,0.2) 0%, rgba(11,8,20,0.5) 50%, rgba(11,8,20,0.95) 100%), linear-gradient(90deg, rgba(11,8,20,0.7) 0%, transparent 60%)',
						zIndex: 1,
					}}
				/>
				{/* Grain */}
				<div className="grain-overlay" style={{ zIndex: 2 }} />

				{/* Content */}
				<div
					style={{
						position: 'relative',
						zIndex: 3,
						padding: '36px 40px 28px',
						maxWidth: 620,
					}}
				>
					{/* Tag pill */}
					<div
						style={{
							display: 'inline-flex',
							alignItems: 'center',
							gap: 8,
							padding: '6px 12px',
							background: 'rgba(168,85,247,0.18)',
							border: '1px solid var(--border-2)',
							borderRadius: 999,
							fontSize: 11,
							textTransform: 'uppercase',
							letterSpacing: '1.6px',
							color: '#f3eaff',
							fontWeight: 600,
							marginBottom: 18,
							backdropFilter: 'blur(8px)',
						}}
					>
						<span
							className="pulse-gold"
							style={{
								width: 7,
								height: 7,
								borderRadius: '50%',
								background: 'var(--gold)',
								display: 'inline-block',
								flexShrink: 0,
							}}
						/>
						Live Campaign · The Hollow King
					</div>

					{/* Title */}
					<h1
						style={{
							fontFamily: 'var(--font-display)',
							fontSize: 'clamp(28px, 3.5vw, 44px)',
							fontWeight: 600,
							lineHeight: 1.05,
							letterSpacing: '-0.5px',
							margin: '0 0 16px',
							color: '#fff',
						}}
					>
						Welcome back to the realm<br />
						where every roll writes legend.
					</h1>

					{/* Sub */}
					<p
						style={{
							fontSize: 14,
							lineHeight: 1.65,
							color: 'var(--text-dim)',
							margin: '0 0 22px',
							maxWidth: 520,
						}}
					>
						Your party gathers in the Drunken Griffin tavern. The barkeep slides a
						sealed letter across the table — the seal bears the missing duke's crest.
					</p>

					{/* CTAs */}
					<div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
						<button style={btnPrimary} onClick={() => navigate('/campaigns')}>
							▶ Resume Chapter 4
						</button>
						<button style={btnGhost} onClick={() => navigate('/my-campaigns')}>
							Campaign Journal <HiArrowRight size={13} />
						</button>
					</div>
				</div>

				{/* Stats plate */}
				<div
					className="hidden sm:flex"
					style={{
						position: 'absolute',
						right: 32,
						bottom: 32,
						zIndex: 3,
						gap: 24,
						background: 'rgba(11,8,20,0.6)',
						backdropFilter: 'blur(12px)',
						WebkitBackdropFilter: 'blur(12px)',
						border: '1px solid var(--border-2)',
						borderRadius: 14,
						padding: '14px 22px',
					}}
				>
					{[
						{ label: 'Sessions', value: '12' },
						{ label: 'Players', value: '7' },
						{ label: 'XP Earned', value: '2,341' },
					].map(s => (
						<div key={s.label} style={{ textAlign: 'center' }}>
							<div
								style={{
									fontFamily: 'var(--font-display)',
									fontSize: 24,
									fontWeight: 600,
									color: 'var(--gold)',
									lineHeight: 1,
								}}
							>
								{s.value}
							</div>
							<div
								style={{
									fontSize: 10,
									color: 'var(--text-dim)',
									textTransform: 'uppercase',
									letterSpacing: '1.6px',
									marginTop: 4,
								}}
							>
								{s.label}
							</div>
						</div>
					))}
				</div>
			</section>

			{/* ── Codex ──────────────────────────────────────────────────── */}
			<div>
				<div
					style={{
						display: 'flex',
						alignItems: 'flex-end',
						justifyContent: 'space-between',
						padding: '0 4px',
						marginBottom: 16,
					}}
				>
					<div>
						<div
							style={{
								fontSize: 11,
								textTransform: 'uppercase',
								letterSpacing: '2.4px',
								color: 'var(--accent)',
								marginBottom: 6,
								fontWeight: 600,
							}}
						>
							Codex
						</div>
						<h2 style={{ fontSize: 28, fontWeight: 500, color: '#fff', letterSpacing: '-0.3px' }}>
							Explore the world
						</h2>
					</div>
					<button
						onClick={() => navigate('/lore')}
						style={{
							background: 'none',
							border: 'none',
							display: 'inline-flex',
							alignItems: 'center',
							gap: 6,
							fontSize: 13,
							color: 'var(--text-dim)',
							cursor: 'pointer',
							fontFamily: 'var(--font-body)',
						}}
					>
						See all <HiArrowRight size={13} />
					</button>
				</div>

				{/* Tile grid */}
				<div
					className="grid grid-cols-1 sm:grid-cols-[2fr_1fr]"
					style={{ gap: 16, minHeight: 320 }}
				>
					<CodexTile
						to="/lore"
						label="World Lore"
						sub="142 entries · updated today"
						eyebrow="Lore"
						gradient="linear-gradient(135deg, #1e1b4b 0%, #4c1d95 50%, #831843 100%)"
						large
						minHeight={320}
					/>
					<div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
						<CodexTile
							to="/lore/figures"
							label="Notable Figures"
							sub="38 NPCs"
							eyebrow="Figures"
							gradient="linear-gradient(135deg, #312e81 0%, #6d28d9 100%)"
						/>
						<CodexTile
							to="/lore/misc"
							label="Miscellaneous"
							sub="Bestiary, items, maps"
							eyebrow="Compendium"
							gradient="linear-gradient(135deg, #4a044e 0%, #1e1b4b 100%)"
						/>
					</div>
				</div>
			</div>

			{/* ── Public Realms ──────────────────────────────────────────── */}
			<div
				className="grid grid-cols-1 sm:grid-cols-2"
				style={{ gap: 24, alignItems: 'center', padding: '12px 0' }}
			>
				<div>
					<div
						style={{
							fontSize: 11,
							textTransform: 'uppercase',
							letterSpacing: '2.4px',
							color: 'var(--accent)',
							marginBottom: 6,
							fontWeight: 600,
						}}
					>
						Public Realms
					</div>
					<h2 style={{ fontSize: 28, fontWeight: 500, color: '#fff', letterSpacing: '-0.3px', marginBottom: 12 }}>
						Find your next adventure.
					</h2>
					<p
						style={{
							color: 'var(--text-dim)',
							fontSize: 14,
							lineHeight: 1.65,
							marginBottom: 22,
							maxWidth: 460,
						}}
					>
						Over a thousand active campaigns wait for new heroes. Filter by system,
						tone, or open seats — then ride out at dawn.
					</p>
					<div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
						<button style={btnPrimary} onClick={() => navigate('/campaigns')}>
							Browse Campaigns <HiArrowRight size={13} />
						</button>
						<button style={btnGhost} onClick={() => navigate('/my-campaigns')}>
							+ Host one
						</button>
					</div>
				</div>
				<CodexTile
					to="/campaigns"
					label="Browse Public Campaigns"
					sub="1,284 active worlds"
					eyebrow="Live now"
					gradient="linear-gradient(135deg, #581c87 0%, #4338ca 100%)"
					centered
					minHeight={220}
				/>
			</div>

			{/* ── Tools ──────────────────────────────────────────────────── */}
			<div>
				<div style={{ marginBottom: 14, padding: '0 4px' }}>
					<div
						style={{
							fontSize: 11,
							textTransform: 'uppercase',
							letterSpacing: '2.4px',
							color: 'var(--accent)',
							marginBottom: 6,
							fontWeight: 600,
						}}
					>
						Tools
					</div>
					<h2 style={{ fontSize: 24, fontWeight: 500, color: '#fff', margin: 0 }}>
						Quick Access
					</h2>
				</div>
				<div className="grid grid-cols-2 sm:grid-cols-4" style={{ gap: 12 }}>
					<ToolCard
						to="/characters"
						icon={HiUsers}
						iconColor="var(--accent)"
						iconBg="linear-gradient(135deg, rgba(168,85,247,0.2), rgba(99,102,241,0.1))"
						label="Character List"
						meta="12 saved heroes"
					/>
					<ToolCard
						to="/tools/dice"
						icon={HiViewGrid}
						iconColor="#60a5fa"
						iconBg="linear-gradient(135deg, rgba(96,165,250,0.2), rgba(59,130,246,0.1))"
						label="Dice Calculator"
						meta="d4 · d6 · d20"
					/>
					<ToolCard
						to="/tools/loot"
						icon={HiGift}
						iconColor="var(--gold)"
						iconBg="linear-gradient(135deg, rgba(233,185,107,0.2), rgba(180,130,50,0.1))"
						label="Loot Generator"
						meta="Treasure tables"
					/>
					<ToolCard
						to="/patreon"
						icon={HiHeart}
						iconColor="#f9a8d4"
						iconBg="linear-gradient(135deg, rgba(233,30,99,0.2), rgba(233,185,107,0.15))"
						label="Support on Patreon"
						meta="Become a Patron"
						external
					/>
				</div>
			</div>
		</div>
	)
}
