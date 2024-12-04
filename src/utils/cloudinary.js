import { v2 as cloudinary } from "cloudinary";
import fs from "fs"

// Configuration
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
});


const uploadOnCloudinary = async (localFilePath) => {
	try {
		if(!localFilePath) return null
		// upload the file on cloudnary
		const response = await cloudinary.uploader.upload(localFilePath, {resource_type: "auto"});

		// file has been uploaded successfully
		console.log("File is uploaded on cloudinay ", response);
		return response

	} catch (error) {
		fs.unlinkSync(localFilePath); // removes the locally saved temporary files as the upload operation goes failed.
		return null;
	}
}

export {uploadOnCloudinary}