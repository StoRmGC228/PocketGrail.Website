import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { AuthUser, LoginRequest, RegisterRequest, PendingVerificationResponse, VerifyCodeRequest } from '../types/auth'

export const authApi = createApi({
	reducerPath: 'authApi',
	baseQuery: fetchBaseQuery({
		baseUrl: import.meta.env.VITE_API_BASE_URL ?? 'https://localhost:7228/api',
		credentials: 'include',
	}),
	tagTypes: ['AuthUser'],
	endpoints: builder => ({
		register: builder.mutation<PendingVerificationResponse, RegisterRequest>({
			query: body => ({ url: 'Auth/register', method: 'POST', body }),
		}),
		login: builder.mutation<PendingVerificationResponse, LoginRequest>({
			query: body => ({ url: 'Auth/login', method: 'POST', body }),
		}),
		verify: builder.mutation<void, VerifyCodeRequest>({
			query: body => ({ url: 'Auth/verify', method: 'POST', body }),
		}),
		me: builder.query<AuthUser, void>({
			query: () => 'Auth/me',
			providesTags: ['AuthUser'],
		}),
		logout: builder.mutation<void, void>({
			query: () => ({ url: 'Auth/logout', method: 'POST' }),
			invalidatesTags: ['AuthUser'],
		}),
	}),
})

export const {
	useRegisterMutation,
	useLoginMutation,
	useVerifyMutation,
	useLazyMeQuery,
	useLogoutMutation,
} = authApi
