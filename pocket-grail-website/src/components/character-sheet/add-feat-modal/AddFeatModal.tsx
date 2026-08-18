import { useState } from 'react'
import './AddFeatModal.css'
import { useAddFeatMutation } from '../../../api/characterApi'

interface AddFeatModalProps {
	characterId: number
	onClose: () => void
}

export const AddFeatModal = ({ characterId, onClose }: AddFeatModalProps) => {
	const [addFeat, { isLoading }] = useAddFeatMutation()

	const [name, setName] = useState('')
	const [requirement, setRequirement] = useState('')
	const [description, setDescription] = useState('')
	const [error, setError] = useState('')

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!name.trim()) { setError('Name is required.'); return }
		try {
			await addFeat({
				id: characterId,
				name: name.trim(),
				requirement: requirement || undefined,
				description: description || undefined,
			}).unwrap()
			onClose()
		} catch {
			setError('Failed to add feat. Please try again.')
		}
	}

	return (
		<div className='rst-modal-backdrop' onClick={e => e.target === e.currentTarget && onClose()}>
			<div className='rst-modal'>
				<div className='rst-modal-eyebrow'>Feats</div>
				<h2>Add Feat</h2>
				<button className='rst-modal-close' onClick={onClose} type='button' aria-label='Close'>
					<svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.4' strokeLinecap='round'>
						<path d='M6 6 18 18M6 18 18 6' />
					</svg>
				</button>

				<form className='rst-form' onSubmit={handleSubmit}>
					<div className='rst-field'>
						<label>Name *</label>
						<input value={name} onChange={e => setName(e.target.value)} placeholder='Feat name' required />
					</div>

					<div className='rst-field'>
						<label>Requirement</label>
						<input value={requirement} onChange={e => setRequirement(e.target.value)} placeholder='e.g. STR 13 or higher' />
					</div>

					<div className='rst-field'>
						<label>Description</label>
						<textarea
							className='rst-textarea'
							value={description}
							onChange={e => setDescription(e.target.value)}
							placeholder='Describe what this feat does…'
							rows={4}
						/>
					</div>

					{error && <p className='rst-modal-error'>{error}</p>}

					<div className='rst-modal-actions'>
						<button type='button' className='rst-modal-btn rst-modal-btn-ghost' onClick={onClose}>Cancel</button>
						<button type='submit' className='rst-modal-btn rst-modal-btn-primary' disabled={isLoading}>
							{isLoading ? 'Adding…' : 'Add Feat'}
						</button>
					</div>
				</form>
			</div>
		</div>
	)
}
