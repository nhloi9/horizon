import React, { useEffect } from 'react'
import Header from '../Components/Layout/Header'
import GroupFeed from '../Components/Group/GroupFeed'
import { getApi } from '../network/api'
import { useDispatch } from 'react-redux'
import { postTypes } from '../Reduxs/Types/postType'

const GroupFeedPage = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    getApi('/posts/group/feed')
      .then(({ data: { posts } }) => {
        dispatch({ type: postTypes.GET_HOME_POST_SUCCESS, payload: posts })
      })
      .catch(err => {})

    return () =>
      dispatch({ type: postTypes.GET_HOME_POST_SUCCESS, payload: [] })
  }, [dispatch])
  return (
    <div>
      <Header />
      <GroupFeed />
    </div>
  )
}

export default GroupFeedPage
