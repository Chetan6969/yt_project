import {v2 as cloudinary} from "cloudinary"
import fs from "fs"

cloudinary.config({
    ckouad_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;
        // upload the file on the cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        }) // File has been uploaded successfullly
        console.log("File is uploaded On Cloudinary successfully",response.url);
        return response;
        
    } catch (error) {
        fs.unlinkSync(localFilePath)//Removes the locallly saved temporary file ad the uplaod operation got failed\
        return null;
    }
}

export { uploadOnCloudinary }

// cloudinary.v2.uploader.upload("https://upload.wikimedia.ory")