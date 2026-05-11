export interface CharacterDto {
	id: number
	name: string
	race: string
	class: string
	level: number
	currentHp: number
	maxHp: number
	imageUrl?: string
	ownerId: number
	ownerUsername: string
	campaignId?: number
	campaignName?: string
	createdAt: string
	updatedAt: string
}

export interface CreateCharacterFormValues {
	name: string
	race: string
	class: string
	level: number
	campaignId?: number
	image?: File | null
}

export interface UpdateCharacterFormValues {
	id: number
	name?: string
	race?: string
	class?: string
	level?: number
	currentHp?: number
	maxHp?: number
	campaignId?: number
	image?: File | null
}
