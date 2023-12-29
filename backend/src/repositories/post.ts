import { prisma } from '../database/postgres'
// import { type IUser } from '../types'

const createPost = async ({
  files = [],
  tags = [],
  ...postData
}: any): Promise<any> => {
  const newPost = await prisma.post.create({
    data: {
      ...postData,
      ...(files.length > 0 && {
        files: {
          create: files
        }
      }),

      ...(tags?.length > 0 && {
        tags: {
          connect: tags.map((id: number) => ({
            id
          }))
        }
      })
    },
    include: {
      files: true,
      tags: {
        select: {
          id: true,
          firstname: true,
          lastname: true,
          avatar: true
        }
      }
    }
  })
  return newPost
}

const updatePost = async ({
  files = [],
  tags = [],
  postId,
  ...postData
}: any): Promise<any> => {
  const newPost = await prisma.post.update({
    where: {
      id: postId
    },
    data: {
      ...postData,
      files: {
        set: [],
        create: files.map((file: any) => ({
          name: file.name,
          url: file.url,
          thumbnail: file.thumbnail
        }))
      },
      tags: {
        set: [],
        connect: tags.map((id: number) => ({
          id
        }))
      }
    },
    include: {
      files: true,
      user: {
        select: {
          id: true,
          firstname: true,
          lastname: true,
          avatar: true
        }
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
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      },
      tags: {
        select: {
          id: true,
          firstname: true,
          lastname: true,
          avatar: true
        }
      }
    }
  })
  return newPost
}

const getPosts = async (oldPosts: any): Promise<any> => {
  // const posts = await prisma.post.findMany({
  //   where: {
  //     id: {
  //       notIn: oldPosts
  //     }
  //   },
  //   include: {
  //     files: true,
  //     user: {
  //       include: { avatar: true }
  //     },
  //     reacts: {
  //       include: {
  //         react: true,
  //         user: true
  //       }
  //     },
  //     comments: {
  //       include: {
  //         sender: {
  //           select: {
  //             id: true,
  //             firstname: true,
  //             lastname: true,
  //             avatar: {
  //               select: { name: true, url: true }
  //             }
  //           }
  //         },
  //         receiver: {
  //           select: {
  //             id: true,
  //             firstname: true,
  //             lastname: true,
  //             avatar: {
  //               select: { name: true, url: true }
  //             }
  //           }
  //         },
  //         answers: {
  //           include: {
  //             sender: {
  //               select: {
  //                 firstname: true,
  //                 lastname: true,
  //                 avatar: {
  //                   select: { name: true, url: true }
  //                 },
  //                 id: true
  //               }
  //             },
  //             receiver: {
  //               select: {
  //                 id: true,
  //                 firstname: true,
  //                 lastname: true,
  //                 avatar: {
  //                   select: { name: true, url: true }
  //                 }
  //               }
  //             }
  //           }
  //         }
  //       }
  //     }
  //   }
  // })
  const posts = await prisma.post.findMany({
    where: {},

    include: {
      _count: {
        select: {
          comments: true
        }
      },

      files: true,
      user: {
        select: {
          id: true,
          firstname: true,
          lastname: true,
          avatar: true
        }
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
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      },
      tags: {
        select: {
          id: true,
          firstname: true,
          lastname: true,
          avatar: true
        }
      }
    }
  })
  return posts
}

export { createPost, getPosts, updatePost }
