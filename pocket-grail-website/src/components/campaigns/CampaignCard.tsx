import { HiClipboard, HiLink, HiTrash } from 'react-icons/hi'
import type { CampaignDto } from '../../types/campaign'

interface CampaignCardProps {
	campaign: CampaignDto
	onClick?: () => void
	showCode?: boolean
	isOwner?: boolean
	onDelete?: () => void
}

export const CampaignCard = ({
	campaign,
	onClick,
	showCode = false,
	isOwner = false,
	onDelete,
}: CampaignCardProps) => {
	const handleCopyCode = (e: React.MouseEvent) => {
		e.stopPropagation()
		navigator.clipboard.writeText(campaign.connectionCode)
	}

	const handleCopyLink = (e: React.MouseEvent) => {
		e.stopPropagation()
		navigator.clipboard.writeText(`${window.location.origin}/join/${campaign.connectionCode}`)
	}

	const handleDelete = (e: React.MouseEvent) => {
		e.stopPropagation()
		if (window.confirm(`Delete campaign "${campaign.name}"? This cannot be undone.`)) {
			onDelete?.()
		}
	}

	return (
		<div
			onClick={onClick}
			className={`bg-white/5 border border-white/10 rounded-2xl overflow-hidden transition-all ${onClick ? 'cursor-pointer hover:bg-white/8 hover:border-white/20' : ''}`}
		>
			{/* Image */}
			<div className='h-36 w-full bg-gray-800 relative'>
				{campaign.imageUrl ? (
					<img
						src={campaign.imageUrl}
						alt={campaign.name}
						className='w-full h-full object-cover'
					/>
				) : (
					<div className='w-full h-full flex items-center justify-center text-white/20 text-4xl'>
						⚔️
					</div>
				)}
			</div>

			<div className='p-4 flex flex-col gap-2'>
				<h3 className='text-white font-semibold text-base leading-tight'>{campaign.name}</h3>
				<p className='text-white/50 text-xs line-clamp-2'>{campaign.shortDescription}</p>

				<div className='flex items-center justify-between text-white/40 text-xs mt-1'>
					<span>DM: {campaign.dmOwnerUsername}</span>
					<span>{campaign.participantCount} participants</span>
				</div>

				{showCode && (
					<div className='mt-2 flex flex-col gap-2'>
						<div className='flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2'>
							<span className='text-white/70 text-xs font-mono tracking-widest flex-1'>
								{campaign.connectionCode}
							</span>
							<button
								onClick={handleCopyCode}
								className='text-white/40 hover:text-white transition-colors cursor-pointer'
								title='Copy code'
							>
								<HiClipboard size={16} />
							</button>
							<button
								onClick={handleCopyLink}
								className='text-white/40 hover:text-white transition-colors cursor-pointer'
								title='Copy share link'
							>
								<HiLink size={16} />
							</button>
						</div>
					</div>
				)}

				{isOwner && (
					<button
						onClick={handleDelete}
						className='mt-1 flex items-center gap-1 text-red-400 hover:text-red-300 text-xs transition-colors self-end cursor-pointer'
					>
						<HiTrash size={14} />
						Delete
					</button>
				)}
			</div>
		</div>
	)
}
