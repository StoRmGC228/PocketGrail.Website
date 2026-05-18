export interface CharacterClassDto {
	id: number
	className: string
	classLevel: number
	hitDice: string
	subclass?: string
	totalHitDice: number
}

export interface SkillProficiencyDto {
	skill: string
	hasExpertise: boolean
}

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
	weaponProperties?: string
	chargesInfo?: string
	rechargeType?: string
	tags?: string
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
	classes: CharacterClassDto[]
	classDisplay: string
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
	classes: CharacterClassDto[]
	classDisplay: string
	level: number
	proficiencyBonus: number
	currentHp: number
	maxHp: number
	tempHp: number
	usedHitDice: number
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
	spellSlots: SpellSlotDto[]
	savingThrows: string[]
	skillProficiencies: SkillProficiencyDto[]
	languages: string[]
	instruments: string[]
	weapons: string[]
	armors: string[]
	createdAt: string
	updatedAt: string
}

// Request payload types
export interface UpdateStatsRequest {
	strScore?: number
	dexScore?: number
	conScore?: number
	intScore?: number
	wisScore?: number
	chaScore?: number
	armorClass?: number
	speed?: number
	spellAbility?: string
	alignment?: string
}

export interface UpdateVitalsRequest {
	currentHp?: number
	maxHp?: number
	tempHp?: number
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
	weaponProperties?: string
	chargesInfo?: string
	rechargeType?: string
	tags?: string
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

// Class management
export interface AddCharacterClassRequest {
	className: string
}

export interface LevelUpRequest {
	strIncrease?: number
	dexIncrease?: number
	conIncrease?: number
	intIncrease?: number
	wisIncrease?: number
	chaIncrease?: number
	newFeat?: AddFeatRequest
}

export interface LevelUpResponse {
	requiresAbilityScoreChoice: boolean
	message?: string
	character?: CharacterDetailDto
}

export interface SetSubclassRequest {
	subclassId: number
}

export interface UpdateCharacterClassRequest {
	subclass?: string
	usedHitDice?: number
}

// D&D reference data
export interface SubclassDto {
	id: number
	name: string
	shortDescription?: string
	classId: number
}

export interface ClassDto {
	id: number
	name: string
	hitDice: string
	spellAbility?: string
	skillChoiceCount: number
	subclasses: SubclassDto[]
}

export interface RaceFeatureDto {
	id: number
	name: string
	description?: string
}

export interface RaceDto {
	id: number
	name: string
	baseSpeed: number
	strBonus: number
	dexBonus: number
	conBonus: number
	intBonus: number
	wisBonus: number
	chaBonus: number
	flexibleBonusPoints: number
	weaponGrants: string[]
	armorGrants: string[]
	languageGrants: string[]
	instrumentGrants: string[]
	features: RaceFeatureDto[]
}

// Helpers
export const getAbilityMod = (score: number): number => Math.floor((score - 10) / 2)

export const getProfBonus = (level: number): number => Math.ceil(level / 4) + 1

export interface CharacterDto {
	id: number
	name: string
	race: string
	classes: CharacterClassDto[]
	classDisplay: string
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
	className: string
	campaignId?: number
	image?: File | null
	strScore: number
	dexScore: number
	conScore: number
	intScore: number
	wisScore: number
	chaScore: number
	flexStrBonus: number
	flexDexBonus: number
	flexConBonus: number
	flexIntBonus: number
	flexWisBonus: number
	flexChaBonus: number
	startingItemIds: number[]
	skillChoices: string[]
	weaponChoices: string[]
	armorChoices: string[]
	languageChoices: string[]
	instrumentChoices: string[]
}

export interface UpdateCharacterFormValues {
	id: number
	name?: string
	race?: string
	currentHp?: number
	maxHp?: number
	campaignId?: number
	alignment?: string
	backgroundStory?: string
	appearance?: string
	notes?: string
	image?: File | null
}
