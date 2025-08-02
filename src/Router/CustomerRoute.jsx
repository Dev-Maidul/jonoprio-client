import { Navigate } from 'react-router'

import useRole from '../Hooks/useRole'
import Spinner from '../Shared/Spinner'


const CustomerRoute = ({ children }) => {
  const [role, isRoleLoading] = useRole()

  console.log('I was here, in customer')
  if (isRoleLoading) return Spinner
  if (role === 'customer') return children
  return <Navigate to='/' replace='true' />
}

export default CustomerRoute
