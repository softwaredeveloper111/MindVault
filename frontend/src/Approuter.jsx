import {Routes,Route} from "react-router-dom"
import Login from "./features/auth/pages/Login"
import Register from "./features/auth/pages/Register"
import ProtectedRoute from "./features/shared/ProtectedRoute"
import GuestRoute from "./features/shared/GuestRoute"


const AppRouter = () => {
  return (
    <Routes>
      <Route path="/login" element={
        <GuestRoute>
          <Login/>
        </GuestRoute>
      }/>


      <Route path="/register" element={
        <GuestRoute>
          <Register/>
        </GuestRoute>

      }/>


            <Route path="/" element={
              <ProtectedRoute>
                <h1>Home page</h1>
              </ProtectedRoute>
            }/>
    </Routes>
  )
}

export default AppRouter