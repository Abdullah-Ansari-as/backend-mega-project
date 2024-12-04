const multer  = require('multer') 

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "./public/temp")
	},
	filename: (req, file, cd) => {
		const filename = `${Date.now()}-${file.originalname}`
		cb(null, filename)
	}
})

export const upload = multer({ storage });