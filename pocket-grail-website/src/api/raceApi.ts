import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { RaceDto } from '../types/character'

export const raceApi = createApi({
	reducerPath: 'raceApi',
	baseQuery: fetchBaseQuery({
		baseUrl: import.meta.env.VITE_API_BASE_URL ?? 'https://localhost:7228/api',
		credentials: 'include',
	}),
	tagTypes: ['Race'],
	endpoints: builder => ({
		getRaces: builder.query<RaceDto[], void>({
			query: () => 'Races',
			providesTags: ['Race'],
		}),
		getRaceByName: builder.query<RaceDto, string>({
			query: name => `Races/${name}`,
			providesTags: ['Race'],
		}),
	}),
})

export const { useGetRacesQuery, useGetRaceByNameQuery } = raceApi
