import { prisma } from '../database/postgres'
// import { type IUser } from '../types'

const createPost = async (postData: any, files: any): Promise<any> => {
  const newPost = await prisma.post.create({
    data: {
      ...postData,
      ...(files.length > 0 && {
        files: {
          create: files
        }
      })
    },
    include: {
      files: true
    }
  })
  return newPost
}

const getPosts = async (oldPosts: any): Promise<any> => {
  const posts = await prisma.post.findMany({
    where: {
      id: {
        notIn: oldPosts
      }
    },
    include: {
      files: true,
      user: {
        include: { avatar: true }
      },
      reacts: {
        include: {
          react: true,
          user: true
        }
      },
      comments: {
        include: {
          sender: {
            select: {
              id: true,
              firstname: true,
              lastname: true,
              avatar: {
                select: { name: true, url: true }
              }
            }
          },
          receiver: {
            select: {
              id: true,
              firstname: true,
              lastname: true,
              avatar: {
                select: { name: true, url: true }
              }
            }
          },
          answers: {
            include: {
              sender: {
                select: {
                  firstname: true,
                  lastname: true,
                  avatar: {
                    select: { name: true, url: true }
                  },
                  id: true
                }
              },
              receiver: {
                select: {
                  id: true,
                  firstname: true,
                  lastname: true,
                  avatar: {
                    select: { name: true, url: true }
                  }
                }
              }
            }
          }
        }
      }
    }
  })
  return posts
}

export { createPost, getPosts }
