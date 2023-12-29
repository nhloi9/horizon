import { prisma } from '../database/postgres'

const createStory = async (
  mutedOriginal: boolean,
  song: object,
  userId: number,
  file?: any
): Promise<any> => {
  const story = await prisma.story.create({
    data: {
      song,
      mutedOriginal,
      user: {
        connect: {
          id: userId
        }
      },
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
      },
      views: {
        select: {
          id: true,
          firstname: true,
          lastname: true,
          avatar: {
            select: {
              id: true,
              name: true,
              url: true
            }
          }
        }
      },
      comments: true
    }
  })
  return story
}

const getHomeStories = async (
  friendsId: number[],
  userId: number
): Promise<any> => {
  const stories = await prisma.story.findMany({
    where: {
      // userId: { in: friendsId },
      // createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      // views: { none: { id: userId } }
    },
    include: {
      video: {
        select: {
          id: true,
          name: true,
          url: true
        }
      },
      user: {
        select: {
          id: true,
          firstname: true,
          lastname: true,
          avatar: {
            select: {
              id: true,
              name: true,
              url: true
            }
          }
        }
      },
      views: {
        select: {
          id: true
          // firstname: true,
          // lastname: true,
          // avatar: {
          //   select: {
          //     id: true,
          //     name: true,
          //     url: true
          //   }
          // }
        }
      },
      comments: {
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              firstname: true,
              lastname: true,
              avatar: {
                select: {
                  id: true,
                  name: true,
                  url: true
                }
              }
            }
          }
        }
      },
      reacts: {
        include: {
          react: true,
          user: {
            select: {
              id: true,
              firstname: true,
              lastname: true,
              avatar: {
                select: {
                  id: true,
                  name: true,
                  url: true
                }
              }
            }
          }
        }
      }
    }
  })
  return stories
}

export { createStory, getHomeStories }
