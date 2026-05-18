import { useState } from 'react'
import './SpellsSection.css'
import type { CharacterDetailDto, SpellDto } from '../../../types/character'
import {
	useDeleteSpellMutation,
	useToggleSpellPreparedMutation,
	useUpdateSpellSlotMutation,
} from '../../../api/characterApi'

interface SpellsSectionProps {
	character: CharacterDetailDto
	onAddSpell: () => void
}


function SpellLevelGroup({
	level,
	spells,
	characterId,
	slotTotal,
	slotRemaining,
	onToggleSlot,
}: {
	level: number
	spells: SpellDto[]
	characterId: number
	slotTotal: number
	slotRemaining: number
	onToggleSlot?: (remaining: number) => void
}) {
	const [open, setOpen] = useState(true)
	const [deleteSpell] = useDeleteSpellMutation()
	const [togglePrepared] = useToggleSpellPreparedMutation()

	return (
		<div className='ch-spelllv'>
			<div className='ch-spelllv-head' onClick={() => setOpen(!open)}>
				<span className='ch-spelllv-title'>
					{level === 0 ? 'Cantrips' : `Level ${level}`}
				</span>

				{level > 0 && slotTotal > 0 && (
					<div className='ch-slots' onClick={e => e.stopPropagation()}>
						{Array.from({ length: slotTotal }, (_, i) => (
							<button
								key={i}
								className={`ch-slot${i < slotRemaining ? ' used' : ''}`}
								title={i < slotRemaining ? 'Slot used' : 'Slot available'}
								onClick={() => onToggleSlot?.(i < slotRemaining ? i : i + 1)}
							/>
						))}
					</div>
				)}

				<span className='ch-spelllv-count'>{spells.length}</span>
				<svg
					className={`ch-spell-chevron${open ? ' open' : ''}`}
					width='13'
					height='13'
					viewBox='0 0 24 24'
					fill='none'
					stroke='currentColor'
					strokeWidth='2.2'
					strokeLinecap='round'
				>
					<path d='M6 9l6 6 6-6' />
				</svg>
			</div>

			{open && (
				<div className='ch-spelllv-grid'>
					{spells.map(spell => (
						<div key={spell.id} className={`ch-spell${spell.prepared ? ' prep' : ''}`}>
							<div className='ch-spell-head'>
								{level > 0 && (
									<button
										className={`ch-prep-toggle${spell.prepared ? ' active' : ''}`}
										title={spell.prepared ? 'Unprepare' : 'Prepare'}
										onClick={() => togglePrepared({ characterId, spellId: spell.id })}
									>
										<svg width='10' height='10' viewBox='0 0 24 24' fill={spell.prepared ? 'currentColor' : 'none'} stroke='currentColor' strokeWidth='2' strokeLinecap='round'>
											<path d='M12 2 4 5v6c0 5 3.5 9.5 8 11 4.5-1.5 8-6 8-11V5z' />
										</svg>
									</button>
								)}
								<span className='ch-spell-name'>{spell.name}</span>
								<div className='ch-spell-flags'>
									{spell.concentration && <span className='ch-spell-flag' title='Concentration'>C</span>}
									{spell.isRitual && <span className='ch-spell-flag' title='Ritual'>R</span>}
								</div>
								<button
									className='ch-del-btn'
									onClick={() => deleteSpell({ characterId, spellId: spell.id })}
									aria-label={`Delete ${spell.name}`}
								>
									<svg width='11' height='11' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.4' strokeLinecap='round'>
										<path d='M6 6 18 18M6 18 18 6' />
									</svg>
								</button>
							</div>
							<div className='ch-spell-meta'>
								{spell.school && <span>{spell.school}</span>}
								{spell.range && <span>{spell.range}</span>}
								{spell.castingTime && <span>{spell.castingTime}</span>}
								{spell.components && <span>{spell.components}</span>}
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	)
}

export const SpellsSection = ({ character, onAddSpell }: SpellsSectionProps) => {
	const [updateSpellSlot] = useUpdateSpellSlotMutation()

	// Group spells by level
	const spellsByLevel: Record<number, SpellDto[]> = {}
	for (const spell of character.spells) {
		if (!spellsByLevel[spell.level]) spellsByLevel[spell.level] = []
		spellsByLevel[spell.level].push(spell)
	}

	const spellLevels = Object.keys(spellsByLevel)
		.map(Number)
		.sort((a, b) => a - b)

	const getSlotInfo = (level: number) => {
		const slot = character.spellSlots.find(s => s.slotLevel === level)
		return { total: slot?.totalSlots ?? 0, remaining: slot?.remainingSlots ?? 0 }
	}

	return (
		<div className='ch-sec ch-spells'>
			<div className='ch-sec-head'>
				<h3>Spells</h3>
				<button className='ch-add-btn' onClick={onAddSpell}>
					<svg width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.5' strokeLinecap='round'>
						<path d='M12 5v14M5 12h14' />
					</svg>
					Add Spell
				</button>
			</div>


			{character.spells.length === 0 ? (
				<div className='ch-empty'>No spells added yet.</div>
			) : (
				<div className='ch-spells-body'>
					{spellLevels.map(level => {
						const { total, remaining } = getSlotInfo(level)
						return (
							<SpellLevelGroup
								key={level}
								level={level}
								spells={spellsByLevel[level]}
								characterId={character.id}
								slotTotal={total}
								slotRemaining={remaining}
								onToggleSlot={remaining => updateSpellSlot({ characterId: character.id, slotLevel: level, remainingSlots: remaining })}
							/>
						)
					})}
				</div>
			)}
		</div>
	)
}
