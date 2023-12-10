import React, { useEffect, useMemo, useState } from 'react'
import CommentDisplay from './CommentDisplay'

const Comments = ({ post, comments }) => {
  // const [firstLevelComments, setFirstLevelComments] = useState([])
  const [showComments, setShowComments] = useState([])
  const [showCount, setShowCount] = useState(2)
  // useEffect(() => {
  //   const comments = [...post.comments].sort((a, b) => {
  //     let condition =
  //       new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  //     return condition
  //   })
  //   // console.log(comments)
  //   setFirstLevelComments(comments.filter(comment => !comment.reply))
  // }, [post.comments])

  // const firstLevelComments = useMemo((

  // )=>{},[comments])
  useEffect(() => {
    setShowComments(comments.slice(0, showCount))
  }, [comments, showCount])
  // console.log({ showComments })
  return (
    <div className='p-4'>
      {showComments?.map(comment => (
        <CommentDisplay
          // createComment={createComment}
          key={comment._id}
          comment={comment}
          post={post}
          // answere={
          //   post.comments.filter(
          //     item => item.reply && item.reply === comment._id
          //   )
          //   // .sort((a, b) => {
          //   //   let condition =
          //   //     new Date(b.createdAt).getTime() -
          //   //     new Date(a.createdAt).getTime()
          //   //   return condition
          //   // })
          // }
        />
      ))}

      {comments?.length > 2 && (
        <div className=' border-y border-gray-300 py-2'>
          {showCount < comments.length ? (
            <span
              className='text-red-500 cursor-pointer'
              onClick={() => {
                setShowCount(pre => pre + 3)
              }}
            >
              show more comments...
            </span>
          ) : (
            <span
              className='text-red-500 cursor-pointer'
              onClick={() => {
                setShowCount(2)
              }}
            >
              hidden comments...
            </span>
          )}
        </div>
      )}
    </div>
  )
}

export default Comments
