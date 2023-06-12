import React, { useState,useEffect} from 'react'
import Footer from '../layouts/Footer'
import MenuBar from '../layouts/Navbar'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate,Link } from 'react-router-dom'
import Emoji from '../layouts/Emoji'
import {analytics} from '../firebase'
import { logEvent } from 'firebase/analytics'

export default function Logout() {
  // Send a page view event to Firebase Analytics
  const [error,setError] = useState('')
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit() {
    setError('')
    try {
      await logout()
      navigate("/logout#")
      navigate('/login')
    } catch {
      setError('Failed to logout')
    }

  }

  return (
    <>
      <MenuBar />
      <div class="form-signin m-auto  text-center my-5">
        <form class="signin-form px-5 py-5 rounded-3 shadow" onSubmit={handleSubmit}>
            <Emoji symbol="🦉" label="owl" /><h2 class="my-3 mb-4">Leaving?</h2>
     
            {error && <p className="alert alert-danger alert-dismissible">{error}</p>}
            <Link to="/configure?0"><button class="w-100 btn btn-lg btn-outline-dark mb-2" type="button">Take me back</button></Link>
            <button class="w-100 btn btn-lg btn-dark" type="submit">Logout</button>
            
        </form>
      </div>
      <Footer />
    </>
  )
}