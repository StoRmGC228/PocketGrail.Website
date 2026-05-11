import './CampaignCard.css'
import { useState } from 'react'
import { HiUsers, HiClipboard, HiLink, HiTrash, HiCheck } from 'react-icons/hi'
import type { CampaignDto } from '../../../types/campaign'

const ART_GRADIENTS = [
	'linear-gradient(135deg,#1e1b4b,#4c1d95 50%,#831843)',
	'linear-gradient(135deg,#7c2d12,#831843 60%,#1e1b4b)',
	'linear-gradient(135deg,#0c4a6e,#1e1b4b 60%,#4c1d95)',
	'linear-gradient(135deg,#312e81,#6d28d9)',
	'linear-gradient(135deg,#4a044e,#1e1b4b)',
	'linear-gradient(135deg,#581c87,#4338ca)',
]

const ShieldGlyph = () => (
	<svg
		width="48" height="48" viewBox="0 0 24 24" fill="none"
		stroke="rgba(255,255,255,0.22)" strokeWidth="1.2"
		strokeLinecap="round" strokeLinejoin="round"
		style={{ position: 'relative', zIndex: 1 }}
	>
		<path d="M12 2 4 5v6c0 5 3.5 9.5 8 11 4.5-1.5 8-6 8-11V5z"/>
	</svg>
)

interface CampaignCardProps {
	campaign: CampaignDto
	onClick?: () => void
	showCode?: boolean
	isOwner?: boolean
	onDelete?: () => void
	joined?: boolean
}

export const CampaignCard = ({
	campaign,
	onClick,
	showCode = false,
	isOwner = false,
	onDelete,
	joined = false,
}: CampaignCardProps) => {
	const [copied, setCopied] = useState<'code' | 'link' | null>(null)

	const artGradient = ART_GRADIENTS[campaign.id % ART_GRADIENTS.length]
	const artStyle = campaign.imageUrl
		? { backgroundImage: `url(${campaign.imageUrl})`, backgroundSize: 'cover' as const, backgroundPosition: 'center' }
		: { background: artGradient }

	const copyCode = (e: React.MouseEvent) => {
		e.stopPropagation()
		navigator.clipboard.writeText(campaign.connectionCode)
		setCopied('code')
		setTimeout(() => setCopied(null), 1400)
	}

	const copyLink = (e: React.MouseEvent) => {
		e.stopPropagation()
		navigator.clipboard.writeText(`${window.location.origin}/join/${campaign.connectionCode}`)
		setCopied('link')
		setTimeout(() => setCopied(null), 1400)
	}

	const handleDelete = (e: React.MouseEvent) => {
		e.stopPropagation()
		if (window.confirm(`Delete campaign "${campaign.name}"? This cannot be undone.`)) {
			onDelete?.()
		}
	}

	const dataAttrs: Record<string, string> = {}
	if (joined) dataAttrs['data-joined'] = ''
	if (isOwner) dataAttrs['data-owner'] = ''

	return (
		<div onClick={onClick} className="cc" {...dataAttrs}>
			{/* Art */}
			<div className="cc-art" style={artStyle}>
				{!campaign.imageUrl && <div className="cc-art-grain" />}
				{!campaign.imageUrl && <ShieldGlyph />}
				<div className="cc-art-scrim" />
				{campaign.isActive && (
					<div className="cc-live">
						<span className="cc-live-dot" />
						Live
					</div>
				)}
				{joined && !isOwner && <div className="cc-pin cc-pin-joined">Joined</div>}
				{isOwner && <div className="cc-pin cc-pin-owner">Your Realm</div>}
			</div>

			{/* Body */}
			<div className="cc-body">
				<h3 className="cc-name">{campaign.name}</h3>
				{campaign.shortDescription && (
					<p className="cc-desc">{campaign.shortDescription}</p>
				)}

				<div className="cc-dm">
					<div className="cc-avatar">
						{(campaign.dmOwnerUsername?.[0] ?? 'D').toUpperCase()}
					</div>
					<div className="cc-dm-text">
						<div className="cc-dm-label">Dungeon Master</div>
						<div className="cc-dm-name">{campaign.dmOwnerUsername}</div>
					</div>
				</div>

				<div className="cc-stats">
					<div className="cc-stat">
						<HiUsers size={13} />
						<span>
							<b>{campaign.participantCount}</b>
							<span className="cc-stat-lbl"> players</span>
						</span>
					</div>
				</div>

				{(showCode || isOwner) && campaign.connectionCode && (
					<div className="cc-code" onClick={e => e.stopPropagation()}>
						<span className="cc-code-label">Code</span>
						<span className="cc-code-val">{campaign.connectionCode}</span>
						<button className="cc-code-btn" title="Copy code" onClick={copyCode}>
							{copied === 'code' ? <HiCheck size={13} /> : <HiClipboard size={13} />}
						</button>
						<button className="cc-code-btn" title="Copy invite link" onClick={copyLink}>
							{copied === 'link' ? <HiCheck size={13} /> : <HiLink size={13} />}
						</button>
					</div>
				)}

				<div className="cc-cta-row">
					{joined ? (
						<span className="cc-btn cc-btn-primary">
							<svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
								<path d="m6 4 14 8-14 8z"/>
							</svg>
							Continue
						</span>
					) : isOwner ? (
						<span className="cc-btn cc-btn-primary">
							<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
								<circle cx="12" cy="12" r="9"/><path d="m16 8-2 6-6 2 2-6z"/>
							</svg>
							Open Realm
						</span>
					) : (
						<span className="cc-btn cc-btn-ghost">
							View · Join
							<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
								<path d="M5 12h14M13 5l7 7-7 7"/>
							</svg>
						</span>
					)}
					{isOwner && (
						<button
							className="cc-iconbtn cc-danger"
							title="Delete campaign"
							onClick={handleDelete}
						>
							<HiTrash size={13} />
						</button>
					)}
				</div>
			</div>
		</div>
	)
}
