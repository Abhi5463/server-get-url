import File from '../models/file.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

export const uploadImage = async (request, response) => {
    const fileObj = {
      name: request.file.originalname,
    };
    
    try {
      const s3 = new AWS.S3();
      const params = {
        Bucket: 'cyclic-shiny-ruby-polo-shirt-ap-southeast-2',
        Key: fileObj.name,
        Body: request.file.buffer,
      };
      
      await s3.upload(params).promise();
      
      // Create a new file record in your MongoDB collection if needed
      // Update the response accordingly based on your application logic
      response.status(200).json({ message: 'File uploaded successfully' });
    } catch (error) {
      console.error(error.message);
      response.status(500).json({ error: error.message });
    }
  };
  

export const getImage = async (request, response) => {
    try {   
        const file = await File.findById(request.params.fileId);
        
        file.downloadCount++;

        await file.save();

        response.download(file.path, file.name);
    } catch (error) {
        console.error(error.message);
        response.status(500).json({ msg: error.message });
    }
}