import { Navigate, useLocation } from 'react-router'

import useRole from '../Hooks/useRole'
import Spinner from '../Shared/Spinner';


const AdminRoute = ({ children }) => {
  const [role, isRoleLoading] = useRole()
  const location = useLocation()
  console.log(location)
  console.log('I was here, in Admin route')
  if (isRoleLoading) return Spinner
  if (role === 'admin') return children
  return <Navigate to='/' replace='true' />
}

export default AdminRoute
