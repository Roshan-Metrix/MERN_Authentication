import {useState, createContext,useEffect } from 'react'
import { toast } from 'react-toastify'
import axios from "axios"

export const AppContent = createContext();

export const AppContentProvider = (props) => {
  
    axios.defaults.withCredentials = true;

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [isLoggedin, setIsLoggedin] = useState(false);
    const [userData, setUserData] = useState(false);
   
   const getUserData = async () => {
    try{
      const {data} = await axios.get(backendUrl + '/api/user/data');
      data.success ? setUserData(data.userData) : toast.error(data.message)
    } catch (error){
      toast.error(error.message);
    }
   }


    const getAuthState = async () => {
      try{
        const {data} = await axios.get(backendUrl + '/api/auth/is-auth',{otp})
        if(data.success){
          setIsLoggedin(true)
          getUserData()
         } 
      }catch(error){
        toast.error(error.message)
      }
    }


 useEffect(() => {
  getAuthState();
 },[])

   const value = {
     backendUrl,
     isLoggedin, setIsLoggedin,
     userData, setUserData,
     getUserData,
     getAuthState
   }

    return(

        <AppContent.Provider value={value}>
         {props.children}
        </AppContent.Provider>

    )
}
