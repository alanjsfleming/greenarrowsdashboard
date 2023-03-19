import React, { useRef, useState} from 'react'
import Footer from './components/Footer'
import MenuBar from './components/Navbar'
import { useAuth } from '../contexts/AuthContext'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'


export default function Signup() {
    const emailRef = useRef()
    const passwordRef = useRef()
    const passwordConfirmRef = useRef()
    const [error,setError] = useState('')
    const [loading,setLoading] = useState(false)
    const { signup }  = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async(e)=> {
        e.preventDefault()
        if (passwordRef.current.value !==passwordConfirmRef.current.value) {
            return setError('Passwords do not match')
        }
        try {
      
            setError('')
            setLoading(true)
            await signup(emailRef.current.value,passwordRef.current.value).then(navigate('/'))
        } catch (e) {
            console.log(e)
            setError('Could not create user')
        }
        setLoading(false)
        }


  return (
    <>
    <MenuBar />
    <div class="form-signin m-auto text-center my-5">
      <form class="signin-form px-5 py-3 border shadow" onSubmit={handleSubmit}>
        <img class="mb-4" src="/docs/5.3/assets/brand/bootstrap-logo.svg" alt="Logo" width="72" height="57" />
        <h1 class="h3 mb-3 fw-normal">Register Free Account</h1>
        
        {error && <p className="alert alert-danger alert-dismissible">{error}</p>}
        <div class="form-floating">
          <input type="email" class="form-control mb-2" id="floatingEmail" placeholder="name@example.com" ref={emailRef} required/>
          <label for="floatingInput">Email address</label>
        </div>
        <div class="form-floating mb-2">
          <input type="password" class="form-control" id="floatingPassword" placeholder="Password" ref={passwordRef} required/>
          <label for="floatingPassword">Password</label>
        </div>
        <div class="form-floating mb-2">
          <input type="password" class="form-control" id="floatingPasswordConfirm" placeholder="Confirm Password" ref={passwordConfirmRef} required/>
          <label for="floatingPassword">Confirm Password</label>
        </div>
            
        <button class="w-100 btn btn-lg btn-dark" type="submit" disabled={loading}>Register</button>
            
        <div  class="mt-2">
          <p>Already have an account? <Link to="/login">Login</Link></p>
        </div>
      </form>
    </div>
    <Footer />
    </>
  )
}