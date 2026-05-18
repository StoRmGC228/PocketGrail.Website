import { useState } from 'react'
import './StatsRail.css'
import type { CharacterDetailDto, UpdateStatsRequest } from '../../../types/character'
import { getAbilityMod, getProfBonus } from '../../../types/character'
import { useUpdateStatsMutation } from '../../../api/characterApi'

interface Ability {
	key: keyof UpdateStatsRequest
	abbr: string
	label: string
	skills: { name: string; key: string }[]
}

const ABILITIES: Ability[] = [
	{
		key: 'strScore',
		abbr: 'STR',
		label: 'Strength',
		skills: [{ name: 'Athletics', key: 'athletics' }],
	},
	{
		key: 'dexScore',
		abbr: 'DEX',
		label: 'Dexterity',
		skills: [
			{ name: 'Acrobatics', key: 'acrobatics' },
			{ name: 'Sleight of Hand', key: 'sleightOfHand' },
			{ name: 'Stealth', key: 'stealth' },
		],
	},
	{
		key: 'conScore',
		abbr: 'CON',
		label: 'Constitution',
		skills: [],
	},
	{
		key: 'intScore',
		abbr: 'INT',
		label: 'Intelligence',
		skills: [
			{ name: 'Arcana', key: 'arcana' },
			{ name: 'History', key: 'history' },
			{ name: 'Investigation', key: 'investigation' },
			{ name: 'Nature', key: 'nature' },
			{ name: 'Religion', key: 'religion' },
		],
	},
	{
		key: 'wisScore',
		abbr: 'WIS',
		label: 'Wisdom',
		skills: [
			{ name: 'Animal Handling', key: 'animalHandling' },
			{ name: 'Insight', key: 'insight' },
			{ name: 'Medicine', key: 'medicine' },
			{ name: 'Perception', key: 'perception' },
			{ name: 'Survival', key: 'survival' },
		],
	},
	{
		key: 'chaScore',
		abbr: 'CHA',
		label: 'Charisma',
		skills: [
			{ name: 'Deception', key: 'deception' },
			{ name: 'Intimidation', key: 'intimidation' },
			{ name: 'Performance', key: 'performance' },
			{ name: 'Persuasion', key: 'persuasion' },
		],
	},
]

interface StatsRailProps {
	character: CharacterDetailDto
}

export const StatsRail = ({ character }: StatsRailProps) => {
	const [updateStats] = useUpdateStatsMutation()

	const profBonus = getProfBonus(character.level)

	const scores: Record<keyof UpdateStatsRequest, number> = {
		strScore: character.strScore,
		dexScore: character.dexScore,
		conScore: character.conScore,
		intScore: character.intScore,
		wisScore: character.wisScore,
		chaScore: character.chaScore,
	}

	const [editing, setEditing] = useState<keyof UpdateStatsRequest | null>(null)
	const [inputVal, setInputVal] = useState('')

	const startEdit = (key: keyof UpdateStatsRequest) => {
		setEditing(key)
		setInputVal(String(scores[key]))
	}

	const commitEdit = () => {
		if (!editing) return
		const val = parseInt(inputVal)
		if (!isNaN(val) && val >= 1 && val <= 30 && val !== scores[editing]) {
			updateStats({
				id: character.id,
				...scores,
				[editing]: val,
			})
		}
		setEditing(null)
	}

	// Get skill proficiency from character proficiencies
	const skillProfMap: Record<string, boolean> = {}
	const skillExpertMap: Record<string, boolean> = {}
	for (const prof of character.proficiencies) {
		if (prof.proficiencyType === 'skill' && prof.abilityKey) {
			skillProfMap[prof.abilityKey] = true
			if (prof.hasExpertise) skillExpertMap[prof.abilityKey] = true
		}
	}

	const getSkillMod = (abilityScore: number, skillKey: string): number => {
		const base = getAbilityMod(abilityScore)
		if (skillExpertMap[skillKey]) return base + profBonus * 2
		if (skillProfMap[skillKey]) return base + profBonus
		return base
	}

	return (
		<div className='ch-stat-rail'>
			{ABILITIES.map(ability => {
				const score = scores[ability.key]
				const mod = getAbilityMod(score)
				const saveMod = mod + profBonus
				const isEditingThis = editing === ability.key

				return (
					<div key={ability.key} className='ch-stat-card'>
						<div className='ch-stat-head'>
							<span className='ch-stat-name'>{ability.label}</span>
							<span className='ch-stat-key'>{ability.abbr}</span>
						</div>
						<div className='ch-stat-body'>
							{isEditingThis ? (
								<input
									className='ch-stat-score-input'
									type='number'
									min={1}
									max={30}
									value={inputVal}
									autoFocus
									onChange={e => setInputVal(e.target.value)}
									onBlur={commitEdit}
									onKeyDown={e => e.key === 'Enter' && commitEdit()}
								/>
							) : (
								<button className='ch-stat-score' onClick={() => startEdit(ability.key)}>
									{score}
								</button>
							)}
							<span className='ch-stat-mod'>{mod >= 0 ? '+' : ''}{mod}</span>
						</div>

						{/* Saving throw */}
						<div className='ch-save-row'>
							<div className='ch-prof-dot filled' />
							<span className='ch-save-lbl'>Save</span>
							<span className='ch-save-mod'>{saveMod >= 0 ? '+' : ''}{saveMod}</span>
						</div>

						{/* Skills */}
						{ability.skills.map(skill => {
							const skillMod = getSkillMod(score, skill.key)
							const isProficient = !!skillProfMap[skill.key]
							const isExpert = !!skillExpertMap[skill.key]
							return (
								<div key={skill.key} className='ch-skill-row'>
									<div className={`ch-prof-dot${isExpert ? ' expert' : isProficient ? ' filled' : ''}`} />
									<span className='ch-skill-name'>{skill.name}</span>
									<span className='ch-save-mod'>{skillMod >= 0 ? '+' : ''}{skillMod}</span>
								</div>
							)
						})}
					</div>
				)
			})}
		</div>
	)
}
