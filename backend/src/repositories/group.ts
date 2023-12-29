import type { Group, accessGroup } from '@prisma/client'
import { prisma } from '../database/postgres'

const createGroup = async (
  name: string,
  privacy: accessGroup,
  userId: number,
  invites: number[]
): Promise<any> => {
  const group = await prisma.group.create({
    data: {
      name,
      privacy,
      creatorId: userId,
      adminId: userId,
      requests: {
        create: invites.map((userId: number) => ({
          userId,
          status: 'waiting',
          type: 'invite'
        }))
      },
      image: {
        create: {
          name: 'default_image_group',
          url: 'https://www.facebook.com/images/groups/groups-default-cover-photo-2x.png'
        }
      }
    },
    include: {
      creator: {
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
      admin: {
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
      image: {
        select: {
          id: true,
          name: true,
          url: true
        }
      }
    }
  })
  return group
}

const getGroup = async (groupId: number): Promise<any> => {
  const group = await prisma.group.findUnique({
    where: { id: groupId },
    include: {
      creator: {
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
      admin: {
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
      image: {
        select: {
          id: true,
          name: true,
          url: true
        }
      },
      requests: {
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
      }
    }
  })
  return group
}

export { createGroup, getGroup }
