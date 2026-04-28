import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { AuthUser, LoginRequest, RegisterRequest } from '../types/auth'

export const authApi = createApi({
	reducerPath: 'authApi',
	baseQuery: fetchBaseQuery({
		baseUrl: import.meta.env.VITE_API_BASE_URL ?? 'https://localhost:7228/api',
		credentials: 'include',
	}),
	tagTypes: ['AuthUser'],
	endpoints: builder => ({
		register: builder.mutation<Record<string, never>, RegisterRequest>({
			query: body => ({ url: 'Auth/register', method: 'POST', body }),
		}),
		login: builder.mutation<Record<string, never>, LoginRequest>({
			query: body => ({ url: 'Auth/login', method: 'POST', body }),
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
	useLazyMeQuery,
	useLogoutMutation,
} = authApi
