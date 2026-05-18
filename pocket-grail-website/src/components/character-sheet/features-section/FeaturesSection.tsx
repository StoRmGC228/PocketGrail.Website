import { useState } from 'react'
import './FeaturesSection.css'
import type { CharacterDetailDto, FeatureDto } from '../../../types/character'
import { useDeleteFeatureMutation } from '../../../api/characterApi'

interface FeaturesSectionProps {
	character: CharacterDetailDto
	onAddFeature: () => void
}

function FeatureGroup({
	title,
	features,
	characterId,
}: {
	title: string
	features: FeatureDto[]
	characterId: number
}) {
	const [open, setOpen] = useState(true)
	const [expanded, setExpanded] = useState<Set<number>>(new Set())
	const [deleteFeature] = useDeleteFeatureMutation()

	const toggle = (id: number) => {
		setExpanded(prev => {
			const next = new Set(prev)
			if (next.has(id)) next.delete(id)
			else next.add(id)
			return next
		})
	}

	return (
		<div className='ch-feat-group'>
			<button className='ch-feat-group-header' onClick={() => setOpen(!open)}>
				<span>{title}</span>
				<span className='ch-feat-group-count'>{features.length}</span>
				<svg
					className={`ch-feat-chevron${open ? ' open' : ''}`}
					width='14'
					height='14'
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
				<div className='ch-feat-list'>
					{features.length === 0 ? (
						<div className='ch-empty'>None yet.</div>
					) : (
						features.map(feat => (
							<div key={feat.id} className='ch-feat'>
								<div className='ch-feat-head' onClick={() => toggle(feat.id)}>
									<div className='ch-feat-head-left'>
										{feat.isAutoAdded ? (
											<svg width='11' height='11' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round'>
												<rect x='3' y='11' width='18' height='11' rx='2' />
												<path d='M7 11V7a5 5 0 0 1 10 0v4' />
											</svg>
										) : null}
										<span className='ch-feat-name'>{feat.name}</span>
										{feat.featureLevel && (
											<span className='ch-feat-lv'>Lv {feat.featureLevel}</span>
										)}
									</div>
									<div className='ch-feat-head-right'>
										{!feat.isAutoAdded && (
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
										)}
										<svg
											className={`ch-feat-chevron${expanded.has(feat.id) ? ' open' : ''}`}
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
								{expanded.has(feat.id) && feat.description && (
									<div className='ch-feat-body'>
										<p>{feat.description}</p>
									</div>
								)}
							</div>
						))
					)}
				</div>
			)}
		</div>
	)
}

export const FeaturesSection = ({ character, onAddFeature }: FeaturesSectionProps) => {
	const classFeatures = character.features.filter(f => f.featureType === 'class' || f.featureType === 'subclass')
	const racialTraits = character.features.filter(f => f.featureType === 'race')

	return (
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

			<FeatureGroup title='Class & Subclass Features' features={classFeatures} characterId={character.id} />
			<FeatureGroup title='Racial Traits' features={racialTraits} characterId={character.id} />
		</div>
	)
}
