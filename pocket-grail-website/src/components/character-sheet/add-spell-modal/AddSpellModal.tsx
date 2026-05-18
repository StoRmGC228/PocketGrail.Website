import { useState } from 'react'
import './AddSpellModal.css'
import { useAddSpellMutation } from '../../../api/characterApi'

interface AddSpellModalProps {
	characterId: number
	onClose: () => void
}

export const AddSpellModal = ({ characterId, onClose }: AddSpellModalProps) => {
	const [addSpell, { isLoading }] = useAddSpellMutation()

	const [name, setName] = useState('')
	const [level, setLevel] = useState('0')
	const [school, setSchool] = useState('')
	const [range, setRange] = useState('')
	const [castingTime, setCastingTime] = useState('')
	const [concentration, setConcentration] = useState(false)
	const [isRitual, setIsRitual] = useState(false)
	const [components, setComponents] = useState('')
	const [prepared, setPrepared] = useState(false)
	const [error, setError] = useState('')

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!name.trim()) { setError('Name is required.'); return }
		try {
			await addSpell({
				id: characterId,
				name: name.trim(),
				level: parseInt(level),
				school: school || undefined,
				range: range || undefined,
				castingTime: castingTime || undefined,
				concentration,
				isRitual,
				components: components || undefined,
				prepared,
			}).unwrap()
			onClose()
		} catch {
			setError('Failed to add spell. Please try again.')
		}
	}

	return (
		<div className='rst-modal-backdrop' onClick={e => e.target === e.currentTarget && onClose()}>
			<div className='rst-modal'>
				<div className='rst-modal-eyebrow'>Spellbook</div>
				<h2>Add Spell</h2>
				<button className='rst-modal-close' onClick={onClose} type='button' aria-label='Close'>
					<svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.4' strokeLinecap='round'>
						<path d='M6 6 18 18M6 18 18 6' />
					</svg>
				</button>

				<form className='rst-form' onSubmit={handleSubmit}>
					<div className='rst-field'>
						<label>Name *</label>
						<input value={name} onChange={e => setName(e.target.value)} placeholder='Spell name' required />
					</div>

					<div className='rst-field-row'>
						<div className='rst-field'>
							<label>Level</label>
							<select value={level} onChange={e => setLevel(e.target.value)}>
								<option value='0'>Cantrip (0)</option>
								{[1, 2, 3, 4, 5, 6, 7, 8, 9].map(l => (
									<option key={l} value={l}>{l}</option>
								))}
							</select>
						</div>
						<div className='rst-field'>
							<label>School</label>
							<select value={school} onChange={e => setSchool(e.target.value)}>
								<option value=''>Select…</option>
								<option>Abjuration</option>
								<option>Conjuration</option>
								<option>Divination</option>
								<option>Enchantment</option>
								<option>Evocation</option>
								<option>Illusion</option>
								<option>Necromancy</option>
								<option>Transmutation</option>
							</select>
						</div>
					</div>

					<div className='rst-field-row'>
						<div className='rst-field'>
							<label>Range</label>
							<input value={range} onChange={e => setRange(e.target.value)} placeholder='60 feet' />
						</div>
						<div className='rst-field'>
							<label>Casting Time</label>
							<input value={castingTime} onChange={e => setCastingTime(e.target.value)} placeholder='1 action' />
						</div>
					</div>

					<div className='rst-field'>
						<label>Components</label>
						<input value={components} onChange={e => setComponents(e.target.value)} placeholder='V, S, M (a bit of fleece)' />
					</div>

					<div className='rst-checkboxes'>
						<label className='rst-checkbox-label'>
							<input type='checkbox' checked={concentration} onChange={e => setConcentration(e.target.checked)} />
							Concentration
						</label>
						<label className='rst-checkbox-label'>
							<input type='checkbox' checked={isRitual} onChange={e => setIsRitual(e.target.checked)} />
							Ritual
						</label>
						<label className='rst-checkbox-label'>
							<input type='checkbox' checked={prepared} onChange={e => setPrepared(e.target.checked)} />
							Prepared
						</label>
					</div>

					{error && <p className='rst-modal-error'>{error}</p>}

					<div className='rst-modal-actions'>
						<button type='button' className='rst-modal-btn rst-modal-btn-ghost' onClick={onClose}>Cancel</button>
						<button type='submit' className='rst-modal-btn rst-modal-btn-primary' disabled={isLoading}>
							{isLoading ? 'Adding…' : 'Add Spell'}
						</button>
					</div>
				</form>
			</div>
		</div>
	)
}
