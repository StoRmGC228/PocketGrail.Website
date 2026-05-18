import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import './CharacterPage.css'
import {
	useGetCharacterDetailQuery,
	useUpdateCharacterMutation,
} from '../../../api/characterApi'
import { CharacterPortrait } from '../../../components/character-sheet/character-portrait/CharacterPortrait'
import { IdentityPanel } from '../../../components/character-sheet/identity-panel/IdentityPanel'
import { StatsRail } from '../../../components/character-sheet/stats-rail/StatsRail'
import { WeaponsSection } from '../../../components/character-sheet/weapons-section/WeaponsSection'
import { FeaturesSection } from '../../../components/character-sheet/features-section/FeaturesSection'
import { ProficienciesSection } from '../../../components/character-sheet/proficiencies-section/ProficienciesSection'
import { FeatsSection } from '../../../components/character-sheet/feats-section/FeatsSection'
import { InventorySection } from '../../../components/character-sheet/inventory-section/InventorySection'
import { SpellsSection } from '../../../components/character-sheet/spells-section/SpellsSection'
import { AlliesSection } from '../../../components/character-sheet/allies-section/AlliesSection'
import { TextSection } from '../../../components/character-sheet/text-section/TextSection'
import { AddItemModal } from '../../../components/character-sheet/add-item-modal/AddItemModal'
import { AddSpellModal } from '../../../components/character-sheet/add-spell-modal/AddSpellModal'
import { AddFeatModal } from '../../../components/character-sheet/add-feat-modal/AddFeatModal'
import { AddFeatureModal } from '../../../components/character-sheet/add-feature-modal/AddFeatureModal'
import { AddProficiencyModal } from '../../../components/character-sheet/add-proficiency-modal/AddProficiencyModal'
import { ImagePickerModal } from '../../../components/character-sheet/image-picker-modal/ImagePickerModal'

type ModalType = 'addItem' | 'addSpell' | 'addFeat' | 'addFeature' | 'addProficiency' | 'imagePicker' | null

const TABS = ['Identity', 'Stats', 'Combat', 'Spells', 'Inventory', 'Features', 'Notes'] as const
type Tab = typeof TABS[number]

export const CharacterPage = () => {
	const { id } = useParams<{ id: string }>()
	const characterId = Number(id)
	const navigate = useNavigate()

	const { data: character, isLoading, isError } = useGetCharacterDetailQuery(characterId)
	const [updateCharacter] = useUpdateCharacterMutation()

	const [activeModal, setActiveModal] = useState<ModalType>(null)
	const [activeTab, setActiveTab] = useState<Tab>('Identity')

	const closeModal = () => setActiveModal(null)

	const handleSaveText = async (patch: { backgroundStory?: string; appearance?: string; notes?: string }) => {
		if (!character) return
		await updateCharacter({
			id: character.id,
			...patch,
		} as Parameters<typeof updateCharacter>[0])
	}

	if (isLoading) {
		return (
			<div className='ch-page-loading'>
				<span>Loading character sheet…</span>
			</div>
		)
	}

	if (isError || !character) {
		return (
			<div className='ch-page-error'>
				<span>Failed to load character. </span>
				<button onClick={() => navigate('/characters')}>Back to characters</button>
			</div>
		)
	}

	return (
		<div className='ch-page'>
			{/* Mobile tab bar */}
			<div className='ch-tabs'>
				{TABS.map(tab => (
					<button
						key={tab}
						className={`ch-tab${activeTab === tab ? ' active' : ''}`}
						onClick={() => setActiveTab(tab)}
					>
						{tab}
					</button>
				))}
			</div>

			<div className='ch-railwrap'>
				{/* Left sticky rail */}
				<aside className={`ch-rail${activeTab === 'Stats' || activeTab === 'Identity' ? ' ch-rail--mobile-visible' : ''}`}>
					<CharacterPortrait character={character} onEditImage={() => setActiveModal('imagePicker')} />
					<IdentityPanel character={character} />
					<div className='ch-rail-stats'>
						<StatsRail character={character} />
					</div>
				</aside>

				{/* Right scrolling body */}
				<main className='ch-rail-body'>
					<div className={`ch-rail-body-section${activeTab === 'Combat' ? ' ch-section--mobile-visible' : ''}`}>
						<WeaponsSection character={character} onAddItem={() => setActiveModal('addItem')} />
					</div>
					<div className={`ch-rail-body-section${activeTab === 'Spells' ? ' ch-section--mobile-visible' : ''}`}>
						<SpellsSection character={character} onAddSpell={() => setActiveModal('addSpell')} />
					</div>
					<div className={`ch-rail-body-section${activeTab === 'Inventory' ? ' ch-section--mobile-visible' : ''}`}>
						<InventorySection character={character} onAddItem={() => setActiveModal('addItem')} />
					</div>
					<div className={`ch-rail-body-section${activeTab === 'Features' ? ' ch-section--mobile-visible' : ''}`}>
						<FeaturesSection character={character} onAddFeature={() => setActiveModal('addFeature')} />
						<ProficienciesSection character={character} onAddProficiency={() => setActiveModal('addProficiency')} />
						<FeatsSection character={character} onAddFeat={() => setActiveModal('addFeat')} />
					</div>
					<div className={`ch-rail-body-section${activeTab === 'Notes' ? ' ch-section--mobile-visible' : ''}`}>
						<AlliesSection characterId={character.id} />
						<TextSection character={character} onSaveText={handleSaveText} />
					</div>
				</main>
			</div>

			{/* Modals */}
			{activeModal === 'addItem' && (
				<AddItemModal characterId={characterId} onClose={closeModal} />
			)}
			{activeModal === 'addSpell' && (
				<AddSpellModal characterId={characterId} onClose={closeModal} />
			)}
			{activeModal === 'addFeat' && (
				<AddFeatModal characterId={characterId} onClose={closeModal} />
			)}
			{activeModal === 'addFeature' && (
				<AddFeatureModal characterId={characterId} onClose={closeModal} />
			)}
			{activeModal === 'addProficiency' && (
				<AddProficiencyModal characterId={characterId} onClose={closeModal} />
			)}
			{activeModal === 'imagePicker' && (
				<ImagePickerModal characterId={characterId} onClose={closeModal} />
			)}
		</div>
	)
}
