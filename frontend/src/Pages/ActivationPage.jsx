import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { activeAcountAction } from '../Reduxs/Actions/authAction'

const ActivationPage = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { token } = useParams()
  const { loading } = useSelector(state => state.alert)
  const { isLogin } = useSelector(state => state.auth)

  useEffect(() => {
    if (loading === false) {
      if (isLogin) navigate('/')
      else {
        dispatch(activeAcountAction(token))
        navigate('/signin')
      }
    }
  }, [loading, isLogin, dispatch, navigate, token])
  return <div></div>
}

export default ActivationPage
