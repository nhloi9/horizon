import { type Response, type NextFunction } from 'express'
import httpStatus from 'http-status'

import { friendRepo, userRepo } from '../repositories'
import { messages } from '../constants'
import type { RequestPayload } from '../types'
import { getApiResponse } from '../utils'

export const addRequestFriend = async (
  req: RequestPayload,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const receiverId = req.params.other
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
    await friendRepo.createFriendRequest(senderId, Number(receiverId))
    res
      .status(httpStatus.OK)
      .json(
        getApiResponse(
          messages.FRIEND_REQUEST_SUCCESS,
          res,
          'FRIEND_REQUEST_SUCCESS'
        )
      )
  } catch (error) {
    next(error)
  }
}

export const cancelFriendRequest = async (
  req: RequestPayload,
  res: Response
): Promise<any> => {
  const { count } = await friendRepo.deleteFriendRequest(
    (req.payload as any).id,
    Number(req.params.other)
  )
  if (count === 0) {
    return res
      .status(httpStatus.NOT_FOUND)
      .json(
        getApiResponse(
          messages.FRIEND_REQUEST_NOT_FOUND,
          res,
          'FRIEND_REQUEST_NOT_FOUND'
        )
      )
  }
  return res
    .status(httpStatus.OK)
    .json(
      getApiResponse(
        messages.FRIEND_REQUEST_DELETE_SUCCESS,
        res,
        'FRIEND_REQUEST_DELETE_SUCCESS'
      )
    )
}

export const acceptFriendRequest = async (
  req: RequestPayload,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { count } = await friendRepo.acceptedFriendRequest(
      Number(req.params.other),
      (req.payload as any).id
    )
    if (count === 0) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json(
          getApiResponse(
            messages.FRIEND_REQUEST_NOT_FOUND,
            res,
            'FRIEND_REQUEST_NOT_FOUND'
          )
        )
    }
    return res
      .status(httpStatus.OK)
      .json(
        getApiResponse(
          messages.FRIEND_REQUEST_ACCEPT_SUCCESS,
          res,
          'FRIEND_REQUEST_ACCEPT_SUCCESS'
        )
      )
  } catch (error) {
    next(error)
  }
}

export const getAllFriends = async (
  req: RequestPayload,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const userId = (req.payload as any).id
    const friendsRequest = await friendRepo.findAllFriends(userId)
    const friendsId = friendsRequest.map((request: any) =>
      request.senderId === userId ? request.receiverId : request.senderId
    )
    const friends = await userRepo.findUsers({ id: { in: friendsId } })
    return res.status(httpStatus.OK).json(getApiResponse({ data: { friends } }))
  } catch (error) {
    next(error)
  }
}

export const getReceiveRequests = async (
  req: RequestPayload,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const userId = (req.payload as any).id
    const friendsRequest = await friendRepo.findReceiveRequests(userId)
    const friends = friendsRequest.map((request: any) => request.sender)
    return res.status(httpStatus.OK).json(getApiResponse({ data: { friends } }))
  } catch (error) {
    next(error)
  }
}

export const getSendRequests = async (
  req: RequestPayload,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const userId = (req.payload as any).id
    const friendsRequest = await friendRepo.findSendRequests(userId)
    const friends = friendsRequest.map((request: any) => request.receiver)
    return res.status(httpStatus.OK).json(getApiResponse({ data: { friends } }))
  } catch (error) {
    next(error)
  }
}
