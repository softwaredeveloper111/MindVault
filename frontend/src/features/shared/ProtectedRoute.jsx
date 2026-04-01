import { useSelector} from "react-redux";
import {Navigate} from "react-router-dom"
import LoadingPage from "./LoadingPage";



const ProtectedRoute = ({children}) => {

  const {user, isAuthChecked} =  useSelector((state)=>state.authentication)
 
  if(!isAuthChecked){
    return <LoadingPage/>
  }

  if(!user) {
    return <Navigate to="/login" replace/>
  }

  return children;
}

export default ProtectedRoute
