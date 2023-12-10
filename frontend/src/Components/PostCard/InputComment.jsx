import { Button } from 'antd'
import React, { useContext, useEffect, useRef, useState } from 'react'
import InputEmoji from 'react-input-emoji'
import { useSelector } from 'react-redux'
import { CommentsContext } from './CommentsContext'

const InputComment = ({ comment, setOpen }) => {
  const ref = useRef()
  const [focus, setFocus] = useState(false)
  const [text, setText] = useState('')
  const { user } = useSelector(state => state.auth)
  const { createComment } = useContext(CommentsContext)

  const handleComment = () => {
    createComment({
      content: text,
      parentId: comment
        ? comment.parentId
          ? comment.parentId
          : comment.id
        : null,
      receiver: comment && comment.parentId ? comment.sender : null
    })
    setFocus && setFocus(false)
    setText('')
    setOpen && setOpen(false)
  }

  useEffect(() => {
    // if (comment?.id) {
    setFocus(true)
    ref.current?.focus()
    // }
  }, [])

  return (
    <div className={`px-4 py-1  flex }`}>
      {comment && comment?.parentId && comment?.sender?.id !== user.id && (
        <h3 className='translate-y-1 font-[500] mr-1 min-w-[100px] max-w-[150px]'>
          {'@' + comment.sender.firstname + ' ' + comment.sender.lastname}
        </h3>
      )}
      <div className='w-full'>
        <InputEmoji
          disableRecent
          ref={ref}
          className='block p-1 w-full outline-none border-b border-gray-400 focus:border-b-2 focus:border-gray-700 '
          value={text}
          onChange={setText}
          cleanOnEnter
          onFocus={() => {
            setFocus(true)
          }}
          // onBlur={() => {
          //   setFocus(false)
          // }}
          // onEnter={handleOnEnter}
          placeholder={comment ? '' : 'Write your comment'}
        />
        {focus && (
          <div className={`flex justify-between py-2 relative -mt-4 `}>
            {/* <EmojiSelect textRef={textRef} css={'left-2'} /> */}
            <div></div>
            <div>
              {!comment && (
                <Button
                  size='small'
                  type='link'
                  danger
                  className='!mr-2 text-red-400 '
                  onClick={() => setFocus(false)}
                >
                  Cancel
                </Button>
              )}
              <Button
                size='small'
                type='link'
                className=''
                onClick={handleComment}
                disabled={!(text && text.trim())}
              >
                Comment
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default InputComment
