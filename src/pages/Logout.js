import React, { useState} from 'react'
import Footer from './components/Footer'
import MenuBar from './components/Navbar'
import { useAuth } from '../contexts/AuthContext'
import { redirect} from 'react-router-dom'

export default function Logout() {
  const [error,setError] = useState('')
  const { currentUser, logout } = useAuth()

  async function handleSubmit() {
    setError('')
    try {
      await logout()
      console.log("redirecting")
      redirect("/login")
    } catch {
      setError('Failed to logout')
    }

  }

  return (
    <>
      <MenuBar />
      <div class="form-signin m-auto text-center my-5">
        <form class="signin-form px-5 py-5 border shadow" onSubmit={handleSubmit}>
            <img class="mb-4" src="/docs/5.3/assets/brand/bootstrap-logo.svg" alt="Logo" width="72" height="57" />
            <h2 class="my-3 mb-4">Leaving?</h2>
            {JSON.stringify(currentUser)}
            {error && <p className="alert alert-danger alert-dismissible">{error}</p>}
            <button class="w-100 btn btn-lg btn-dark" type="submit">Logout</button>
        </form>
      </div>
      <Footer />
    </>
  )
}