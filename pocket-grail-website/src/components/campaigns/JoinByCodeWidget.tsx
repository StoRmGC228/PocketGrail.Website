import { useState, useRef, useEffect, type KeyboardEvent } from 'react'
import { HiMiniXMark } from 'react-icons/hi2'
import { useJoinCampaignMutation } from '../../api/campaignApi'
import type { CampaignDto } from '../../types/campaign'

const CODE_LENGTH = 6

interface JoinByCodeWidgetProps {
	initialCode?: string
	onSuccess?: (campaign: CampaignDto) => void
	onClose?: () => void
}

function getErrorMessage(err: unknown): string {
	if (err && typeof err === 'object' && 'data' in err) {
		const data = (err as { data: unknown }).data
		if (data && typeof data === 'object' && 'message' in data) {
			return String((data as { message: unknown }).message)
		}
	}
	return 'Something went wrong. Please try again.'
}

export const JoinByCodeWidget = ({ initialCode, onSuccess, onClose }: JoinByCodeWidgetProps) => {
	const [codeDigits, setCodeDigits] = useState<string[]>(() => {
		const digits = Array(CODE_LENGTH).fill('')
		if (initialCode) {
			const cleaned = initialCode.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()
			for (let i = 0; i < CODE_LENGTH && i < cleaned.length; i++) {
				digits[i] = cleaned[i]
			}
		}
		return digits
	})
	const [error, setError] = useState('')
	const digitRefs = useRef<(HTMLInputElement | null)[]>([])

	const [joinCampaign, { isLoading }] = useJoinCampaignMutation()

	const codeComplete = codeDigits.every(d => d !== '')

	useEffect(() => {
		if (!initialCode) digitRefs.current[0]?.focus()
	}, [initialCode])

	const handleDigitChange = (index: number, value: string) => {
		const char = value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(-1)
		const next = [...codeDigits]
		next[index] = char
		setCodeDigits(next)
		if (char && index < CODE_LENGTH - 1) {
			digitRefs.current[index + 1]?.focus()
		}
	}

	const handleDigitKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Backspace' && !codeDigits[index] && index > 0) {
			digitRefs.current[index - 1]?.focus()
		}
	}

	const handleDigitPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
		const pasted = e.clipboardData.getData('text').replace(/[^a-zA-Z0-9]/g, '').toUpperCase()
		if (!pasted) return
		e.preventDefault()
		const next = Array(CODE_LENGTH).fill('')
		for (let i = 0; i < CODE_LENGTH && i < pasted.length; i++) {
			next[i] = pasted[i]
		}
		setCodeDigits(next)
		const focusIdx = Math.min(pasted.length, CODE_LENGTH - 1)
		digitRefs.current[focusIdx]?.focus()
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!codeComplete) return
		setError('')
		try {
			const campaign = await joinCampaign({
				connectionCode: codeDigits.join(''),
			}).unwrap()
			onSuccess?.(campaign)
		} catch (err) {
			setError(getErrorMessage(err))
		}
	}

	const card = (
		<div className='bg-[#2d2533] border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl'>
			<div className='flex items-center justify-between mb-4'>
				<h3 className='text-white font-semibold text-base'>Join by Code</h3>
				{onClose && (
					<button
						type='button'
						onClick={onClose}
						className='text-white/50 hover:text-white transition-colors cursor-pointer'
						aria-label='Close'
					>
						<HiMiniXMark size={22} />
					</button>
				)}
			</div>

			<form onSubmit={handleSubmit} className='flex flex-col gap-4'>
				{/* 6-box code input */}
				<div className='flex gap-2 justify-center'>
					{codeDigits.map((digit, i) => (
						<input
							key={i}
							ref={el => { digitRefs.current[i] = el }}
							type='text'
							inputMode='text'
							maxLength={1}
							value={digit}
							onChange={e => handleDigitChange(i, e.target.value)}
							onKeyDown={e => handleDigitKeyDown(i, e)}
							onPaste={handleDigitPaste}
							className='w-10 h-12 text-center text-white font-mono text-lg bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--color-nb) uppercase'
						/>
					))}
				</div>

				{error && <p className='text-red-400 text-sm text-center'>{error}</p>}

				<button
					type='submit'
					disabled={isLoading || !codeComplete}
					className='bg-(--color-nb) text-white font-semibold py-3 sm:py-2 rounded-lg w-full text-base sm:text-sm hover:brightness-110 transition-[filter] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer'
				>
					{isLoading ? 'Joining…' : 'Join Campaign'}
				</button>
			</form>
		</div>
	)

	if (onClose) {
		return (
			<div className='fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4'>
				{card}
			</div>
		)
	}

	return card
}
