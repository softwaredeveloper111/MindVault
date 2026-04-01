import { configureStore } from '@reduxjs/toolkit'
import authReducer from "./features/auth/auth.slice"


export default configureStore({
  reducer: {
    authentication:authReducer
  }
})