import { type Response, type NextFunction } from 'express'
import httpStatus from 'http-status'

import { friendRepo, notifyRepo, userRepo } from '../repositories'
import { messages } from '../constants'
import type { RequestPayload } from '../types'
import { getApiResponse } from '../utils'

// export const getAllFriends = async (
//   req: RequestPayload,
//   res: Response,
//   next: NextFunction
// ): Promise<any> => {
//   try {
//     const userId = (req.payload as any).id
//     const friendsRequest = await friendRepo.findAllFriends(userId)
//     const friendsId = friendsRequest.map((request: any) =>
//       request.senderId === userId ? request.receiverId : request.senderId
//     )
//     const friends = await userRepo.findUsers({ id: { in: friendsId } })
//     return res.status(httpStatus.OK).json(getApiResponse({ data: { friends } }))
//   } catch (error) {
//     next(error)
//   }
// }

// export const getReceiveRequests = async (
//   req: RequestPayload,
//   res: Response,
//   next: NextFunction
// ): Promise<any> => {
//   try {
//     const userId = (req.payload as any).id
//     const friendsRequest = await friendRepo.findReceiveRequests(userId)
//     const friends = friendsRequest.map((request: any) => request.sender)
//     return res.status(httpStatus.OK).json(getApiResponse({ data: { friends } }))
//   } catch (error) {
//     next(error)
//   }
// }

// export const getSendRequests = async (
//   req: RequestPayload,
//   res: Response,
//   next: NextFunction
// ): Promise<any> => {
//   try {
//     const userId = (req.payload as any).id
//     const friendsRequest = await friendRepo.findSendRequests(userId)
//     const friends = friendsRequest.map((request: any) => request.receiver)
//     return res.status(httpStatus.OK).json(getApiResponse({ data: { friends } }))
//   } catch (error) {
//     next(error)
//   }
// }

export const getAllRequests = async (
  req: RequestPayload,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const userId = (req.payload as any).id
    const requests = await friendRepo.findAllRequests(userId)

    return res
      .status(httpStatus.OK)
      .json(getApiResponse({ data: { requests } }))
  } catch (error) {
    next(error)
  }
}

export const createRequestFriend = async (
  req: RequestPayload,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { receiverId } = req.body
    const senderId = (req.payload as any).id
    const receiver = await userRepo.findUser({
      id: Number(receiverId)
    })
    if (receiver == null) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json(getApiResponse(messages.USER_NOT_FOUND, res, 'USER_NOT_FOUND'))
    }

    const existingFriendRequest = await friendRepo.findFriendRequest(
      senderId,
      Number(receiverId)
    )
    if (existingFriendRequest.length > 0) {
      return res
        .status(httpStatus.CONFLICT)
        .json(
          getApiResponse(
            messages.FRIEND_REQUEST_DUPLICATE,
            res,
            'FRIEND_REQUEST_DUPLICATE'
          )
        )
    }
    const request = await friendRepo.createFriendRequest(
      senderId,
      Number(receiverId)
    )
    await notifyRepo
      .createNotify({
        notifyData: {
          text: 'sent you a friend request',
          url: `http://localhost:3000/profile/${senderId as string}`,
          type: 'createRequestFriend'
        },
        senderId: (req.payload as any).id,
        receiverId
      })
      .catch(err => {
        console.log(err)
      })
    res.status(httpStatus.OK).json(getApiResponse({ data: { request } }))
  } catch (error) {
    next(error)
  }
}

export const deleteRequestFriend = async (
  req: RequestPayload,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { id } = req.params
    await friendRepo.deleteFriendRequest(Number(id))

    res
      .status(httpStatus.OK)
      .json(getApiResponse({ msg: 'Friend request delete success' }))
  } catch (error) {
    next(error)
  }
}

export const updateRequestFriend = async (
  req: RequestPayload,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { id } = req.params
    await friendRepo.updateFriendRequest(Number(id))

    res
      .status(httpStatus.OK)
      .json(getApiResponse({ msg: 'Friend request accepted success' }))
  } catch (error) {
    next(error)
  }
}
