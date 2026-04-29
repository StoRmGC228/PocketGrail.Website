import { useState, useRef } from 'react'
import type { FormEvent, KeyboardEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useLoginMutation, useRegisterMutation, useVerifyMutation, useLazyMeQuery } from '../api/authApi'
import { setUser } from '../redux/slices/authSlice'
import { saveUserCookie } from '../utils/authCookie'
import type { UserRole } from '../types/auth'
import type { AppDispatch } from '../redux/store'

type Tab = 'login' | 'register'
type View = 'form' | 'verify'

const CODE_LENGTH = 6

export function AuthPage() {
	const dispatch = useDispatch<AppDispatch>()
	const navigate = useNavigate()
	const [tab, setTab] = useState<Tab>('login')
	const [view, setView] = useState<View>('form')

	const [login, { isLoading: loginLoading }] = useLoginMutation()
	const [register, { isLoading: registerLoading }] = useRegisterMutation()
	const [verify, { isLoading: verifyLoading }] = useVerifyMutation()
	const [triggerMe] = useLazyMeQuery()

	// Login form state
	const [loginEmail, setLoginEmail] = useState('')
	const [loginPassword, setLoginPassword] = useState('')

	// Register form state
	const [regEmail, setRegEmail] = useState('')
	const [regUsername, setRegUsername] = useState('')
	const [regPassword, setRegPassword] = useState('')
	const [regRole, setRegRole] = useState<UserRole>('Player')

	// Verification state
	const [pendingEmail, setPendingEmail] = useState('')
	const [codeDigits, setCodeDigits] = useState<string[]>(Array(CODE_LENGTH).fill(''))
	const digitRefs = useRef<(HTMLInputElement | null)[]>([])

	const [error, setError] = useState<string | null>(null)

	const handleLogin = async (e: FormEvent) => {
		e.preventDefault()
		setError(null)
		try {
			const { email } = await login({ email: loginEmail, password: loginPassword }).unwrap()
			setPendingEmail(email)
			setCodeDigits(Array(CODE_LENGTH).fill(''))
			setView('verify')
		} catch (err: unknown) {
			setError(getErrorMessage(err) ?? 'Invalid email or password.')
		}
	}

	const handleRegister = async (e: FormEvent) => {
		e.preventDefault()
		setError(null)
		try {
			const { email } = await register({
				email: regEmail,
				username: regUsername,
				password: regPassword,
				role: regRole,
			}).unwrap()
			setPendingEmail(email)
			setCodeDigits(Array(CODE_LENGTH).fill(''))
			setView('verify')
		} catch (err: unknown) {
			setError(getErrorMessage(err) ?? 'Registration failed. Try a different email.')
		}
	}

	const handleVerify = async (e: FormEvent) => {
		e.preventDefault()
		setError(null)
		const code = codeDigits.join('')
		if (code.length < CODE_LENGTH) {
			setError('Please enter the full 6-character code.')
			return
		}
		try {
			await verify({ email: pendingEmail, code }).unwrap()
			const user = await triggerMe().unwrap()
			dispatch(setUser(user))
			saveUserCookie(user)
			navigate('/')
		} catch (err: unknown) {
			setError(getErrorMessage(err) ?? 'Invalid or expired code. Please try again.')
		}
	}

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

	const isLoading = loginLoading || registerLoading

	const inputClass =
		'bg-white/10 border border-white/20 text-white placeholder-white/30 rounded-lg px-4 py-3 sm:py-2 w-full text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-(--color-nb)'
	const labelClass = 'block text-white/60 text-xs mb-1'
	const btnClass =
		'mt-2 bg-(--color-nb) text-white font-semibold py-3 sm:py-2 rounded-lg w-full text-base sm:text-sm hover:brightness-110 transition-[filter] disabled:opacity-50 disabled:cursor-not-allowed'

	return (
		<div className='min-h-screen flex items-center justify-center bg-(--color-bg) px-4 py-10'>
			<div className='w-full max-w-sm sm:max-w-md bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl'>
				{/* Branding */}
				<h1 className='text-white text-xl sm:text-2xl font-bold text-center mb-6 tracking-wide'>
					⚔️ PocketGrail
				</h1>

				{view === 'form' && (
					<>
						{/* Tabs */}
						<div className='flex mb-6 border-b border-white/10'>
							<button
								className={`flex-1 pb-3 text-sm font-semibold transition-colors ${
									tab === 'login'
										? 'border-b-2 border-(--color-nb) text-white'
										: 'border-b-2 border-transparent text-white/40 hover:text-white/70'
								}`}
								onClick={() => { setTab('login'); setError(null) }}
							>
								Login
							</button>
							<button
								className={`flex-1 pb-3 text-sm font-semibold transition-colors ${
									tab === 'register'
										? 'border-b-2 border-(--color-nb) text-white'
										: 'border-b-2 border-transparent text-white/40 hover:text-white/70'
								}`}
								onClick={() => { setTab('register'); setError(null) }}
							>
								Register
							</button>
						</div>

						{/* Error message */}
						{error && (
							<p className='text-red-400 text-sm mb-4 text-center'>{error}</p>
						)}

						{/* Login Form */}
						{tab === 'login' && (
							<form onSubmit={handleLogin} className='flex flex-col gap-4'>
								<div>
									<label className={labelClass}>Email</label>
									<input
										type='email'
										required
										value={loginEmail}
										onChange={e => setLoginEmail(e.target.value)}
										placeholder='you@example.com'
										className={inputClass}
									/>
								</div>
								<div>
									<label className={labelClass}>Password</label>
									<input
										type='password'
										required
										value={loginPassword}
										onChange={e => setLoginPassword(e.target.value)}
										placeholder='••••••••'
										className={inputClass}
									/>
								</div>
								<button type='submit' disabled={isLoading} className={btnClass}>
									{loginLoading ? 'Signing in…' : 'Sign In'}
								</button>
							</form>
						)}

						{/* Register Form */}
						{tab === 'register' && (
							<form onSubmit={handleRegister} className='flex flex-col gap-4'>
								<div>
									<label className={labelClass}>Email</label>
									<input
										type='email'
										required
										value={regEmail}
										onChange={e => setRegEmail(e.target.value)}
										placeholder='you@example.com'
										className={inputClass}
									/>
								</div>
								<div>
									<label className={labelClass}>Username</label>
									<input
										type='text'
										required
										value={regUsername}
										onChange={e => setRegUsername(e.target.value)}
										placeholder='YourAdventurerName'
										className={inputClass}
									/>
								</div>
								<div>
									<label className={labelClass}>Password</label>
									<input
										type='password'
										required
										value={regPassword}
										onChange={e => setRegPassword(e.target.value)}
										placeholder='••••••••'
										className={inputClass}
									/>
								</div>
								<div>
									<label className={labelClass}>Role</label>
									<select
										value={regRole}
										onChange={e => setRegRole(e.target.value as UserRole)}
										className={inputClass}
									>
										<option value='Player' className='bg-(--color-bg)'>Player</option>
										<option value='DungeonMaster' className='bg-(--color-bg)'>Dungeon Master</option>
									</select>
								</div>
								<button type='submit' disabled={isLoading} className={btnClass}>
									{registerLoading ? 'Creating account…' : 'Create Account'}
								</button>
							</form>
						)}
					</>
				)}

				{view === 'verify' && (
					<>
						<p className='text-white/60 text-sm text-center mb-1'>
							We sent a 6-character code to
						</p>
						<p className='text-white font-semibold text-sm text-center mb-6 break-all'>
							{pendingEmail}
						</p>

						{error && (
							<p className='text-red-400 text-sm mb-4 text-center'>{error}</p>
						)}

						<form onSubmit={handleVerify} className='flex flex-col gap-6'>
							{/* Code digit inputs */}
							<div className='flex justify-center gap-2'>
								{codeDigits.map((digit, i) => (
									<input
										key={i}
										ref={el => { digitRefs.current[i] = el }}
										type='text'
										inputMode='text'
										maxLength={1}
										value={digit}
										autoFocus={i === 0}
										onChange={e => handleDigitChange(i, e.target.value)}
										onKeyDown={e => handleDigitKeyDown(i, e)}
										onPaste={i === 0 ? handleDigitPaste : undefined}
										className='w-11 h-14 text-center text-xl font-bold uppercase bg-white/10 border border-white/20 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-(--color-nb) caret-transparent'
									/>
								))}
							</div>

							<button type='submit' disabled={verifyLoading} className={btnClass}>
								{verifyLoading ? 'Verifying…' : 'Verify'}
							</button>
						</form>

						<button
							className='mt-4 w-full text-white/40 text-xs hover:text-white/70 transition-colors'
							onClick={() => { setView('form'); setError(null) }}
						>
							← Back to {tab === 'login' ? 'login' : 'registration'}
						</button>
					</>
				)}
			</div>
		</div>
	)
}

function getErrorMessage(err: unknown): string | null {
	if (!err || typeof err !== 'object') return null
	const e = err as Record<string, unknown>
	if (typeof e['data'] === 'string') return e['data']
	if (e['data'] && typeof e['data'] === 'object') {
		const d = e['data'] as Record<string, unknown>
		if (typeof d['message'] === 'string') return d['message']
	}
	if (typeof e['message'] === 'string') return e['message']
	return null
}
