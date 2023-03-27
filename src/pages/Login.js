import React, { useRef, useState,useEffect} from 'react'
import Footer from './components/Footer'
import MenuBar from './components/Navbar'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate, Link} from 'react-router-dom'
import Emoji from './components/Emoji'
import {analytics} from '../firebase'
import { logEvent } from 'firebase/analytics'

export default function Login() {
    // Send a page view event to Firebase Analytics
    useEffect(() => {
      logEvent(analytics,'login_page_view')
    })
    const emailRef = useRef()
    const passwordRef = useRef()
    const [error,setError] = useState('')
    const [loading,setLoading] = useState(false)
    const { login,currentUser }  = useAuth()
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
            setError('Failed to login')
        }
        setLoading(false)
        }

  return (
    <>
    <MenuBar />
    <div class="form-signin m-auto text-center my-5">
      <form class="signin-form px-5 py-3 rounded-3 shadow" onSubmit={handleSubmit}> 
        <Emoji symbol="🦉" label="owl" />
        <h1 class="h3 my-3 fw-normal">Welcome back!</h1>
        {error && <p className="alert alert-danger alert-dismissible">{error}</p>}
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
          <p>Dont have an account? <Link to="/register">Try for free!</Link></p>
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