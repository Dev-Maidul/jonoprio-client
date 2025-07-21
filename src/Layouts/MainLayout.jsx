import { Outlet } from 'react-router'
import Layout from './Layout'
import Navbar from '../Components/Navbar'
import Footer from '../Components/Footer'


const MainLayout = () => {
  return (
   <Layout>
     <div className=''>
      <Navbar />
      <div className='pt-24 min-h-[calc(100vh-68px)] w-11/12 mx-auto'>
        <Outlet />
      </div>
      <Footer />
    </div>
   </Layout>
  )
}

export default MainLayout