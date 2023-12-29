import { type Response, type NextFunction } from 'express'
import httpStatus from 'http-status'
import path from 'path'
import { getDownloadURL } from 'firebase-admin/storage'

import { bucket } from '../utils/firebase'

import { getApiResponse } from '../utils'
import { messages } from '../constants'
// import { fileRepo } from '../repositories'
import type { RequestPayload } from '../types'
import { error } from 'console'

export const uploadFile = async (
  req: RequestPayload,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.file === undefined) {
      return res
        .status(404)
        .json(
          getApiResponse(messages.FILE_NOT_PROVIDED, res, 'FILE_NOT_PROVIDED')
        )
    }
    const name =
      req.file.originalname.split('.')[0] +
      Math.floor(Math.random() * 1e10)
        .toString()
        .slice(2, 6)
    const fileName = name + path.extname(req.file.originalname)
    bucket
      .file(fileName)
      .createWriteStream()
      .end(req.file.buffer)
      .on('finish', () => {
        const fileRef = bucket.file(fileName)
        // console.log({ fileRef })
        getDownloadURL(fileRef)
          .then(downloadURL => {
            res.status(httpStatus.OK).json(
              getApiResponse({
                data: {
                  file: {
                    name: fileName,
                    url: downloadURL
                  }
                }
              })
            )
          })
          .catch(error => {
            next(error)
          })
        // const file = await fileRepo.createFile({
        //   ownerId: (req.payload as any).id,
        //   name: fileName,
        //   url
        // })
      })
      .on('error', err => {
        next(err)
      })
    // const [url] = await bucket.file(fileName).getSignedUrl({
    //   version: 'v2',
    //   action: 'read',
    //   expires: Date.now() + 1000 * 60 * 60 * 24 * 60
    // })
  } catch (error) {
    next(error)
  }
}

// export const deleteFile = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     fs.unlink('uploads/' + req.params.fileName, (err: any) => {
//       if (err !== null) {
//         if (err.code === 'ENOENT') {
//           res.status(httpStatus.NOT_FOUND)
//           // .json(getApiResponse(messages.FILE_NOT_FOUND))
//         } else next(err)
//       } else {
//         return res.status(httpStatus.OK)
//         // .json(getApiResponse(messages.FILE_DELETED_SUCCESS))
//       }
//     })
//   } catch (error) {
//     next(error)
//   }
// }
