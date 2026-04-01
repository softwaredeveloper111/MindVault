import {Routes,Route} from "react-router-dom"
import Login from "./features/auth/pages/Login"
import Register from "./features/auth/pages/Register"
import ProtectedRoute from "./features/shared/ProtectedRoute"
import GuestRoute from "./features/shared/GuestRoute"
import Dashboard  from "./features/item/pages/Dashboard"


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
                <Dashboard/>
              </ProtectedRoute>
            }/>
    </Routes>
  )
}

export default AppRouter