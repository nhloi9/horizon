import { type Response, type NextFunction } from 'express'
import httpStatus from 'http-status'
// import tf from '@tensorflow/tfjs-node'
// import use from '@tensorflow-models/universal-sentence-encoder';

import _ from 'lodash'

import { postRepo } from '../repositories'
import type { RequestPayload } from '../types'
import { getApiResponse } from '../utils'
import { prisma } from '../database/postgres'

export const createPost = async (
  req: RequestPayload,
  res: Response,
  next: NextFunction
) => {
  const { text, files, feel, location, tags, groupId } = req.body
  const userId = (req.payload as any).id
  try {
    const group =
      groupId !== undefined
        ? await prisma.group.findUnique({ where: { id: groupId } })
        : null

    const post = await postRepo.createPost({
      userId,
      text,
      feel,
      location,
      files,
      tags,
      groupId,
      ...(groupId !== undefined && {
        accepted: group?.adminId === userId || group?.requireApproval === false
      })
    })
    res.status(httpStatus.OK).json(
      getApiResponse({
        data: { post }
      })
    )
  } catch (error) {
    next(error)
  }
}

export const updatePost = async (
  req: RequestPayload,
  res: Response,
  next: NextFunction
) => {
  const { text, files, feel, location, tags } = req.body
  try {
    const post = await postRepo.updatePost({
      postId: Number(req.params.id),
      userId: (req.payload as any).id,
      text,
      feel,
      location,
      files,
      tags
    })
    res.status(httpStatus.OK).json(
      getApiResponse({
        data: { post }
      })
    )
  } catch (error) {
    next(error)
  }
}

export const getHomePosts = async (
  req: RequestPayload,
  res: Response,
  next: NextFunction
) => {
  try {
    const { oldPosts } = req.body
    let posts = await postRepo.getPosts(oldPosts)
    posts = posts.map((post: any, index: number) => {
      return {
        ...post

        // ...(numberComments > 5 && {
        //   sampleComment: _.sampleSize(
        //     post.comments,
        //     Math.floor(Math.random() * 4)
        //   )
        // })
      }
    })
    res.status(httpStatus.OK).json(
      getApiResponse({
        data: {
          posts: _.sampleSize(posts, 10)
        }
      })
    )
  } catch (error) {
    next(error)
  }
}

export const reactPost = async (
  req: RequestPayload,
  res: Response,
  next: NextFunction
) => {
  const { reactId } = req.body
  const postId = Number(req.params.id)
  const userId = (req.payload as any).id
  try {
    await prisma.postUserReact.upsert({
      where: {
        postId_userId: {
          postId,
          userId
        }
      },
      update: {
        reactId
      },
      create: {
        reactId,
        postId,
        userId
      }
    })
    res.status(httpStatus.OK).json({ msg: 'react post successfully' })
  } catch (error) {
    next(error)
  }
}

export const removeReactPost = async (
  req: RequestPayload,
  res: Response,
  next: NextFunction
) => {
  const postId = Number(req.params.id)
  const userId = (req.payload as any).id
  try {
    await prisma.postUserReact.deleteMany({
      where: {
        postId,
        userId
      }
    })

    res.status(httpStatus.OK).json({ msg: 'react post successfully' })
  } catch (error) {
    next(error)
  }
}

// function getPostsByFriend (userId: number) {}
// function getPostsByLike (userId: number) {}
// function getPostsBy
