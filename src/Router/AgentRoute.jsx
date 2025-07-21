import { Navigate } from 'react-router'

import useRole from '../Hooks/useRole'
import Spinner from '../Shared/Spinner'


const AgentRoute = ({ children }) => {
  const [role, isRoleLoading] = useRole()

  console.log('I was here, in Agent')
  if (isRoleLoading) return Spinner
  if (role === 'agent') return children
  return <Navigate to='/' replace='true' />
}

export default AgentRoute
