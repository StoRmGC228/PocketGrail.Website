import type { CampaignParticipantDto } from '../../types/campaign'

interface ParticipantCardProps {
	participant: CampaignParticipantDto
}

export const ParticipantCard = ({ participant }: ParticipantCardProps) => {
	const initial = participant.username.charAt(0).toUpperCase()
	const isDm = participant.role === 'DungeonMaster'

	return (
		<div className='bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-3'>
			<div className='w-9 h-9 rounded-full bg-(--color-nb) flex items-center justify-center text-white font-semibold text-sm shrink-0'>
				{initial}
			</div>
			<div className='flex-1 min-w-0'>
				<p className='text-white text-sm font-medium truncate'>{participant.username}</p>
			</div>
			<span
				className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${
					isDm
						? 'bg-(--color-nb)/20 text-(--color-nb)'
						: 'bg-white/10 text-white/70'
				}`}
			>
				{isDm ? 'Dungeon Master' : 'Player'}
			</span>
		</div>
	)
}
