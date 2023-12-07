import { type Response, type NextFunction } from 'express'
import httpStatus from 'http-status'
// import aposToLexForm from 'apos-to-lex-form'
import expandContractions from '@stdlib/nlp-expand-contractions'
import natural from 'natural'
// import SpellCorrector from 'spelling-corrector'
import SpellChecker from 'spellchecker'
// import SpellChecker from 'simple-spellchecker';
// import dictionary from 'dictionary-en'

// import nspell from 'nspell'
// nspell('d')
import { commentRepo } from '../repositories'
// import type { RequestPayload } from '../types'
import { getApiResponse } from '../utils'
// import Spellchecker from 'hunspell-spellchecker'
import type { RequestPayload } from '../types'

// const spellchecker = new Spellchecker()
// spellchecker.suggest('hello')

export const createComment = async (
  req: RequestPayload,
  res: Response,
  next: NextFunction
) => {
  const { content, receiverId, parentId, postId } = req.body

  // Converting contractions into standard lexicon
  const lexedContent = expandContractions(content)
  console.log(lexedContent)
  // text data to lowercase
  const casedContent = lexedContent.toLowerCase()
  console.log(casedContent)
  // Removing non-alphabetical and special characters
  const alphaOnlyContent = casedContent.replace(/[^a-zA-Z\s]+/g, '')
  console.log(alphaOnlyContent)
  const { WordTokenizer } = natural
  const tokenizer = new WordTokenizer()
  // plitting a text into its individual meaningful units.
  let tokenizedContent: any = tokenizer.tokenize(alphaOnlyContent)
  tokenizedContent = tokenizedContent === null ? [] : tokenizedContent

  // tokenizedContent.forEach((word, index) => {
  //     tokenizedContent[index] = nspell.
  //   })

  try {
    const comment = await commentRepo.createComment({
      content,
      receiverId,
      parentId,
      postId,
      senderId: (req.payload as any).id
    })
    res.status(httpStatus.OK).json(
      getApiResponse({
        data: { comment }
      })
    )
  } catch (error) {
    next(error)
  }
}

export const getComments = async (
  req: RequestPayload,
  res: Response,
  next: NextFunction
) => {
  try {
    const { postId, limitPerPage = 5, cusor } = req.query

    const comments = await commentRepo.getComments(
      Number(postId),
      Number(limitPerPage),
      Number(cusor)
    )
    let newCusor
    if (comments.length > limitPerPage) {
      newCusor = comments.pop().id
    }

    res.status(httpStatus.OK).json(
      getApiResponse({
        data: {
          comments,
          cusor: newCusor
        }
      })
    )
  } catch (error) {
    next(error)
  }
}

// export const reactPost = async (
//   req: RequestPayload,
//   res: Response,
//   next: NextFunction
// ) => {
//   const { reactId } = req.body
//   const postId = Number(req.params.id)
//   const userId = (req.payload as any).id
//   try {
//     await prisma.postUserReact.upsert({
//       where: {
//         postId_userId: {
//           postId,
//           userId
//         }
//       },
//       update: {
//         reactId
//       },
//       create: {
//         reactId,
//         postId,
//         userId
//       }
//     })
//     res.status(httpStatus.OK).json({ msg: 'react post successfully' })
//   } catch (error) {
//     next(error)
//   }
// }

// export const removeReactPost = async (
//   req: RequestPayload,
//   res: Response,
//   next: NextFunction
// ) => {
//   const postId = Number(req.params.id)
//   const userId = (req.payload as any).id
//   try {
//     await prisma.postUserReact.deleteMany({
//       where: {
//         postId,
//         userId
//       }
//     })

//     res.status(httpStatus.OK).json({ msg: 'react post successfully' })
//   } catch (error) {
//     next(error)
//   }
// }

// function getPostsByFriend (userId: number) {}
// function getPostsByLike (userId: number) {}
// function getPostsBy
