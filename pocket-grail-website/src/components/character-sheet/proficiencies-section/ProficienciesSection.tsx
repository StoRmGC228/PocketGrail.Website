import './ProficienciesSection.css'
import type { CharacterDetailDto } from '../../../types/character'

interface ProficienciesSectionProps {
	character: CharacterDetailDto
	onAddProficiency: () => void
}

function TagGroup({ title, items }: { title: string; items: string[] }) {
	if (items.length === 0) return null
	return (
		<div className='ch-taggroup'>
			<div className='ch-taggroup-head'>
				<span className='ch-taggroup-title'>{title}</span>
			</div>
			<div className='ch-tags'>
				{items.map((name, i) => (
					<span key={i} className='ch-tag'>{name}</span>
				))}
			</div>
		</div>
	)
}

export const ProficienciesSection = ({ character, onAddProficiency }: ProficienciesSectionProps) => {
	const hasAny =
		character.weapons.length > 0 ||
		character.armors.length > 0 ||
		character.languages.length > 0 ||
		character.instruments.length > 0 ||
		character.skillProficiencies.length > 0

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

			{!hasAny ? (
				<div className='ch-empty'>No proficiencies yet.</div>
			) : (
				<div className='ch-prof-body'>
					<TagGroup title='Skills' items={character.skillProficiencies.map(s => s.hasExpertise ? `${s.skill} ★` : s.skill)} />
					<TagGroup title='Weapons' items={character.weapons} />
					<TagGroup title='Armor' items={character.armors} />
					<TagGroup title='Languages' items={character.languages} />
					<TagGroup title='Instruments' items={character.instruments} />
				</div>
			)}
		</div>
	)
}
