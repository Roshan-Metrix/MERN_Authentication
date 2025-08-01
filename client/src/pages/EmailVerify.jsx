import React , { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { toast } from 'react-toastify'
import axios from 'axios'
import { AppContent } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'

const EmailVerify = () => {

  const navigate = useNavigate();
  

  const [otp,setOtp] = useState(Array(6));
 
const { backendUrl, getAuthState } = useContext(AppContent);

  const onSubmitHandler = async (e) => {
       try{
        e.preventDefault();
        axios.defaults.withCredentials = true;
        const { data } = await axios.post(backendUrl + '/api/auth/verify-account',{otp})
        if(data.success){
          getAuthState();
          navigate('/');
        }else{
          toast.error(data.message)
        }
       } catch(error){
        toast.error(error.message)
       }
  }

  // handling input otp 
  const inputRefs = React.useRef([])

  const handleInput = (e, index) => {
    if(e.target.value.length > 0 && index < inputRefs.current.length - 1){
      inputRefs.current[index + 1].focus();
    }
  }

const handleKeyDown = (e, index) => {
  if(e.key === 'Backspace' && e.target.value === '' && index > 0){
    inputRefs.current[index - 1].focus();
  }
}
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div onClick={() => navigate('/')} className='cursor-pointer flex absolute top-3 sm:left-20 left-3'>
      <img  src={assets.logo} alt='' className='w-26 sm:w-32 ' />
      <span className='text-gray-800 font-semibold sm:text-5xl text-3xl sm:pt-11 pt-9 '>MernAuth</span>
      </div>

      <div className="max-w-md w-full rounded-2xl shadow-lg p-8 text-center bg-slate-900">
        <h2 className="text-3xl font-bold mb-3 text-gray-200">Email Verification</h2>
        <p className="text-gray-400 mb-7">Enter the 6-digit OTP sent to your email</p>

        <form onSubmit={onSubmitHandler} className="flex flex-col items-center">
          <div className="flex gap-3 mb-6 justify-center">
            {Array(6).fill(0).map((_, index) => (
              <input
              type="text"
                key={index}
                // onChange = {(e) => setOtp(e.target.value)}
                // value={otp}
                maxLength={1}
                pattern="[0-9]*"
                required
                ref={e => inputRefs.current[index] = e}
                onInput = {(e) => handleInput(e, index)}
                onKeyDown = {(e) => handleKeyDown(e, index)}
                className="w-12 h-14 text-2xl text-center border-2 border-gray-300 rounded-lg outline-none bg-gray-100 focus:border-blue-500 focus:bg-white transition"
              />
            ))}
          </div>
          <button
            type="submit"
            className="bg-gradient-to-r from-blue-600 to-blue-400 text-white text-lg font-medium py-3 rounded-lg w-full shadow hover:from-blue-700 hover:to-blue-500 transition"
          >
            Verify
          </button>
        </form>
      </div>
    </div>
  )
}

export default EmailVerify