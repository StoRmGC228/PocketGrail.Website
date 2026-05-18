import './ProficienciesSection.css'
import type { CharacterDetailDto, ProficiencyDto } from '../../../types/character'
import { useDeleteProficiencyMutation } from '../../../api/characterApi'

interface ProficienciesSectionProps {
	character: CharacterDetailDto
	onAddProficiency: () => void
}

const GROUP_LABELS: Record<string, string> = {
	weapon: 'Weapons',
	armor: 'Armor',
	tool: 'Tools',
	language: 'Languages',
	skill: 'Skills',
}

const GROUP_ORDER = ['weapon', 'armor', 'tool', 'language', 'skill']

export const ProficienciesSection = ({ character, onAddProficiency }: ProficienciesSectionProps) => {
	const [deleteProficiency] = useDeleteProficiencyMutation()

	const groups: Record<string, ProficiencyDto[]> = {}
	for (const prof of character.proficiencies) {
		const key = prof.proficiencyType
		if (!groups[key]) groups[key] = []
		groups[key].push(prof)
	}

	const orderedKeys = [
		...GROUP_ORDER.filter(k => groups[k]),
		...Object.keys(groups).filter(k => !GROUP_ORDER.includes(k)),
	]

	return (
		<div className='ch-sec'>
			<div className='ch-sec-head'>
				<h3>Proficiencies</h3>
				<button className='ch-add-btn' onClick={onAddProficiency}>
					<svg width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.5' strokeLinecap='round'>
						<path d='M12 5v14M5 12h14' />
					</svg>
					Add
				</button>
			</div>

			{orderedKeys.length === 0 ? (
				<div className='ch-empty'>No proficiencies added yet.</div>
			) : (
				<div className='ch-prof-body'>
					{orderedKeys.map(key => (
						<div key={key} className='ch-taggroup'>
							<div className='ch-taggroup-head'>
								<span className='ch-taggroup-title'>{GROUP_LABELS[key] ?? key}</span>
							</div>
							<div className='ch-tags'>
								{groups[key].map(prof => (
									<span key={prof.id} className={`ch-tag${prof.hasExpertise ? ' expert' : ''}`}>
										{prof.name}
										{prof.hasExpertise && <em title='Expertise'>★</em>}
										<button
											className='ch-tag-del'
											onClick={() => deleteProficiency({ characterId: character.id, proficiencyId: prof.id })}
											aria-label={`Remove ${prof.name}`}
										>
											<svg width='9' height='9' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.8' strokeLinecap='round'>
												<path d='M6 6 18 18M6 18 18 6' />
											</svg>
										</button>
									</span>
								))}
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	)
}
