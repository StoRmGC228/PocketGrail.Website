import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { ClassDto, SubclassDto, ClassStartingItemSetDto } from '../types/character'

export const classApi = createApi({
	reducerPath: 'classApi',
	baseQuery: fetchBaseQuery({
		baseUrl: import.meta.env.VITE_API_BASE_URL ?? 'https://localhost:7228/api',
		credentials: 'include',
	}),
	tagTypes: ['Class'],
	endpoints: builder => ({
		getClasses: builder.query<ClassDto[], void>({
			query: () => 'Classes',
			providesTags: ['Class'],
		}),
		getSubclasses: builder.query<SubclassDto[], string>({
			query: className => `Classes/${className}/subclasses`,
			providesTags: ['Class'],
		}),
		getStartingItems: builder.query<ClassStartingItemSetDto, string>({
			query: className => `Classes/${className}/starting-items`,
			providesTags: ['Class'],
		}),
	}),
})

export const { useGetClassesQuery, useGetSubclassesQuery, useGetStartingItemsQuery } = classApi
