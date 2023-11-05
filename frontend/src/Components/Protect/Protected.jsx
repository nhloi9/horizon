import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
function Protected ({ children }) {
  const { loading } = useSelector(state => state.alert)
  const { isLogin } = useSelector(state => state.auth)
  if (!loading && !isLogin) {
    return <Navigate to='/signin' replace />
  }
  if (loading && !isLogin) {
    return null
  }
  return children
}
export default Protected
