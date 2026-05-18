import { useState } from 'react'
import './TextSection.css'
import type { CharacterDetailDto } from '../../../types/character'

interface TextSectionProps {
	character: CharacterDetailDto
	onSaveText: (patch: { backgroundStory?: string; appearance?: string; notes?: string }) => void
}

type TextField = 'backgroundStory' | 'appearance' | 'notes'

const TEXT_FIELDS: { key: TextField; label: string; placeholder: string }[] = [
	{ key: 'backgroundStory', label: 'Background Story', placeholder: 'Click to add your character\'s background story…' },
	{ key: 'appearance', label: 'Appearance', placeholder: 'Describe your character\'s appearance…' },
	{ key: 'notes', label: 'Notes', placeholder: 'Session notes, reminders, anything else…' },
]

interface TextBlockProps {
	field: { key: TextField; label: string; placeholder: string }
	value?: string
	onSave: (patch: { backgroundStory?: string; appearance?: string; notes?: string }) => void
}

function TextBlock({ field, value, onSave }: TextBlockProps) {
	const [open, setOpen] = useState(false)
	const [editing, setEditing] = useState(false)
	const [draft, setDraft] = useState(value ?? '')

	const handleBlur = () => {
		setEditing(false)
		if (draft !== (value ?? '')) {
			onSave({ [field.key]: draft })
		}
	}

	return (
		<div className='ch-text-block'>
			<button className='ch-text-head' onClick={() => setOpen(!open)}>
				<span>{field.label}</span>
				{value && <span className='ch-text-preview'>{value.substring(0, 40)}{value.length > 40 ? '…' : ''}</span>}
				<svg
					className={`ch-text-chevron${open ? ' open' : ''}`}
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
			</button>

			{open && (
				<div className='ch-text-body'>
					{editing ? (
						<textarea
							className='ch-text-area'
							value={draft}
							autoFocus
							rows={6}
							onChange={e => setDraft(e.target.value)}
							onBlur={handleBlur}
						/>
					) : (
						<div
							className={`ch-text-content${!value ? ' ch-text-placeholder' : ''}`}
							onClick={() => { setDraft(value ?? ''); setEditing(true) }}
						>
							{value || field.placeholder}
						</div>
					)}
				</div>
			)}
		</div>
	)
}

export const TextSection = ({ character, onSaveText }: TextSectionProps) => {
	return (
		<div className='ch-sec ch-text'>
			<div className='ch-sec-head'>
				<h3>Journal</h3>
			</div>
			<div className='ch-text-blocks'>
				{TEXT_FIELDS.map(field => (
					<TextBlock
						key={field.key}
						field={field}
						value={character[field.key]}
						onSave={onSaveText}
					/>
				))}
			</div>
		</div>
	)
}
