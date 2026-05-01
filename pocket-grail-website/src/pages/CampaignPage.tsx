import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectUser } from '../redux/slices/authSlice'
import { useGetCampaignByIdQuery, useLeaveCampaignMutation } from '../api/campaignApi'
import { ParticipantCard } from '../components/campaigns/ParticipantCard'

export const CampaignPage = () => {
	const { id } = useParams<{ id: string }>()
	const campaignId = id ? parseInt(id, 10) : 0
	const { data: campaign, isLoading, isError } = useGetCampaignByIdQuery(campaignId, { skip: !campaignId })
	const [leaveCampaign, { isLoading: isLeaving }] = useLeaveCampaignMutation()
	const navigate = useNavigate()
	const user = useSelector(selectUser)
	const currentUserId = user ? parseInt(user.userId, 10) : 0

	const isOwner = campaign?.dmOwnerId === currentUserId
	const isParticipant = campaign?.participants.some(p => p.userId === currentUserId) ?? false
	const canLeave = isParticipant && !isOwner

	const handleLeave = async () => {
		if (!campaign) return
		if (!window.confirm(`Leave "${campaign.name}"? You will need to rejoin to access this campaign again.`)) return
		try {
			await leaveCampaign(campaign.id).unwrap()
			navigate('/campaigns')
		} catch {
			// error is surfaced via the middleware; just let it be for now
		}
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

	return (
		<div className='max-w-4xl mx-auto pb-10'>
			{/* Hero */}
			<div className='relative h-48 sm:h-64 w-full bg-gray-800 overflow-hidden'>
				{campaign.imageUrl ? (
					<img
						src={campaign.imageUrl}
						alt={campaign.name}
						className='w-full h-full object-cover'
					/>
				) : (
					<div className='w-full h-full flex items-center justify-center text-white/20 text-6xl'>
						⚔️
					</div>
				)}
				<div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent' />
				<div className='absolute bottom-0 left-0 p-6'>
					<h1 className='text-white text-2xl sm:text-3xl font-bold leading-tight'>
						{campaign.name}
					</h1>
				</div>
			</div>

			<div className='p-6'>
				<div className='flex items-start justify-between gap-4 mb-8'>
					<p className='text-white/60 text-sm'>{campaign.shortDescription}</p>

					{canLeave && (
						<button
							onClick={handleLeave}
							disabled={isLeaving}
							className='shrink-0 text-red-400 hover:text-red-300 text-sm font-medium transition-colors disabled:opacity-50 cursor-pointer'
						>
							{isLeaving ? 'Leaving…' : 'Leave Campaign'}
						</button>
					)}
				</div>

				{/* Participants */}
				<div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
					{/* DM column */}
					<div>
						<h2 className='text-white/70 text-xs font-semibold uppercase tracking-wider mb-3'>
							Dungeon Master
						</h2>
						<div className='flex flex-col gap-2'>
							{dmParticipants.length > 0
								? dmParticipants.map(p => (
										<ParticipantCard key={p.userId} participant={p} />
									))
								: <p className='text-white/30 text-sm'>None yet</p>
							}
						</div>
					</div>

					{/* Players column */}
					<div>
						<h2 className='text-white/70 text-xs font-semibold uppercase tracking-wider mb-3'>
							Players
						</h2>
						<div className='flex flex-col gap-2'>
							{playerParticipants.length > 0
								? playerParticipants.map(p => (
										<ParticipantCard key={p.userId} participant={p} />
									))
								: <p className='text-white/30 text-sm'>No players yet.</p>
							}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
