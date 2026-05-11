import './ParticipantCard.css'
import type { CampaignParticipantDto } from '../../../types/campaign'

interface ParticipantCardProps {
	participant: CampaignParticipantDto
}

export const ParticipantCard = ({ participant }: ParticipantCardProps) => {
	const initial = participant.username.charAt(0).toUpperCase()
	const isDm = participant.role === 'DungeonMaster'

	return (
		<div className={`cd-party-row${isDm ? ' cd-dm-row' : ''}`}>
			<div
				className='cd-avatar'
				style={{
					width: 32,
					height: 32,
					fontSize: 12,
					background: isDm
						? 'linear-gradient(135deg, #e9b96b, #a855f7)'
						: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
				}}
			>
				{initial}
			</div>
			<div>
				<div className='cd-party-name'>{participant.username}</div>
				<div className='cd-party-role'>{isDm ? 'Game Master' : 'Player'}</div>
			</div>
			<span className={`cd-role-pill${isDm ? ' cd-role-dm' : ''}`}>
				{isDm ? 'Dungeon Master' : 'Player'}
			</span>
		</div>
	)
}
