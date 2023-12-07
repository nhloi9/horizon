import React, { useState } from 'react'
import CommentCard from './CommentCard'
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io'

const CommentDisplay = ({ comment, post, createComment }) => {
  const [showAnsweres, setShowAnswres] = useState(false)
  console.log({ comment })
  return (
    <div className='mb-5'>
      <CommentCard
        comment={comment}
        post={post}
        createComment={createComment}
      />
      {comment.answers?.length > 0 && (
        <div
          className='flex items-center mx-[30px] gap-1 cursor-pointer text-blue-800 !text-sm'
          onClick={() => setShowAnswres(!showAnsweres)}
        >
          {showAnsweres ? (
            <IoIosArrowUp size={20} />
          ) : (
            <IoIosArrowDown size={20} />
          )}
          <span className='text-sm'>{comment.answers?.length} replies</span>
        </div>
      )}
      {showAnsweres && (
        <div className='ml-[30px]'>
          {comment.answers &&
            comment.answers.map(cm => (
              <CommentCard
                key={cm.id}
                comment={cm}
                post={post}
                createComment={createComment}
              />
            ))}
        </div>
      )}
    </div>
  )
}

export default CommentDisplay
