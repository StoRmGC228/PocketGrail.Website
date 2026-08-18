import './RaceChoicesModal.css'
import { useState } from 'react'
import type { RaceDto, CreateCharacterFormValues } from '../../../types/character'

type FlexBonuses = Pick<CreateCharacterFormValues,
	'flexStrBonus' | 'flexDexBonus' | 'flexConBonus' | 'flexIntBonus' | 'flexWisBonus' | 'flexChaBonus'>

interface RaceChoicesModalProps {
	race: RaceDto
	onConfirm: (bonuses: FlexBonuses) => void
	onBack: () => void
}

const STAT_KEYS = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'] as const
type StatKey = typeof STAT_KEYS[number]

const statToField: Record<StatKey, keyof FlexBonuses> = {
	STR: 'flexStrBonus',
	DEX: 'flexDexBonus',
	CON: 'flexConBonus',
	INT: 'flexIntBonus',
	WIS: 'flexWisBonus',
	CHA: 'flexChaBonus',
}

export const RaceChoicesModal = ({ race, onConfirm, onBack }: RaceChoicesModalProps) => {
	// Each slot picks one stat; null means unselected
	const [selections, setSelections] = useState<(StatKey | null)[]>(
		() => race.flexBonusSlots.map(() => null)
	)

	const pickedStats = selections.filter(Boolean) as StatKey[]

	const allResolved = selections.every(s => s !== null)

	const handleConfirm = () => {
		if (!allResolved) return
		const bonuses: FlexBonuses = {
			flexStrBonus: 0, flexDexBonus: 0, flexConBonus: 0,
			flexIntBonus: 0, flexWisBonus: 0, flexChaBonus: 0,
		}
		selections.forEach((stat, i) => {
			if (stat) bonuses[statToField[stat]] += race.flexBonusSlots[i]
		})
		onConfirm(bonuses)
	}

	return (
		<div className="rst-modal-backdrop">
			<div className="rst-modal" onMouseDown={e => e.stopPropagation()}>
				<div>
					<div className="rst-modal-eyebrow">Race Bonus</div>
					<h2>Distribute your bonus points</h2>
				</div>
				<p>
					<b>{race.name}</b> grants flexible ability bonuses.
					Assign each bonus to a different ability score.
				</p>

				<div className="rcm-slots">
					{race.flexBonusSlots.map((slotSize, i) => {
						const selected = selections[i]
						return (
							<div key={i} className="rcm-slot">
								<span className="rcm-slot-badge">+{slotSize}</span>
								<select
									className="rcm-slot-select"
									value={selected ?? ''}
									onChange={e => {
										const v = e.target.value as StatKey | ''
										setSelections(prev => {
											const next = [...prev]
											next[i] = v || null
											return next
										})
									}}
								>
									<option value="">Choose stat…</option>
									{STAT_KEYS.map(stat => (
										<option
											key={stat}
											value={stat}
											disabled={pickedStats.includes(stat) && stat !== selected}
										>
											{stat}
										</option>
									))}
								</select>
							</div>
						)
					})}
				</div>

				<div className="rcm-summary">
					{STAT_KEYS.map(stat => {
						const total = selections.reduce<number>((acc, sel, i) =>
							sel === stat ? acc + race.flexBonusSlots[i] : acc, 0)
						return total > 0 ? (
							<span key={stat} className="rcm-summary-chip">
								{stat} +{total}
							</span>
						) : null
					})}
					{!allResolved && (
						<span className="rcm-summary-hint">
							{selections.filter(s => s === null).length} slot{selections.filter(s => s === null).length !== 1 ? 's' : ''} remaining
						</span>
					)}
				</div>

				<div className="rst-modal-actions">
					<button type="button" className="rst-modal-btn rst-modal-btn-ghost" onClick={onBack}>
						Back
					</button>
					<button
						type="button"
						className="rst-modal-btn rst-modal-btn-primary"
						disabled={!allResolved}
						onClick={handleConfirm}
					>
						<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
							<path d="M5 12h14M12 5l7 7-7 7"/>
						</svg>
						Next
					</button>
				</div>
			</div>
		</div>
	)
}
