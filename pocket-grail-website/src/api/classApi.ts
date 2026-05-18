import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { ClassDto, SubclassDto } from '../types/character'

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
	}),
})

export const { useGetClassesQuery, useGetSubclassesQuery } = classApi
