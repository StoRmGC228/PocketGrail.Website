import './FeatsSection.css'
import type { CharacterDetailDto } from '../../../types/character'
import { useDeleteFeatMutation } from '../../../api/characterApi'

interface FeatsSectionProps {
	character: CharacterDetailDto
	onAddFeat: () => void
}

export const FeatsSection = ({ character, onAddFeat }: FeatsSectionProps) => {
	const [deleteFeat] = useDeleteFeatMutation()

	return (
		<div className='ch-sec'>
			<div className='ch-sec-head'>
				<h3>Feats</h3>
				<button className='ch-add-btn' onClick={onAddFeat}>
					<svg width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.5' strokeLinecap='round'>
						<path d='M12 5v14M5 12h14' />
					</svg>
					Add Feat
				</button>
			</div>

			{character.feats.length === 0 ? (
				<div className='ch-empty'>No feats added yet.</div>
			) : (
				<div className='ch-feats-grid'>
					{character.feats.map(feat => (
						<div key={feat.id} className='ch-featcard'>
							<div className='ch-featcard-head'>
								<h4>{feat.name}</h4>
								<button
									className='ch-del-btn'
									onClick={() => deleteFeat({ characterId: character.id, featId: feat.id })}
									aria-label={`Delete ${feat.name}`}
								>
									<svg width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.4' strokeLinecap='round'>
										<path d='M6 6 18 18M6 18 18 6' />
									</svg>
								</button>
							</div>
							{feat.requirement && (
								<div className='ch-featcard-req'>{feat.requirement}</div>
							)}
							{feat.description && (
								<div className='ch-featcard-desc'>{feat.description}</div>
							)}
						</div>
					))}
				</div>
			)}
		</div>
	)
}
