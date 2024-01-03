import React, { useRef, useState } from 'react'
import Footer from '../layouts/Footer'
import MenuBar from '../layouts/Navbar'
import { useAuth } from '../contexts/AuthContext'
import { Link, Navigate } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import Emoji from '../layouts/Emoji'
import GoogleButton from 'react-google-button'



export default function Signup() {
    // Send a page view event to Firebase Analytics

  
    const emailRef = useRef()
    const passwordRef = useRef()
    const passwordConfirmRef = useRef()
    const [error,setError] = useState('')
    const [loading,setLoading] = useState(false)
    const { signup,login,googleSignIn,currentUser }  = useAuth()
    const navigate = useNavigate()

    function resolveAfterRegistering(email,password) {
      if (!email && !password) return new Promise(async (resolve,reject) => {
        try {
          await googleSignIn()
          resolve('resolved')
        } catch (e) {
          setError('Could not create user')
          reject('rejected')
        }
      })
      
      return new Promise(async (resolve,reject) => {
        try{
          await signup(email,password);
          await login(email,password);
          resolve('resolved')
        } catch (e) {
          // Fire base error codes
          switch (e.code) {
            case 'auth/email-already-in-use':
              setError('Email already in use')
              break;
            case 'auth/invalid-email':
              setError('Invalid email')
              break;
            case 'auth/weak-password':
              setError('Password must be at least 6 characters')
            break;
            default:
              setError('Could not create user')
            break;
          }
        }
        reject('rejected')
      })
    }

    // Need to make a new resolve after registeing. here for google 
    

    const handleGoogleSignIn = async(e)=> {
      const registered = await resolveAfterRegistering()
      registered === 'resolved' && navigate('/user-setup')
    }

    const handleSubmit = async(e)=> {
        e.preventDefault()
        if (passwordRef.current.value !==passwordConfirmRef.current.value) {
            return setError('Passwords do not match')
        }
        try {
      
            setError('')
            setLoading(true)
            const registered = await resolveAfterRegistering(emailRef.current.value,passwordRef.current.value)
            registered === 'resolved' && navigate('/user-setup')

        } catch (e) {
            
        }
        setLoading(false)
        }
        
      
    
      


  return (
    <>
    <MenuBar />
    <div class="form-signin m-auto text-center my-5">
      <form class="signin-form px-5 py-3 rounded-3 shadow" onSubmit={handleSubmit}>
        <div class="my-2 text-center d-flex flex-column">
          <Emoji symbol="🦉" label="owl" />
          <h5>DashOwl</h5>
        </div>
        <h1 class="h3 mb-3 fw-normal">Create Account</h1>
        {currentUser && <Navigate to="/user-setup" />}
        {error && <p className="alert alert-danger alert-dismissible">{error}</p>}
        <GoogleButton style={{width:"100%"}} onClick={handleGoogleSignIn} />
        <div className="my-2 text-muted">
          <small>or</small>
        </div>
        
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
            
        <button class="w-100 btn btn-lg btn-dark" type="submit" disabled={loading}>Sign Up</button>
            
        <div  class="mt-2">
          <p>Already have an account? <Link to="/login">Login</Link></p>
        </div>
      </form>
    </div>
    <Footer />
    </>
  )
}