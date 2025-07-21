import { Navigate } from 'react-router'

import useRole from '../Hooks/useRole'
import Spinner from '../Shared/Spinner'


const SellerRoute = ({ children }) => {
  const [role, isRoleLoading] = useRole()

  console.log('I was here, in SellerRoute')
  if (isRoleLoading) return Spinner
  if (role === 'seller') return children
  return <Navigate to='/' replace='true' />
}

export default SellerRoute
