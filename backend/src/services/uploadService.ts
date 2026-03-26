import { v2 as cloudinary } from 'cloudinary'
import { Readable } from 'stream'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export const uploadService = {
  async uploadAvatar(buffer: Buffer, userId: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'fastrecipe/avatars',
          public_id: `avatar_${userId}`,
          overwrite: true,
          transformation: [
            { width: 300, height: 300, crop: 'fill', gravity: 'face' },
          ],
        },
        (error, result) => {
          if (error || !result) return reject(error ?? new Error('Upload falhou'))
          resolve(result.secure_url)
        }
      )

      const readable = new Readable()
      readable.push(buffer)
      readable.push(null)
      readable.pipe(uploadStream)
    })
  },
}