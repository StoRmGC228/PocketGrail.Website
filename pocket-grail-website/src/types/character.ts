export interface ItemDto {
	id: number
	name: string
	description?: string
	rarity?: string
	category?: string
	weight?: number
	cost?: string
	isWeapon: boolean
	isMagical: boolean
	atkMod?: string
	damage?: string
	damageType?: string
	weaponProperties?: string[]
	chargesInfo?: string
	rechargeType?: string
	tags?: string[]
	isEquipped: boolean
	isAttuned: boolean
	quantity: number
}

export interface SpellDto {
	id: number
	name: string
	level: number
	school?: string
	range?: string
	castingTime?: string
	concentration: boolean
	isRitual: boolean
	components?: string
	prepared: boolean
}

export interface FeatDto {
	id: number
	name: string
	requirement?: string
	description?: string
}

export interface FeatureDto {
	id: number
	name: string
	description?: string
	featureType: string
	featureLevel?: number
	sourceClass?: string
	sourceRace?: string
	isAutoAdded: boolean
}

export interface ProficiencyDto {
	id: number
	name: string
	proficiencyType: string
	hasExpertise: boolean
	abilityKey?: string
}

export interface SpellSlotDto {
	id: number
	slotLevel: number
	totalSlots: number
	remainingSlots: number
}

export interface AllyDto {
	characterId: number
	characterName: string
	race: string
	class: string
	level: number
	currentHp: number
	maxHp: number
	imageUrl?: string
	imageCropX?: number
	imageCropY?: number
	imageCropWidth?: number
	imageCropHeight?: number
	userId: number
	username: string
}

export interface CharacterDetailDto {
	id: number
	name: string
	race: string
	class: string
	subclass?: string
	level: number
	currentHp: number
	maxHp: number
	tempHp: number
	imageUrl?: string
	imageCropX?: number
	imageCropY?: number
	imageCropWidth?: number
	imageCropHeight?: number
	strScore: number
	dexScore: number
	conScore: number
	intScore: number
	wisScore: number
	chaScore: number
	armorClass: number
	speed: number
	xpPoints: number
	hasInspiration: boolean
	exhaustion: number
	deathSuccesses: number
	deathFailures: number
	cpCoins: number
	spCoins: number
	epCoins: number
	gpCoins: number
	ppCoins: number
	spellAbility?: string
	alignment?: string
	backgroundStory?: string
	appearance?: string
	notes?: string
	ownerId: number
	ownerUsername: string
	campaignId?: number
	campaignName?: string
	items: ItemDto[]
	spells: SpellDto[]
	feats: FeatDto[]
	features: FeatureDto[]
	proficiencies: ProficiencyDto[]
	spellSlots: SpellSlotDto[]
	createdAt: string
	updatedAt: string
}

// Request payload types
export interface UpdateStatsRequest {
	strScore: number
	dexScore: number
	conScore: number
	intScore: number
	wisScore: number
	chaScore: number
}

export interface UpdateVitalsRequest {
	currentHp?: number
	maxHp?: number
	tempHp?: number
	armorClass?: number
	speed?: number
	xpPoints?: number
	hasInspiration?: boolean
	exhaustion?: number
	deathSuccesses?: number
	deathFailures?: number
}

export interface UpdateWalletRequest {
	cpCoins?: number
	spCoins?: number
	epCoins?: number
	gpCoins?: number
	ppCoins?: number
}

export interface AddItemRequest {
	name: string
	description?: string
	rarity?: string
	category?: string
	weight?: number
	cost?: string
	isWeapon: boolean
	isMagical: boolean
	atkMod?: string
	damage?: string
	damageType?: string
	weaponProperties?: string[]
	chargesInfo?: string
	rechargeType?: string
	tags?: string[]
	isEquipped: boolean
	isAttuned: boolean
	quantity: number
}

export interface UpdateItemRequest {
	isEquipped?: boolean
	isAttuned?: boolean
	quantity?: number
}

export interface AddSpellRequest {
	name: string
	level: number
	school?: string
	range?: string
	castingTime?: string
	concentration: boolean
	isRitual: boolean
	components?: string
	prepared: boolean
}

export interface AddFeatRequest {
	name: string
	requirement?: string
	description?: string
}

export interface AddFeatureRequest {
	name: string
	description?: string
	featureType: string
	featureLevel?: number
}

export interface AddProficiencyRequest {
	name: string
	proficiencyType: string
	hasExpertise: boolean
	abilityKey?: string
}

export interface UpdateSpellSlotRequest {
	slotLevel: number
	remainingSlots: number
}

// Helpers
export const getAbilityMod = (score: number): number => Math.floor((score - 10) / 2)

export const getProfBonus = (level: number): number => Math.ceil(level / 4) + 1

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
	subclass?: string
	level?: number
	currentHp?: number
	maxHp?: number
	campaignId?: number
	alignment?: string
	spellAbility?: string
	backgroundStory?: string
	appearance?: string
	notes?: string
	image?: File | null
}
