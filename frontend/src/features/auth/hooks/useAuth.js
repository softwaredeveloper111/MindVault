import {registerAPI , loginAPI , getMeAPI , logoutAPI } from "../services/auth.api"
import {setUser,setLoading,setError,setAuthChecked} from "../auth.slice"
import {useDispatch} from "react-redux"



const useAuth = () => {

  const dispatch = useDispatch()


  
   const HandleRegisterAPI = async(userData)=>{

    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      const response = await registerAPI(userData)
      console.log(response)
      dispatch(setUser(response.data))
      dispatch(setAuthChecked(true))
      return response

    } catch (error) {
       console.dir(error)
       const message = error?.response?.data?.message || "registration failed";
       dispatch(setError(message));
       return error.response.data
    }
    finally{
       dispatch(setLoading(false))
    }
   }



   const HandleLoginAPI = async(userData)=>{
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      const response = await loginAPI(userData);
      console.log(response)
      dispatch(setUser(response.data));
      dispatch(setAuthChecked(true))
      return response
    } catch (error) {
      console.dir(error)
      const message = error?.response?.data?.message || "login failed";
      dispatch(setError(message));
      return error.response.data
    }
    finally{
      dispatch(setLoading(false))
    }
   }


  

   const  HandleGetMeAPI = async()=>{
    try {
      dispatch(setLoading(true))
      dispatch(setError(null));
      const response = await getMeAPI();
      dispatch(setUser(response.data));
      dispatch(setAuthChecked(true))
      return response
    } catch (error) {
      const message = error?.response?.data?.message || "get me failed";
      dispatch(setError(message))
    }finally{
       dispatch(setLoading(false))
       dispatch(setAuthChecked(true))
    }
   }





  const HandleLogoutAPI = async()=>{
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      const response = await logoutAPI();
      dispatch(setUser(null));
      return response
    } catch (error) {
       const message = error?.response?.data?.message || "logut failed";
       dispatch(setError(message)) 
    }
    finally{
      dispatch(setLoading(false))
    }
  }





  return {
     HandleRegisterAPI,
     HandleLoginAPI,
     HandleGetMeAPI,
     HandleLogoutAPI,
     

  }
}

export default useAuth


