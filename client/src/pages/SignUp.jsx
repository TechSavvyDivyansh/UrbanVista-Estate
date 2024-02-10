import React, { useState } from 'react'
import {Link,useNavigate} from 'react-router-dom';

import OAuth from '../components/OAuth.jsx';

export default function SignUp() {

  const[formData,setFormData]=useState({})
  const[Loading,SetLoading]=useState(false)
  const[DispError,SetDispError]=useState(null)
  const[SuccessMessage,SetSuccessMessage]=useState(false)
  const navigate=useNavigate()


  const handleChange=(e)=>{
      setFormData({
          ...formData,
          [e.target.id]:e.target.value
      })
  }

  const handleSubmit=async(e)=>{

      e.preventDefault()
      SetLoading(true) //

      try {
            const res=await fetch('/api/auth/signup',
            {
              method:"POST",
              headers:{
                'content-type':'application/json'
              },
              body:JSON.stringify(formData)
            }
          )
          const data=await res.json()

          if(data.success===false)
          {
            SetLoading(false)
            SetDispError(data.message)
            SetSuccessMessage(false)
            return;
          } //

          SetLoading(false) //
          SetDispError(null)
          SetSuccessMessage(true)
          navigate('/sign-in')

      } catch (error) {
          SetLoading(false)
          SetSuccessMessage(false)
          SetDispError(error.message)
      }
  }


  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>

      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input type="text" placeholder='username' className='border p-3 rounded-lg' id='username' onChange={handleChange}/>
        <input type="email" placeholder='email' className='border p-3 rounded-lg' id='email' onChange={handleChange}/>
        <input type="password" placeholder='password' className='border p-3 rounded-lg' id='password' onChange={handleChange}/>
        <button disabled={Loading} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-50'>{Loading?"Loading...":"Sign Up"}</button>
        <OAuth/>
      </form>

      <div className="flex gap-2 mt-5">
        <p>Have an account?</p>
        <Link to={"/sign-in"}><span className='text-blue-700'>Sign in</span></Link>
      </div>
      {DispError && <p className='text-red-500 mt-5'>{DispError}</p>}
      {SuccessMessage && <p className='text-green-800 mt-5'>User Created Successfully</p>}
    </div>
  )
}
