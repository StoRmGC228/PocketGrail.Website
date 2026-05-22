import './CatalogSpellCard.css'
import type { CatalogSpellDto } from '../../../../types/character'

const SCHOOL_COLORS: Record<string, string> = {
	Abjuration: '#3b82f6',
	Conjuration: '#f59e0b',
	Divination: '#22c55e',
	Enchantment: '#ec4899',
	Evocation: '#ef4444',
	Illusion: '#a855f7',
	Necromancy: '#6b7280',
	Transmutation: '#14b8a6',
}

const LEVEL_LABELS: Record<number, string> = {
	0: 'Cantrip',
	1: '1st',
	2: '2nd',
	3: '3rd',
	4: '4th',
	5: '5th',
	6: '6th',
	7: '7th',
	8: '8th',
	9: '9th',
}

interface CatalogSpellCardProps {
	spell: CatalogSpellDto
	onClick: (spell: CatalogSpellDto) => void
	isAdding: boolean
}

export const CatalogSpellCard = ({ spell, onClick, isAdding }: CatalogSpellCardProps) => {
	const schoolColor = spell.school ? (SCHOOL_COLORS[spell.school] ?? '#9a8fb8') : '#9a8fb8'

	return (
		<button className='csc' onClick={() => onClick(spell)} disabled={isAdding} type='button'>
			<div className='csc__header'>
				<span className='csc__school-dot' style={{ background: schoolColor }} />
				<span className='csc__name'>{spell.name}</span>
				<div className='csc__badges'>
					<span className='csc__badge csc__badge--level'>
						{LEVEL_LABELS[spell.level] ?? `${spell.level}th`}
					</span>
					{spell.school && <span className='csc__badge'>{spell.school}</span>}
					{spell.concentration && <span className='csc__badge csc__badge--conc'>C</span>}
					{spell.isRitual && <span className='csc__badge csc__badge--ritual'>R</span>}
				</div>
			</div>
			{(spell.castingTime || spell.range) && (
				<p className='csc__meta'>
					{[spell.castingTime, spell.range].filter(Boolean).join(' · ')}
				</p>
			)}
		</button>
	)
}
