import './CampaignPage.css'
import '../../components/campaigns/campaign-layout.css'
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectUser } from '../../redux/slices/authSlice'
import { useGetCampaignByIdQuery, useLeaveCampaignMutation } from '../../api/campaignApi'
import { ParticipantCard } from '../../components/campaigns/participant-card/ParticipantCard'
import { HiUsers, HiClipboard, HiLink, HiCheck, HiX, HiArrowLeft } from 'react-icons/hi'

const ART_GRADIENTS = [
	'linear-gradient(135deg,#1e1b4b,#4c1d95 50%,#831843)',
	'linear-gradient(135deg,#7c2d12,#831843 60%,#1e1b4b)',
	'linear-gradient(135deg,#0c4a6e,#1e1b4b 60%,#4c1d95)',
	'linear-gradient(135deg,#312e81,#6d28d9)',
	'linear-gradient(135deg,#4a044e,#1e1b4b)',
	'linear-gradient(135deg,#581c87,#4338ca)',
]

const MaximizeIcon = () => (
	<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
		<path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
	</svg>
)

export const CampaignPage = () => {
	const { id } = useParams<{ id: string }>()
	const campaignId = id ? parseInt(id, 10) : 0
	const { data: campaign, isLoading, isError } = useGetCampaignByIdQuery(campaignId, { skip: !campaignId })
	const [leaveCampaign, { isLoading: isLeaving }] = useLeaveCampaignMutation()
	const navigate = useNavigate()
	const user = useSelector(selectUser)
	const currentUserId = user ? parseInt(user.userId, 10) : 0

	const [zoomed, setZoomed] = useState(false)
	const [copied, setCopied] = useState<'code' | 'link' | null>(null)

	const isOwner = campaign?.dmOwnerId === currentUserId
	const isParticipant = campaign?.participants.some(p => p.userId === currentUserId) ?? false
	const canLeave = isParticipant && !isOwner

	useEffect(() => {
		if (!zoomed) return
		const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setZoomed(false) }
		window.addEventListener('keydown', onKey)
		return () => window.removeEventListener('keydown', onKey)
	}, [zoomed])

	const handleLeave = async () => {
		if (!campaign) return
		if (!window.confirm(`Leave "${campaign.name}"? You will need to rejoin to access this campaign again.`)) return
		try {
			await leaveCampaign(campaign.id).unwrap()
			navigate('/campaigns')
		} catch {
			// error surfaced via middleware
		}
	}

	const copyCode = () => {
		if (!campaign) return
		navigator.clipboard.writeText(campaign.connectionCode)
		setCopied('code')
		setTimeout(() => setCopied(null), 1400)
	}

	const copyLink = () => {
		if (!campaign) return
		navigator.clipboard.writeText(`${window.location.origin}/join/${campaign.connectionCode}`)
		setCopied('link')
		setTimeout(() => setCopied(null), 1400)
	}

	if (isLoading) {
		return (
			<div className='flex items-center justify-center py-20'>
				<p className='text-white/50 text-sm'>Loading…</p>
			</div>
		)
	}

	if (isError || !campaign) {
		return (
			<div className='flex items-center justify-center py-20'>
				<p className='text-white/40 text-sm'>Campaign not found.</p>
			</div>
		)
	}

	const dmParticipants = campaign.participants.filter(p => p.role === 'DungeonMaster')
	const playerParticipants = campaign.participants.filter(p => p.role === 'Player')

	const artGradient = ART_GRADIENTS[campaign.id % ART_GRADIENTS.length]
	const artStyle = campaign.imageUrl
		? { backgroundImage: `url(${campaign.imageUrl})`, backgroundSize: 'cover' as const, backgroundPosition: 'center' }
		: { background: artGradient }

	const createdDate = new Date(campaign.createdAt).toLocaleDateString('en-US', {
		month: 'short', day: 'numeric', year: 'numeric',
	})

	return (
		<div className='px-4 py-4 sm:px-6 sm:py-6 max-w-6xl mx-auto flex flex-col gap-4 sm:gap-6'>

			{/* 3-column hero */}
			<section className='cd-hero'>
				{/* Art column */}
				<div
					className='cd-hero-art'
					style={artStyle}
					onClick={() => setZoomed(true)}
				>
					<div className='cd-hero-grain' />
					<div className='cd-hero-scrim' />
					<button
						className='cd-hero-zoom'
						onClick={e => { e.stopPropagation(); setZoomed(true) }}
						title='View full image'
					>
						<MaximizeIcon />
					</button>
				</div>

				{/* Content column */}
				<div className='cd-hero-content'>
					<div className='vA-eyebrow'>
						{campaign.isActive ? '● Live' : 'Campaign'}
					</div>
					<h1 className='cd-hero-title'>{campaign.name}</h1>
					<p className='cd-hero-desc'>{campaign.shortDescription}</p>
					<div className='cd-hero-meta'>
						<span>
							<HiUsers size={13} />
							{campaign.participantCount} participant{campaign.participantCount !== 1 ? 's' : ''}
						</span>
						<span>Created {createdDate}</span>
					</div>
					<div className='cd-hero-cta'>
						{canLeave && (
							<button
								onClick={handleLeave}
								disabled={isLeaving}
								className='page-btn-ghost'
								style={{ color: '#f87171', borderColor: 'rgba(248,113,113,0.3)' }}
							>
								{isLeaving ? 'Leaving…' : 'Leave Campaign'}
							</button>
						)}
						<button
							onClick={() => navigate('/campaigns')}
							className='page-btn-ghost'
						>
							<HiArrowLeft size={14} /> Back
						</button>
					</div>
				</div>

				{/* Side column */}
				<div className='cd-hero-side'>
					<div className='cd-hero-dm'>
						<div
							className='cd-avatar'
							style={{ width: 38, height: 38, fontSize: 14 }}
						>
							{campaign.dmOwnerUsername[0].toUpperCase()}
						</div>
						<div>
							<div className='cd-dm-label'>Dungeon Master</div>
							<div className='cd-dm-name'>{campaign.dmOwnerUsername}</div>
						</div>
					</div>

					{isOwner && (
						<div className='cd-code-card'>
							<div className='cd-code-row'>
								<div>
									<div className='cd-dm-label'>Connection Code</div>
									<div className='cd-code-big'>{campaign.connectionCode}</div>
								</div>
								<div className='cd-code-actions'>
									<button
										className='cc-code-btn'
										title='Copy code'
										onClick={copyCode}
									>
										{copied === 'code' ? <HiCheck size={13} /> : <HiClipboard size={13} />}
									</button>
									<button
										className='cc-code-btn'
										title='Copy invite link'
										onClick={copyLink}
									>
										{copied === 'link' ? <HiCheck size={13} /> : <HiLink size={13} />}
									</button>
								</div>
							</div>
						</div>
					)}
				</div>
			</section>

			{/* Lightbox */}
			{zoomed && (
				<div className='cd-lightbox' onClick={() => setZoomed(false)}>
					<button
						className='cd-lightbox-close'
						onClick={() => setZoomed(false)}
						title='Close (Esc)'
					>
						<HiX size={18} />
					</button>
					<div
						className='cd-lightbox-frame'
						onClick={e => e.stopPropagation()}
					>
						<div className='cd-lightbox-art' style={artStyle}>
							<div className='cd-hero-grain' />
						</div>
					</div>
				</div>
			)}

			{/* Party & info grid */}
			<div className='cd-grid'>
				{/* Party panel */}
				<section className='cd-panel'>
					{dmParticipants.length > 0 && (
						<>
							<div className='vA-eyebrow'>Dungeon Master</div>
							<div className='cd-party'>
								{dmParticipants.map(p => (
									<ParticipantCard key={p.userId} participant={p} />
								))}
							</div>
						</>
					)}

					<div className='vA-eyebrow' style={{ marginTop: dmParticipants.length > 0 ? 18 : 0 }}>
						Players · {playerParticipants.length}
					</div>
					<div className='cd-party'>
						{playerParticipants.length > 0
							? playerParticipants.map(p => (
								<ParticipantCard key={p.userId} participant={p} />
							))
							: <p className='cd-panel-text'>No players yet.</p>
						}
					</div>
				</section>

				{/* Campaign info panel */}
				<section className='cd-panel'>
					<div className='vA-eyebrow'>Campaign Info</div>
					<div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 8 }}>
						<div className='cd-stat-chip'>
							<HiUsers size={16} />
							<span><b>{campaign.participantCount}</b><span style={{ fontSize: 11, color: 'var(--text-faint)', marginLeft: 4 }}>heroes</span></span>
						</div>
						{campaign.isActive && (
							<div className='cd-stat-chip' style={{ borderColor: 'rgba(233,185,107,0.3)' }}>
								<span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--gold)', boxShadow: '0 0 6px var(--gold)', display: 'inline-block' }} />
								<span style={{ color: 'var(--gold)', fontWeight: 600, fontSize: 12 }}>Active</span>
							</div>
						)}
					</div>
					<p className='cd-panel-text' style={{ marginTop: 12 }}>
						Created {createdDate}
					</p>
				</section>
			</div>
		</div>
	)
}
