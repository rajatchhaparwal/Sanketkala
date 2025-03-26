
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'


{/* to protect the routes from directly access to unAuthenticated person */}

const ProtectedRoutes = ({children}) => {

    const isAuthenticated = false;
    const navigate = useNavigate();

    useEffect(() => {
        if(!isAuthenticated) navigate('/SignIn');
    } ,[]);

  return (
    children
  )
}

export default ProtectedRoutes;
