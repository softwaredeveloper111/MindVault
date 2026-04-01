import { useSelector } from "react-redux"
import LoadingPage from "./LoadingPage"
import {Navigate} from "react-router-dom"

const GuestRoute = ({children}) => {
  
  const {user, isAuthChecked} = useSelector(state=>state.authentication)

  if(!isAuthChecked) return <LoadingPage/>
  
  if(user) return <Navigate to="/" replace/>;

  return children
}

export default GuestRoute