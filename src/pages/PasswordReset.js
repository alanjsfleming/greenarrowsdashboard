import React, { useRef, useState,useEffect} from 'react'
import Footer from '../layouts/Footer'
import MenuBar from '../layouts/Navbar'
import { useAuth } from '../contexts/AuthContext'
import { Link } from 'react-router-dom'
import Emoji from '../layouts/Emoji'

export default function Signup() {
    // Send a page view event to Firebase Analytics
 

    const emailRef = useRef()
    const [error,setError] = useState('')
    const [success,setSuccess] = useState('')
    const [loading,setLoading] = useState(false)
    const { passwordreset }  = useAuth()

    const handleSubmit = async(e)=> {
        e.preventDefault()
        try {
            setError('')
            setSuccess('')
            setLoading(true)
            await passwordreset(emailRef.current.value)
        } catch (e) {
            console.log(e)
            setError(e.message)
        }
        if (!error) { setSuccess('Check your emails for a password reset link') }
        setLoading(false)
        }


  return (
    <>
    <MenuBar />
    <div class="form-signin m-auto text-center my-5">
      <form class="signin-form px-5 py-3 border shadow" onSubmit={handleSubmit}>
      <Emoji symbol="🦉" label="owl" /><h1 class="h3 mb-3 fw-normal">Password Reset</h1>
        
        {error && <p className="alert alert-danger alert-dismissible">{error}</p>}
        {success && <p className="alert alert-success alert-dismissible">{success}</p>}
        <div class="form-floating">
          <input type="email" class="form-control mb-2" id="floatingEmail" placeholder="name@example.com" ref={emailRef} required/>
          <label for="floatingInput">Email address</label>
        </div>
            
        <button class="w-100 btn btn-lg btn-dark" type="submit" disabled={loading}>Reset Password</button>
            
        <div  class="mt-2">
          <Link to="/login">Login</Link>
        </div>
      </form>
    </div>
    <Footer />
    </>
  )
}