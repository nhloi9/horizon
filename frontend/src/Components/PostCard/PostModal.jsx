import { Modal } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PostCard from './PostCard'
import { getApi, postApi } from '../../network/api'
import Comments from './Comments'
import CardBody from './CardBody'
import CardFooter from './CardFooter'
import InputComment from './InputComment'
import CardHeader from './CardHeader'
import toast from 'react-hot-toast'

const PostModal = ({ post, isModalOpen, setIsModalOpen }) => {
  const [comments, setComments] = useState([])
  const { user } = useSelector(state => state.auth)
  const commentRef = useRef()

  const addComment = (comment, comments) => {
    let cloneComments = structuredClone(comments)

    if (comment.parentId) {
      const parentComment = cloneComments.find(
        item => item.id === comment.parentId
      )
      parentComment.answers.push(comment)
    } else {
      cloneComments = [comment, ...cloneComments]
    }
    return cloneComments
  }

  const createComment = async ({ content, parentId, receiver }) => {
    try {
      let originalComments = comments
      const previewComment = {
        postId: post.id,
        senderId: user.id,
        parentId,
        receiverId: receiver?.id,
        content: content,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        sender: user,
        receiver,
        answers: []
      }
      setComments(addComment(previewComment, comments))

      const {
        data: { comment }
      } = await postApi('/comments', {
        content,
        postId: post.id,
        parentId,
        receiverId: receiver?.id
      })
      setComments(addComment(comment, originalComments))
    } catch (error) {
      toast.error(error)
    }
  }

  useEffect(() => {
    getApi('/comments', {
      postId: post.id,
      limitPerPage: 1000
    })
      .then(response => {
        setComments(response.data.comments)
      })
      .catch(err => {
        console.log(err)
      })
  }, [post?.id])

  useEffect(() => {
    commentRef?.current?.scrollIntoView()
  }, [])

  return (
    <>
      <Modal
        width={1000}
        open={isModalOpen}
        // title='Title'
        // onOk={handleOk}
        onCancel={() => {
          setIsModalOpen(false)
        }}
        footer={[]}
        maskClosable={false}
      >
        <div className='max-h-[70vh] overflow-scroll'>
          <CardHeader post={post} />
          <CardBody post={post} />
          <CardFooter post={post} />
          <div ref={commentRef}></div>
          <InputComment createComment={createComment} post={post} />
          <Comments comments={comments} createComment={createComment} />
        </div>
      </Modal>
    </>
  )
}

export default PostModal
