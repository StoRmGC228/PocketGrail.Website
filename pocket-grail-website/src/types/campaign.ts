export interface CampaignParticipantDto {
	userId: number
	username: string
	role: 'DungeonMaster' | 'Player'
}

export interface CampaignDto {
	id: number
	name: string
	shortDescription: string
	connectionCode: string
	imageUrl?: string
	isActive: boolean
	dmOwnerId: number
	dmOwnerUsername: string
	participantCount: number
	createdAt: string
	participants: CampaignParticipantDto[]
}

export interface CreateCampaignFormValues {
	name: string
	password: string
	shortDescription: string
	image: File | null
}

export interface JoinCampaignRequest {
	connectionCode?: string
	campaignId?: number
	// Password is required when joining by campaignId; omit when joining by code/link
	password?: string
}
