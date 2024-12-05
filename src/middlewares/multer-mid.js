const multer  = require('multer') 

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "./public/temp")
	},
	filename: (req, file, cd) => { 
		cb(null, file.originalname)
	}
})

export const upload = multer({ storage });