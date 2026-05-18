import { useState } from 'react'
import './AddFeatureModal.css'
import { useAddFeatureMutation } from '../../../api/characterApi'

interface AddFeatureModalProps {
	characterId: number
	onClose: () => void
}

export const AddFeatureModal = ({ characterId, onClose }: AddFeatureModalProps) => {
	const [addFeature, { isLoading }] = useAddFeatureMutation()

	const [name, setName] = useState('')
	const [featureType, setFeatureType] = useState('class')
	const [description, setDescription] = useState('')
	const [featureLevel, setFeatureLevel] = useState('')
	const [error, setError] = useState('')

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!name.trim()) { setError('Name is required.'); return }
		try {
			await addFeature({
				id: characterId,
				name: name.trim(),
				featureType,
				description: description || undefined,
				featureLevel: featureLevel ? parseInt(featureLevel) : undefined,
			}).unwrap()
			onClose()
		} catch {
			setError('Failed to add feature. Please try again.')
		}
	}

	return (
		<div className='rst-modal-backdrop' onClick={e => e.target === e.currentTarget && onClose()}>
			<div className='rst-modal'>
				<div className='rst-modal-eyebrow'>Features</div>
				<h2>Add Feature</h2>
				<button className='rst-modal-close' onClick={onClose} type='button' aria-label='Close'>
					<svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.4' strokeLinecap='round'>
						<path d='M6 6 18 18M6 18 18 6' />
					</svg>
				</button>

				<form className='rst-form' onSubmit={handleSubmit}>
					<div className='rst-field'>
						<label>Name *</label>
						<input value={name} onChange={e => setName(e.target.value)} placeholder='Feature name' required />
					</div>

					<div className='rst-field-row'>
						<div className='rst-field'>
							<label>Type</label>
							<select value={featureType} onChange={e => setFeatureType(e.target.value)}>
								<option value='class'>Class</option>
								<option value='race'>Race</option>
								<option value='subclass'>Subclass</option>
							</select>
						</div>
						<div className='rst-field'>
							<label>Level Gained</label>
							<input
								type='number'
								min={1}
								max={20}
								value={featureLevel}
								onChange={e => setFeatureLevel(e.target.value)}
								placeholder='1'
							/>
						</div>
					</div>

					<div className='rst-field'>
						<label>Description</label>
						<textarea
							className='rst-textarea'
							value={description}
							onChange={e => setDescription(e.target.value)}
							placeholder='Describe what this feature does…'
							rows={4}
						/>
					</div>

					{error && <p className='rst-modal-error'>{error}</p>}

					<div className='rst-modal-actions'>
						<button type='button' className='rst-modal-btn rst-modal-btn-ghost' onClick={onClose}>Cancel</button>
						<button type='submit' className='rst-modal-btn rst-modal-btn-primary' disabled={isLoading}>
							{isLoading ? 'Adding…' : 'Add Feature'}
						</button>
					</div>
				</form>
			</div>
		</div>
	)
}
