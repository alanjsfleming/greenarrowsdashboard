import React, { useRef, useState} from 'react'
import Footer from './components/Footer'
import MenuBar from './components/Navbar'
import { useAuth } from '../contexts/AuthContext'
import { Link } from 'react-router-dom'


export default function Signup() {
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
        <img class="mb-4" src="/docs/5.3/assets/brand/bootstrap-logo.svg" alt="Logo" width="72" height="57" />
        <h1 class="h3 mb-3 fw-normal">Password Reset</h1>
        
        {error && <p className="alert alert-danger alert-dismissible">{error}</p>}
        {success && <p className="alert alert-success alert-dismissible">{success}</p>}
        <div class="form-floating">
          <input type="email" class="form-control mb-2" id="floatingEmail" placeholder="name@example.com" ref={emailRef} required/>
          <label for="floatingInput">Email address</label>
        </div>
            
        <button class="w-100 btn btn-lg btn-primary" type="submit" disabled={loading}>Reset Password</button>
            
        <div  class="mt-2">
          <Link to="/login">Login</Link>
        </div>
      </form>
    </div>
    <Footer />
    </>
  )
}