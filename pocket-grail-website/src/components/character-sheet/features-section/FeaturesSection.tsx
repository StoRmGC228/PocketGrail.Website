import { useState } from 'react'
import './FeaturesSection.css'
import type { CharacterDetailDto, FeatureDto } from '../../../types/character'
import { useDeleteFeatureMutation } from '../../../api/characterApi'

interface FeaturesSectionProps {
	character: CharacterDetailDto
	onAddFeature: () => void
}

function FeatureRow({ feat, characterId }: { feat: FeatureDto; characterId: number }) {
	const [open, setOpen] = useState(false)
	const [deleteFeature] = useDeleteFeatureMutation()

	return (
		<div className='ch-feat'>
			<div className='ch-feat-head' onClick={() => setOpen(!open)}>
				<div className='ch-feat-head-left'>
					<span className='ch-feat-name'>{feat.name}</span>
				</div>
				<div className='ch-feat-head-right'>
					<button
						className='ch-del-btn ch-feat-del'
						onClick={e => {
							e.stopPropagation()
							deleteFeature({ characterId, featureId: feat.id })
						}}
						aria-label={`Delete ${feat.name}`}
					>
						<svg width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.4' strokeLinecap='round'>
							<path d='M6 6 18 18M6 18 18 6' />
						</svg>
					</button>
					<svg
						className={`ch-feat-chevron${open ? ' open' : ''}`}
						width='12'
						height='12'
						viewBox='0 0 24 24'
						fill='none'
						stroke='currentColor'
						strokeWidth='2.2'
						strokeLinecap='round'
					>
						<path d='M6 9l6 6 6-6' />
					</svg>
				</div>
			</div>
			{open && feat.description && (
				<div className='ch-feat-body'>
					<p>{feat.description}</p>
				</div>
			)}
		</div>
	)
}

export const FeaturesSection = ({ character, onAddFeature }: FeaturesSectionProps) => (
	<div className='ch-sec'>
		<div className='ch-sec-head'>
			<h3>Features & Traits</h3>
			<button className='ch-add-btn' onClick={onAddFeature}>
				<svg width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.5' strokeLinecap='round'>
					<path d='M12 5v14M5 12h14' />
				</svg>
				Add
			</button>
		</div>

		{character.features.length === 0 ? (
			<div className='ch-empty'>No features added yet.</div>
		) : (
			<div className='ch-feat-list'>
				{character.features.map(feat => (
					<FeatureRow key={feat.id} feat={feat} characterId={character.id} />
				))}
			</div>
		)}
	</div>
)
