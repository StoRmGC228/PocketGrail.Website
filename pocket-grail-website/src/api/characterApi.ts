import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type {
	CharacterDto,
	CharacterDetailDto,
	CreateCharacterFormValues,
	UpdateCharacterFormValues,
	UpdateStatsRequest,
	UpdateVitalsRequest,
	UpdateWalletRequest,
	AddItemRequest,
	UpdateItemRequest,
	AddSpellRequest,
	AddFeatRequest,
	AddFeatureRequest,
	AddProficiencyRequest,
	UpdateSpellSlotRequest,
	AddCharacterClassRequest,
	LevelUpRequest,
	LevelUpResponse,
	SetSubclassRequest,
	UpdateCharacterClassRequest,
	ItemDto,
	FeatDto,
	FeatureDto,
	ProficiencyDto,
	SpellSlotDto,
	AllyDto,
} from '../types/character'

export const characterApi = createApi({
	reducerPath: 'characterApi',
	baseQuery: fetchBaseQuery({
		baseUrl: import.meta.env.VITE_API_BASE_URL ?? 'https://localhost:7228/api',
		credentials: 'include',
	}),
	tagTypes: ['Character', 'CharacterSheet'],
	endpoints: builder => ({
		getMyCharacters: builder.query<CharacterDto[], void>({
			query: () => 'Characters/mine',
			providesTags: ['Character'],
		}),
		getCharacterById: builder.query<CharacterDto, number>({
			query: id => `Characters/${id}`,
			providesTags: ['Character'],
		}),
		getCharacterDetail: builder.query<CharacterDetailDto, number>({
			query: id => `Characters/${id}/sheet`,
			providesTags: ['CharacterSheet'],
		}),
		createCharacter: builder.mutation<CharacterDto, CreateCharacterFormValues>({
			query: ({
				name, race, className, campaignId, image,
				strScore, dexScore, conScore, intScore, wisScore, chaScore,
				flexStrBonus, flexDexBonus, flexConBonus, flexIntBonus, flexWisBonus, flexChaBonus,
				startingItemIds, skillChoices, weaponChoices, armorChoices, languageChoices, instrumentChoices,
			}) => {
				const body = new FormData()
				body.append('name', name)
				body.append('race', race)
				body.append('className', className)
				if (campaignId) body.append('campaignId', String(campaignId))
				if (image) body.append('image', image)
				body.append('strScore', String(strScore))
				body.append('dexScore', String(dexScore))
				body.append('conScore', String(conScore))
				body.append('intScore', String(intScore))
				body.append('wisScore', String(wisScore))
				body.append('chaScore', String(chaScore))
				body.append('flexStrBonus', String(flexStrBonus))
				body.append('flexDexBonus', String(flexDexBonus))
				body.append('flexConBonus', String(flexConBonus))
				body.append('flexIntBonus', String(flexIntBonus))
				body.append('flexWisBonus', String(flexWisBonus))
				body.append('flexChaBonus', String(flexChaBonus))
				startingItemIds.forEach(id => body.append('startingItemIds', String(id)))
				skillChoices.forEach(c => body.append('skillChoices', c))
				weaponChoices.forEach(c => body.append('weaponChoices', c))
				armorChoices.forEach(c => body.append('armorChoices', c))
				languageChoices.forEach(c => body.append('languageChoices', c))
				instrumentChoices.forEach(c => body.append('instrumentChoices', c))
				return { url: 'Characters', method: 'POST', body }
			},
			invalidatesTags: ['Character'],
		}),
		updateCharacter: builder.mutation<CharacterDto, UpdateCharacterFormValues>({
			query: ({ id, name, race, currentHp, maxHp, campaignId, image, alignment, backgroundStory, appearance, notes }) => {
				const body = new FormData()
				if (name) body.append('name', name)
				if (race) body.append('race', race)
				if (currentHp !== undefined) body.append('currentHp', String(currentHp))
				if (maxHp !== undefined) body.append('maxHp', String(maxHp))
				if (campaignId !== undefined) body.append('campaignId', String(campaignId))
				if (image) body.append('image', image)
				if (alignment !== undefined) body.append('alignment', alignment)
				if (backgroundStory !== undefined) body.append('backgroundStory', backgroundStory)
				if (appearance !== undefined) body.append('appearance', appearance)
				if (notes !== undefined) body.append('notes', notes)
				return { url: `Characters/${id}`, method: 'PUT', body }
			},
			invalidatesTags: ['Character', 'CharacterSheet'],
		}),
		deleteCharacter: builder.mutation<void, number>({
			query: id => ({ url: `Characters/${id}`, method: 'DELETE' }),
			invalidatesTags: ['Character'],
		}),
		updateStats: builder.mutation<CharacterDetailDto, { id: number } & UpdateStatsRequest>({
			query: ({ id, ...body }) => ({ url: `Characters/${id}/stats`, method: 'PUT', body }),
			invalidatesTags: ['CharacterSheet'],
		}),
		updateVitals: builder.mutation<CharacterDetailDto, { id: number } & UpdateVitalsRequest>({
			query: ({ id, ...body }) => ({ url: `Characters/${id}/vitals`, method: 'PUT', body }),
			invalidatesTags: ['CharacterSheet'],
		}),
		updateWallet: builder.mutation<CharacterDetailDto, { id: number } & UpdateWalletRequest>({
			query: ({ id, ...body }) => ({ url: `Characters/${id}/wallet`, method: 'PUT', body }),
			invalidatesTags: ['CharacterSheet'],
		}),
		updateCharacterImage: builder.mutation<CharacterDetailDto, { id: number; image: File; cropX: number; cropY: number; cropWidth: number; cropHeight: number }>({
			query: ({ id, image, cropX, cropY, cropWidth, cropHeight }) => {
				const body = new FormData()
				body.append('image', image)
				body.append('cropX', String(cropX))
				body.append('cropY', String(cropY))
				body.append('cropWidth', String(cropWidth))
				body.append('cropHeight', String(cropHeight))
				return { url: `Characters/${id}/image`, method: 'PUT', body }
			},
			invalidatesTags: ['CharacterSheet'],
		}),
		addItem: builder.mutation<ItemDto, { id: number } & AddItemRequest>({
			query: ({ id, ...body }) => ({ url: `Characters/${id}/items`, method: 'POST', body }),
			invalidatesTags: ['CharacterSheet'],
		}),
		updateItem: builder.mutation<ItemDto, { characterId: number; itemId: number } & UpdateItemRequest>({
			query: ({ characterId, itemId, ...body }) => ({ url: `Characters/${characterId}/items/${itemId}`, method: 'PUT', body }),
			invalidatesTags: ['CharacterSheet'],
		}),
		deleteItem: builder.mutation<void, { characterId: number; itemId: number }>({
			query: ({ characterId, itemId }) => ({ url: `Characters/${characterId}/items/${itemId}`, method: 'DELETE' }),
			invalidatesTags: ['CharacterSheet'],
		}),
		addSpell: builder.mutation<CharacterDetailDto, { id: number } & AddSpellRequest>({
			query: ({ id, ...body }) => ({ url: `Characters/${id}/spells`, method: 'POST', body }),
			invalidatesTags: ['CharacterSheet'],
		}),
		toggleSpellPrepared: builder.mutation<CharacterDetailDto, { characterId: number; spellId: number }>({
			query: ({ characterId, spellId }) => ({ url: `Characters/${characterId}/spells/${spellId}/toggle-prepared`, method: 'PATCH' }),
			invalidatesTags: ['CharacterSheet'],
		}),
		deleteSpell: builder.mutation<void, { characterId: number; spellId: number }>({
			query: ({ characterId, spellId }) => ({ url: `Characters/${characterId}/spells/${spellId}`, method: 'DELETE' }),
			invalidatesTags: ['CharacterSheet'],
		}),
		updateSpellSlot: builder.mutation<SpellSlotDto, { characterId: number } & UpdateSpellSlotRequest>({
			query: ({ characterId, ...body }) => ({ url: `Characters/${characterId}/spell-slots`, method: 'PUT', body }),
			invalidatesTags: ['CharacterSheet'],
		}),
		addFeat: builder.mutation<FeatDto, { id: number } & AddFeatRequest>({
			query: ({ id, ...body }) => ({ url: `Characters/${id}/feats`, method: 'POST', body }),
			invalidatesTags: ['CharacterSheet'],
		}),
		deleteFeat: builder.mutation<void, { characterId: number; featId: number }>({
			query: ({ characterId, featId }) => ({ url: `Characters/${characterId}/feats/${featId}`, method: 'DELETE' }),
			invalidatesTags: ['CharacterSheet'],
		}),
		addFeature: builder.mutation<FeatureDto, { id: number } & AddFeatureRequest>({
			query: ({ id, ...body }) => ({ url: `Characters/${id}/features`, method: 'POST', body }),
			invalidatesTags: ['CharacterSheet'],
		}),
		deleteFeature: builder.mutation<void, { characterId: number; featureId: number }>({
			query: ({ characterId, featureId }) => ({ url: `Characters/${characterId}/features/${featureId}`, method: 'DELETE' }),
			invalidatesTags: ['CharacterSheet'],
		}),
		addProficiency: builder.mutation<ProficiencyDto, { id: number } & AddProficiencyRequest>({
			query: ({ id, ...body }) => ({ url: `Characters/${id}/proficiencies`, method: 'POST', body }),
			invalidatesTags: ['CharacterSheet'],
		}),
		deleteProficiency: builder.mutation<void, { characterId: number; proficiencyId: number }>({
			query: ({ characterId, proficiencyId }) => ({ url: `Characters/${characterId}/proficiencies/${proficiencyId}`, method: 'DELETE' }),
			invalidatesTags: ['CharacterSheet'],
		}),
		getAllies: builder.query<AllyDto[], number>({
			query: id => `Characters/${id}/allies`,
			providesTags: ['CharacterSheet'],
		}),
		addCharacterClass: builder.mutation<CharacterDetailDto, { id: number } & AddCharacterClassRequest>({
			query: ({ id, ...body }) => ({ url: `Characters/${id}/classes`, method: 'POST', body }),
			invalidatesTags: ['Character', 'CharacterSheet'],
		}),
		levelUp: builder.mutation<LevelUpResponse, { id: number; classId: number; body?: LevelUpRequest }>({
			query: ({ id, classId, body }) => ({ url: `Characters/${id}/classes/${classId}/level-up`, method: 'POST', body: body ?? {} }),
			invalidatesTags: ['Character', 'CharacterSheet'],
		}),
		setSubclass: builder.mutation<CharacterDetailDto, { id: number; classId: number } & SetSubclassRequest>({
			query: ({ id, classId, ...body }) => ({ url: `Characters/${id}/classes/${classId}/subclass`, method: 'PATCH', body }),
			invalidatesTags: ['CharacterSheet'],
		}),
		updateCharacterClass: builder.mutation<CharacterDetailDto, { id: number; classId: number } & UpdateCharacterClassRequest>({
			query: ({ id, classId, ...body }) => ({ url: `Characters/${id}/classes/${classId}`, method: 'PATCH', body }),
			invalidatesTags: ['CharacterSheet'],
		}),
		deleteCharacterClass: builder.mutation<void, { id: number; classId: number }>({
			query: ({ id, classId }) => ({ url: `Characters/${id}/classes/${classId}`, method: 'DELETE' }),
			invalidatesTags: ['Character', 'CharacterSheet'],
		}),
	}),
})

export const {
	useGetMyCharactersQuery,
	useGetCharacterByIdQuery,
	useGetCharacterDetailQuery,
	useCreateCharacterMutation,
	useUpdateCharacterMutation,
	useDeleteCharacterMutation,
	useUpdateStatsMutation,
	useUpdateVitalsMutation,
	useUpdateWalletMutation,
	useUpdateCharacterImageMutation,
	useAddItemMutation,
	useUpdateItemMutation,
	useDeleteItemMutation,
	useAddSpellMutation,
	useToggleSpellPreparedMutation,
	useDeleteSpellMutation,
	useUpdateSpellSlotMutation,
	useAddFeatMutation,
	useDeleteFeatMutation,
	useAddFeatureMutation,
	useDeleteFeatureMutation,
	useAddProficiencyMutation,
	useDeleteProficiencyMutation,
	useGetAlliesQuery,
	useAddCharacterClassMutation,
	useLevelUpMutation,
	useSetSubclassMutation,
	useUpdateCharacterClassMutation,
	useDeleteCharacterClassMutation,
} = characterApi
