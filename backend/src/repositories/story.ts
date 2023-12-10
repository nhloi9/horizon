import { prisma } from '../database/postgres'

const createStory = async (data: any, file: object): Promise<any> => {
  const story = await prisma.story.create({
    data: {
      ...data,
      video: {
        create: file
      }
    },
    include: {
      user: {
        select: {
          id: true,
          firstname: true,
          lastname: true,
          avatar: {
            select: { name: true, url: true }
          }
        }
      },
      video: {
        select: {
          id: true,
          name: true,
          url: true
        }
      }
    }
  })
  return story
}

export { createStory }
