import React, { useRef, useState,useEffect} from 'react'
import Footer from '../layouts/Footer'
import MenuBar from '../layouts/Navbar'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate, Link, Navigate} from 'react-router-dom'
import Emoji from '../layouts/Emoji'
import {analytics} from '../firebase'
import { logEvent } from 'firebase/analytics'
import GoogleButton from 'react-google-button'



export default function Login() {
    // Send a page view event to Firebase Analytics
 
    const emailRef = useRef()
    const passwordRef = useRef()
    const [error,setError] = useState('')
    const [loading,setLoading] = useState(false)
    const { login,googleSignIn,currentUser }  = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async(e)=> {
        e.preventDefault()
        try {
            setError('')
            setLoading(true)
            await login(emailRef.current.value,passwordRef.current.value)
            navigate('/')
        } catch (e) {
            console.log(e)
            switch (e.code) {
              case 'auth/user-not-found':
                setError('User not found')
                break;
              case 'auth/wrong-password':
                setError('Incorrect password')
                break;
              case 'auth/too-many-requests':
                setError('Too many requests. Try again later.')
                break;
              default:
                setError('Could not login')
              break;
        }
        }
        setLoading(false)
        }

    const handleGoogleSignIn = async(e)=> {
      try {
        googleSignIn()
      } catch (e) {
        setError('Could not sign in with Google')
      }
    }

  return (
    <>
    <MenuBar />
    <div class="form-signin m-auto text-center my-5">
      <form class="signin-form px-5 py-3 rounded-3 shadow" onSubmit={handleSubmit}> 
        <Emoji symbol="🦉" label="owl" />
        <h1 class="h3 my-3 fw-normal">Welcome back!</h1>
        {error && <p className="alert alert-danger alert-dismissible">{error}</p>}
        {currentUser && <Navigate to="/" />}
        <GoogleButton style={{width:"100%"}} onClick={handleGoogleSignIn} />
        <div className="my-2 text-muted">
          <small>or</small>
        </div>
        <div class="form-floating">
          <input type="email" class="form-control mb-2" id="floatingInput" placeholder="name@example.com" ref={emailRef} required/>
          <label for="floatingInput">Email address</label>
        </div>
        <div class="form-floating mb-2">
          <input type="password" class="form-control" id="floatingPassword" placeholder="Password" ref={passwordRef} required/>
          <label for="floatingPassword">Password</label>
        </div>

            
        <button class="w-100 btn btn-lg btn-dark" type="submit" disabled={loading}>Login</button>
            
        <div  class="mt-2">
          <Link to="/reset-password">Forgot password?</Link>
          <p>Dont have an account? <Link to="/signup">Try for free!</Link></p>
        </div>
      </form>
    </div>
    <Footer />
  </>
  )
}

//<div class="checkbox mb-2">
//<label>
//<input type="checkbox" value="remember-me" /> Remember me
//  </label>
//</div>

//<button class="w-100 btn btn-lg btn-primary mt-2" type="submit" disabled>Login with Google</button>