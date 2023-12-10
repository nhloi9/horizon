import { type Response, type NextFunction } from 'express'
import httpStatus from 'http-status'
// import tf from '@tensorflow/tfjs-node'
// import use from '@tensorflow-models/universal-sentence-encoder';

import _ from 'lodash'

import { postRepo, storyRepo } from '../repositories'
import type { RequestPayload } from '../types'
import { getApiResponse } from '../utils'
import { prisma } from '../database/postgres'

export const createStory = async (
  req: RequestPayload,
  res: Response,
  next: NextFunction
) => {
  const { mutedOriginal, song, file } = req.body
  try {
    const story = await storyRepo.createStory(
      {
        userId: (req.payload as any).id,
        song,
        mutedOriginal
      },
      file
    )
    res.status(httpStatus.OK).json(
      getApiResponse({
        data: { story }
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
      const numberComments = post.comments?.length
      return {
        ...post,
        comments: undefined,
        numberComments,

        ...(numberComments > 5 && {
          sampleComment: _.sampleSize(
            post.comments,
            Math.floor(Math.random() * 4)
          )
        })
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
