
import { Navigate, useLocation } from 'react-router'
import useAuth from '../Hooks/useAuth'
import Spinner from '../Shared/Spinner'

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) return <Spinner></Spinner>
  if (user) return children
  return <Navigate to='/login' state={{ from: location }} replace='true' />
}

export default PrivateRoute
