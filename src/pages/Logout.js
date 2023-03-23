import React, { useState,useEffect} from 'react'
import Footer from './components/Footer'
import MenuBar from './components/Navbar'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import Emoji from './components/Emoji'
import {analytics} from '../firebase'
import { logEvent } from 'firebase/analytics'

export default function Logout() {
  // Send a page view event to Firebase Analytics
  useEffect(() => {
    logEvent(analytics,'logout_page_view')
  })
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
      <div class="form-signin m-auto text-center my-5">
        <form class="signin-form px-5 py-5 border shadow" onSubmit={handleSubmit}>
            <Emoji symbol="🦉" label="owl" /><h2 class="my-3 mb-4">Leaving?</h2>
     
            {error && <p className="alert alert-danger alert-dismissible">{error}</p>}
            <button class="w-100 btn btn-lg btn-dark" type="submit">Logout</button>
        </form>
      </div>
      <Footer />
    </>
  )
}