import '../create-character-modal/CreateCharacterModal.css'
import type { CharacterDto } from '../../../types/character'

const CLASS_GRADIENTS: Record<string, string> = {
	rogue: 'linear-gradient(135deg, #1e1b4b 0%, #4c1d95 60%, #831843 100%)',
	wizard: 'linear-gradient(135deg, #0c4a6e 0%, #1e40af 60%, #6366f1 100%)',
	sorcerer: 'linear-gradient(135deg, #312e81 0%, #6d28d9 60%, #c084fc 100%)',
	warlock: 'linear-gradient(135deg, #4a044e 0%, #831843 60%, #f43f5e 100%)',
	cleric: 'linear-gradient(135deg, #422006 0%, #b45309 60%, #fbbf24 100%)',
	paladin: 'linear-gradient(135deg, #064e3b 0%, #0891b2 60%, #facc15 100%)',
	ranger: 'linear-gradient(135deg, #14532d 0%, #15803d 60%, #84cc16 100%)',
	barbarian: 'linear-gradient(135deg, #7c2d12 0%, #b91c1c 60%, #ef4444 100%)',
	bard: 'linear-gradient(135deg, #581c87 0%, #be185d 60%, #fb7185 100%)',
	monk: 'linear-gradient(135deg, #064e3b 0%, #115e59 60%, #d6d3d1 100%)',
	fighter: 'linear-gradient(135deg, #1c1917 0%, #44403c 60%, #a8a29e 100%)',
	druid: 'linear-gradient(135deg, #14532d 0%, #4d7c0f 60%, #fbbf24 100%)',
}

function getClassGradient(cls: string): string {
	const key = cls.toLowerCase().split(' ').pop() ?? ''
	return CLASS_GRADIENTS[key] ?? 'linear-gradient(135deg, #1e1b4b 0%, #4c1d95 60%, #6366f1 100%)'
}

interface DeleteCharacterModalProps {
	character: CharacterDto
	onClose: () => void
	onConfirm: () => void
	isLoading?: boolean
}

export const DeleteCharacterModal = ({ character, onClose, onConfirm, isLoading }: DeleteCharacterModalProps) => (
	<div className="rst-modal-backdrop" onMouseDown={onClose}>
		<div className="rst-modal" onMouseDown={e => e.stopPropagation()}>
			<button className="rst-modal-close" onClick={onClose} aria-label="Close">
				<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
					<path d="M6 6 18 18M6 18 18 6"/>
				</svg>
			</button>

			<div>
				<div className="rst-modal-eyebrow" style={{ color: '#fca5a5' }}>Confirm Delete</div>
				<h2>Banish this hero?</h2>
			</div>

			<p>
				This permanently removes <b>{character.name}</b>'s sheet, inventory, and history from PocketGrail.{' '}
				There is no undo.
			</p>

			<div className="rst-modal-target">
				<div
					className="rst-modal-target-art"
					style={{ background: getClassGradient(character.class) }}
				>
					<span>{character.name[0]?.toUpperCase()}</span>
				</div>
				<div className="rst-modal-target-info">
					<div className="rst-modal-target-name">{character.name}</div>
					<div className="rst-modal-target-meta">
						{character.race} · {character.class} · Lv {character.level}
					</div>
				</div>
			</div>

			<div className="rst-modal-actions">
				<button className="rst-modal-btn rst-modal-btn-ghost" onClick={onClose}>
					Cancel
				</button>
				<button
					className="rst-modal-btn rst-modal-btn-danger"
					onClick={onConfirm}
					disabled={isLoading}
				>
					<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
						<path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
						<path d="m19 6-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
					</svg>
					{isLoading ? 'Deleting…' : 'Delete forever'}
				</button>
			</div>
		</div>
	</div>
)
