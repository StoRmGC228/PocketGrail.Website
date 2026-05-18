import './AlliesSection.css'
import { useGetAlliesQuery } from '../../../api/characterApi'

interface AlliesSectionProps {
	characterId: number
}

export const AlliesSection = ({ characterId }: AlliesSectionProps) => {
	const { data: allies, isLoading } = useGetAlliesQuery(characterId)

	if (isLoading) return null

	return (
		<div className='ch-sec ch-allies'>
			<div className='ch-sec-head'>
				<h3>Party</h3>
			</div>

			{!allies || allies.length === 0 ? (
				<div className='ch-empty'>
					<p>No party members found. Join a campaign to see your allies here.</p>
				</div>
			) : (
				<div className='ch-party'>
					{allies.map(ally => {
						const hpPct = ally.maxHp > 0 ? Math.max(0, (ally.currentHp / ally.maxHp) * 100) : 0
						const initials = ally.characterName
							.split(' ')
							.map(w => w[0])
							.join('')
							.substring(0, 2)
							.toUpperCase()

						return (
							<div key={ally.characterId} className='ch-party-card'>
								<div className='ch-party-avatar'>
									{ally.imageUrl ? (
										<img src={ally.imageUrl} alt={ally.characterName} />
									) : (
										<span>{initials}</span>
									)}
								</div>
								<div className='ch-party-info'>
									<div className='ch-party-name'>{ally.characterName}</div>
									<div className='ch-party-cls'>{ally.class} · Lv {ally.level}</div>
									<div className='ch-party-hp'>
										<div className='ch-party-hp-bar'>
											<div
												className='ch-party-hp-fill'
												style={{ width: `${hpPct}%` }}
												data-low={hpPct < 35 ? '' : undefined}
											/>
										</div>
										<span className='ch-party-hp-num'>{ally.currentHp}/{ally.maxHp}</span>
									</div>
								</div>
							</div>
						)
					})}
				</div>
			)}
		</div>
	)
}
