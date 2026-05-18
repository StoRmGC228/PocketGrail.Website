import { useState } from 'react'
import './AddProficiencyModal.css'
import { useAddProficiencyMutation } from '../../../api/characterApi'

interface AddProficiencyModalProps {
	characterId: number
	onClose: () => void
}

export const AddProficiencyModal = ({ characterId, onClose }: AddProficiencyModalProps) => {
	const [addProficiency, { isLoading }] = useAddProficiencyMutation()

	const [name, setName] = useState('')
	const [proficiencyType, setProficiencyType] = useState('weapon')
	const [hasExpertise, setHasExpertise] = useState(false)
	const [error, setError] = useState('')

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!name.trim()) { setError('Name is required.'); return }
		try {
			await addProficiency({
				id: characterId,
				name: name.trim(),
				proficiencyType,
				hasExpertise,
			}).unwrap()
			onClose()
		} catch {
			setError('Failed to add proficiency. Please try again.')
		}
	}

	return (
		<div className='rst-modal-backdrop' onClick={e => e.target === e.currentTarget && onClose()}>
			<div className='rst-modal'>
				<div className='rst-modal-eyebrow'>Proficiencies</div>
				<h2>Add Proficiency</h2>
				<button className='rst-modal-close' onClick={onClose} type='button' aria-label='Close'>
					<svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.4' strokeLinecap='round'>
						<path d='M6 6 18 18M6 18 18 6' />
					</svg>
				</button>

				<form className='rst-form' onSubmit={handleSubmit}>
					<div className='rst-field'>
						<label>Name *</label>
						<input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Longswords, Elvish, Thieves' Tools" required />
					</div>

					<div className='rst-field'>
						<label>Type</label>
						<select value={proficiencyType} onChange={e => setProficiencyType(e.target.value)}>
							<option value='weapon'>Weapon</option>
							<option value='armor'>Armor</option>
							<option value='tool'>Tool</option>
							<option value='language'>Language</option>
							<option value='skill'>Skill</option>
						</select>
					</div>

					<div className='rst-checkboxes'>
						<label className='rst-checkbox-label'>
							<input type='checkbox' checked={hasExpertise} onChange={e => setHasExpertise(e.target.checked)} />
							Has Expertise (×2 proficiency bonus)
						</label>
					</div>

					{error && <p className='rst-modal-error'>{error}</p>}

					<div className='rst-modal-actions'>
						<button type='button' className='rst-modal-btn rst-modal-btn-ghost' onClick={onClose}>Cancel</button>
						<button type='submit' className='rst-modal-btn rst-modal-btn-primary' disabled={isLoading}>
							{isLoading ? 'Adding…' : 'Add Proficiency'}
						</button>
					</div>
				</form>
			</div>
		</div>
	)
}
