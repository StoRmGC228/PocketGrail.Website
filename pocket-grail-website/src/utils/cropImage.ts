export const PORTRAIT_RATIO = 9 / 11

interface CropRect {
	x: number
	y: number
	width: number
	height: number
}

export function cropImageToFile(file: File, crop: CropRect): Promise<File> {
	return new Promise((resolve, reject) => {
		const img = new Image()
		const objectUrl = URL.createObjectURL(file)
		img.onload = () => {
			const sx = (crop.x / 100) * img.naturalWidth
			const sy = (crop.y / 100) * img.naturalHeight
			const sw = (crop.width / 100) * img.naturalWidth
			const sh = (crop.height / 100) * img.naturalHeight

			const scale = Math.min(1, 1400 / sw)
			const outW = Math.round(sw * scale)
			const outH = Math.round(sh * scale)

			const canvas = document.createElement('canvas')
			canvas.width = outW
			canvas.height = outH
			canvas.getContext('2d')!.drawImage(img, sx, sy, sw, sh, 0, 0, outW, outH)
			URL.revokeObjectURL(objectUrl)
			canvas.toBlob(
				blob => {
					if (!blob) { reject(new Error('Canvas crop failed')); return }
					resolve(new File([blob], file.name.replace(/\.[^.]+$/, '') + '.jpg', { type: 'image/jpeg' }))
				},
				'image/jpeg',
				0.92,
			)
		}
		img.onerror = () => {
			URL.revokeObjectURL(objectUrl)
			reject(new Error('Failed to load image'))
		}
		img.src = objectUrl
	})
}
