
import { useEffect } from "react";
import Approuter from "./Approuter";
import useAuth from "./features/auth/hooks/useAuth"



const App = () => {

  const { HandleGetMeAPI} = useAuth();

  useEffect(()=>{

    HandleGetMeAPI()

  },[])

  return (
    <div className="app">
     <Approuter/>
    </div>
  )
}

export default App