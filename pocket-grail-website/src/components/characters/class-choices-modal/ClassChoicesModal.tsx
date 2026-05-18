import './ClassChoicesModal.css'
import { useState } from 'react'
import type { ClassDto, ClassStartingItemSetDto, StartingItemDto } from '../../../types/character'

interface ClassChoicesModalProps {
	cls: ClassDto
	startingItems: ClassStartingItemSetDto
	onConfirm: (choices: { skillChoices: string[]; startingItemIds: number[] }) => void
	onBack: () => void
	isSubmitting: boolean
}

export const ClassChoicesModal = ({
	cls, startingItems, onConfirm, onBack, isSubmitting,
}: ClassChoicesModalProps) => {
	const [selectedSkills, setSelectedSkills] = useState<string[]>([])
	// pairSelections[pairIndex] = 'A' | 'B' | null
	const [pairSelections, setPairSelections] = useState<('A' | 'B' | null)[]>(
		() => startingItems.choicePairs.map(() => null)
	)

	const availableSkills = cls.availableSkillChoices ?? []
	const effectiveSkillCount = Math.min(cls.skillChoiceCount, availableSkills.length)
	const skillsFull = selectedSkills.length >= effectiveSkillCount
	const allPairsResolved = pairSelections.every(s => s !== null)
	const canConfirm = selectedSkills.length === effectiveSkillCount && allPairsResolved

	const toggleSkill = (skill: string) => {
		setSelectedSkills(prev => {
			if (prev.includes(skill)) return prev.filter(s => s !== skill)
			if (prev.length >= effectiveSkillCount) return prev
			return [...prev, skill]
		})
	}

	const selectPair = (pairIdx: number, option: 'A' | 'B') => {
		setPairSelections(prev => {
			const next = [...prev]
			next[pairIdx] = option
			return next
		})
	}

	const handleConfirm = () => {
		if (!canConfirm) return
		const itemIds: number[] = []
		pairSelections.forEach((sel, i) => {
			const pair = startingItems.choicePairs[i]
			const items: StartingItemDto[] = sel === 'A' ? pair.optionA : pair.optionB
			items.forEach(item => itemIds.push(item.id))
		})
		onConfirm({ skillChoices: selectedSkills, startingItemIds: itemIds })
	}

	const showSkills = effectiveSkillCount > 0
	const showItems = startingItems.choicePairs.length > 0

	return (
		<div className="rst-modal-backdrop">
			<div className="rst-modal ccm-cls-modal" onMouseDown={e => e.stopPropagation()}>
				<div>
					<div className="rst-modal-eyebrow">Class Choices</div>
					<h2>{cls.name} setup</h2>
				</div>

				{showSkills && (
					<section className="ccm-cls-section">
						<div className="ccm-cls-section-header">
							<span>Choose {effectiveSkillCount} skill{effectiveSkillCount !== 1 ? 's' : ''}</span>
							<span className="ccm-cls-counter">
								{selectedSkills.length} / {effectiveSkillCount}
							</span>
						</div>
						<div className="ccm-cls-skill-grid">
							{availableSkills.map(skill => {
								const checked = selectedSkills.includes(skill)
								const disabled = !checked && skillsFull
								const label = skill.replace(/([A-Z])/g, ' $1').trim()
								return (
									<label
										key={skill}
										className={`ccm-cls-skill ${checked ? 'ccm-cls-skill--checked' : ''} ${disabled ? 'ccm-cls-skill--disabled' : ''}`}
									>
										<input
											type="checkbox"
											checked={checked}
											disabled={disabled}
											onChange={() => toggleSkill(skill)}
											className="ccm-cls-skill-input"
										/>
										{label}
									</label>
								)
							})}
						</div>
					</section>
				)}

				{showItems && (
					<section className="ccm-cls-section">
						<div className="ccm-cls-section-header">
							<span>Starting equipment</span>
							<span className="ccm-cls-counter">
								{pairSelections.filter(Boolean).length} / {startingItems.choicePairs.length} resolved
							</span>
						</div>
						<div className="ccm-cls-pairs">
							{startingItems.choicePairs.map((pair, i) => (
								<div key={pair.id} className="ccm-cls-pair">
									<button
										type="button"
										className={`ccm-cls-option ${pairSelections[i] === 'A' ? 'ccm-cls-option--active' : ''}`}
										onClick={() => selectPair(i, 'A')}
									>
										<span className="ccm-cls-option-label">Option A</span>
										<span className="ccm-cls-option-items">
											{pair.optionA.map(it => it.name).join(', ')}
										</span>
									</button>
									<span className="ccm-cls-or">or</span>
									<button
										type="button"
										className={`ccm-cls-option ${pairSelections[i] === 'B' ? 'ccm-cls-option--active' : ''}`}
										onClick={() => selectPair(i, 'B')}
									>
										<span className="ccm-cls-option-label">Option B</span>
										<span className="ccm-cls-option-items">
											{pair.optionB.map(it => it.name).join(', ')}
										</span>
									</button>
								</div>
							))}
						</div>
					</section>
				)}

				<div className="rst-modal-actions">
					<button type="button" className="rst-modal-btn rst-modal-btn-ghost" onClick={onBack}>
						Back
					</button>
					<button
						type="button"
						className="rst-modal-btn rst-modal-btn-primary"
						disabled={!canConfirm || isSubmitting}
						onClick={handleConfirm}
					>
						<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
							<path d="M12 5v14M5 12h14"/>
						</svg>
						{isSubmitting ? 'Creating…' : 'Forge hero'}
					</button>
				</div>
			</div>
		</div>
	)
}
