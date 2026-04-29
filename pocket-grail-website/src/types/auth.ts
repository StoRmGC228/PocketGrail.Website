export type UserRole = 'Player' | 'DungeonMaster'

export interface AuthUser {
	userId: string
	username: string
	role: UserRole
}

export interface RegisterRequest {
	email: string
	username: string
	password: string
	role: UserRole
}

export interface LoginRequest {
	email: string
	password: string
}

export interface PendingVerificationResponse {
	email: string
}

export interface VerifyCodeRequest {
	email: string
	code: string
}
