import { useState } from 'react'
import './IdentityPanel.css'
import type { CharacterDetailDto } from '../../../types/character'
import { getProfBonus } from '../../../types/character'
import {
	useUpdateVitalsMutation,
} from '../../../api/characterApi'

const XP_THRESHOLDS = [0, 300, 900, 2700, 6500, 14000, 23000, 34000, 48000, 64000, 85000, 100000, 120000, 140000, 165000, 195000, 225000, 265000, 305000, 355000]

function getXpPercent(level: number, xp: number): number {
	const current = XP_THRESHOLDS[level - 1] ?? 0
	const next = XP_THRESHOLDS[level] ?? current
	if (next === current) return 100
	return Math.min(100, Math.max(0, ((xp - current) / (next - current)) * 100))
}

interface IdentityPanelProps {
	character: CharacterDetailDto
}

export const IdentityPanel = ({ character }: IdentityPanelProps) => {
	const [updateVitals] = useUpdateVitalsMutation()

	const profBonus = getProfBonus(character.level)
	const xpPct = getXpPercent(character.level, character.xpPoints)
	const hpPct = character.maxHp > 0 ? Math.max(0, (character.currentHp / character.maxHp) * 100) : 0

	const [editHp, setEditHp] = useState(false)
	const [hpInput, setHpInput] = useState(String(character.currentHp))

	const handleHpBlur = () => {
		setEditHp(false)
		const val = parseInt(hpInput)
		if (!isNaN(val) && val !== character.currentHp) {
			updateVitals({ id: character.id, currentHp: val })
		}
	}

	const toggleDot = (field: 'deathSuccesses' | 'deathFailures', index: number) => {
		const current = field === 'deathSuccesses' ? character.deathSuccesses : character.deathFailures
		updateVitals({ id: character.id, [field]: index < current ? index : index + 1 })
	}

	const toggleInspiration = () => {
		updateVitals({ id: character.id, hasInspiration: !character.hasInspiration })
	}

	const handleShortRest = () => {
		// Short rest: placeholder — just a callback for now
	}

	const handleLongRest = () => {
		updateVitals({ id: character.id, currentHp: character.maxHp, exhaustion: Math.max(0, character.exhaustion - 1) })
	}

	const wisScore = character.wisScore
	const passivePerception = 10 + Math.floor((wisScore - 10) / 2) + profBonus

	return (
		<div className='ch-identity'>
			{/* Name + meta */}
			<div className='ch-identity-head'>
				<h1 className='ch-identity-name'>{character.name}</h1>
				<div className='ch-identity-meta'>
					{character.race} · {character.classDisplay}
				</div>
				<div className='ch-identity-row'>
					<span className='ch-level-pill'>Level {character.level}</span>
					{character.alignment && <span className='ch-alignment'>{character.alignment}</span>}
				</div>
			</div>

			{/* XP bar */}
			<div className='ch-xp'>
				<div className='ch-xp-row'>
					<span className='ch-xp-lbl'>XP</span>
					<span className='ch-xp-num'>{character.xpPoints.toLocaleString()}</span>
				</div>
				<div className='ch-xp-track'>
					<div className='ch-xp-fill' style={{ width: `${xpPct}%` }} />
				</div>
			</div>

			{/* HP */}
			<div className='ch-hp-row'>
				<div className='ch-hp-labels'>
					<span className='ch-hp-lbl'>Hit Points</span>
					<div className='ch-hp-nums'>
						{editHp ? (
							<input
								className='ch-hp-input'
								type='number'
								value={hpInput}
								autoFocus
								onChange={e => setHpInput(e.target.value)}
								onBlur={handleHpBlur}
								onKeyDown={e => e.key === 'Enter' && handleHpBlur()}
							/>
						) : (
							<button className='ch-hp-current' onClick={() => { setHpInput(String(character.currentHp)); setEditHp(true) }}>
								{character.currentHp}
							</button>
						)}
						<span className='ch-hp-sep'>/</span>
						<span className='ch-hp-max'>{character.maxHp}</span>
					</div>
				</div>
				<div className='ch-hp-bar'>
					<div className='ch-hp-fill' style={{ width: `${hpPct}%` }} data-low={hpPct < 35 ? '' : undefined} />
				</div>
				{character.tempHp > 0 && (
					<div className='ch-hp-meta'>Temp HP: {character.tempHp}</div>
				)}
			</div>

			{/* Vital tiles */}
			<div className='ch-vital-grid'>
				<div className='ch-stat-tile'>
					<div className='ch-stat-tile-val'>{character.armorClass}</div>
					<div className='ch-stat-tile-lbl'>AC</div>
				</div>
				<div className='ch-stat-tile'>
					<div className='ch-stat-tile-val'>{character.speed}</div>
					<div className='ch-stat-tile-lbl'>Speed</div>
				</div>
				<div className='ch-stat-tile'>
					<div className='ch-stat-tile-val'>{Math.floor((character.dexScore - 10) / 2) >= 0 ? '+' : ''}{Math.floor((character.dexScore - 10) / 2)}</div>
					<div className='ch-stat-tile-lbl'>Initiative</div>
				</div>
				<div className='ch-stat-tile'>
					<div className='ch-stat-tile-val'>+{profBonus}</div>
					<div className='ch-stat-tile-lbl'>Prof Bonus</div>
				</div>
				<div className='ch-stat-tile'>
					<div className='ch-stat-tile-val'>{passivePerception}</div>
					<div className='ch-stat-tile-lbl'>Pass Perc</div>
				</div>
			</div>

			{/* Helpers row */}
			<div className='ch-vital-helpers'>
				{/* Inspiration */}
				<button
					className={`ch-insp${character.hasInspiration ? ' active' : ''}`}
					onClick={toggleInspiration}
					title='Inspiration'
				>
					<svg width='14' height='14' viewBox='0 0 24 24' fill={character.hasInspiration ? 'currentColor' : 'none'} stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
						<polygon points='12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2' />
					</svg>
					<span className='ch-helper-lbl'>{character.hasInspiration ? 'Inspired' : 'Inspiration'}</span>
				</button>

				{/* Death saves */}
				<div className='ch-death'>
					<div className='ch-death-row'>
						<span className='ch-death-lbl'>Success</span>
						{[0, 1, 2].map(i => (
							<button
								key={i}
								className={`ch-death-dot success${i < character.deathSuccesses ? ' filled' : ''}`}
								onClick={() => toggleDot('deathSuccesses', i)}
							/>
						))}
					</div>
					<div className='ch-death-row'>
						<span className='ch-death-lbl'>Failure</span>
						{[0, 1, 2].map(i => (
							<button
								key={i}
								className={`ch-death-dot failure${i < character.deathFailures ? ' filled' : ''}`}
								onClick={() => toggleDot('deathFailures', i)}
							/>
						))}
					</div>
				</div>

				{/* Exhaustion */}
				<div className='ch-exh'>
					<span className='ch-helper-lbl'>Exhaustion</span>
					<div className='ch-exh-pips'>
						{[1, 2, 3, 4, 5, 6].map(i => (
							<button
								key={i}
								className={`ch-exh-pip${i <= character.exhaustion ? ' filled' : ''}`}
								onClick={() => updateVitals({ id: character.id, exhaustion: i === character.exhaustion ? i - 1 : i })}
							/>
						))}
					</div>
				</div>
			</div>

			{/* Rests */}
			<div className='ch-rests'>
				<button className='ch-rest-btn' onClick={handleShortRest}>Short Rest</button>
				<button className='ch-rest-btn ch-rest-btn--long' onClick={handleLongRest}>Long Rest</button>
			</div>
		</div>
	)
}
