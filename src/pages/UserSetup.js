import React, { useRef, useState} from 'react'
import Footer from './components/Footer'
import MenuBar from './components/Navbar'
import { useAuth } from '../contexts/AuthContext'
import { Link } from 'react-router-dom'


export default function UserSetup() {
    const teamNameRef = useRef()
    const dweetURLRef = useRef()
    const carNameRef = useRef()
    const [error,setError] = useState('')
    const [loading,setLoading] = useState(false)
    const { updatedisplayname }  = useAuth()

    const handleSubmit = async(e)=> {
        e.preventDefault()
        try {
      
            setError('')
            setLoading(true)
            await updatedisplayname(teamNameRef.current.value)
        } catch (e) {
            console.log(e)
            setError('Could not complete sign-up.')
        }
        setLoading(false)
        }


  return (
    <>
    <MenuBar />
    <div class="form-signin m-auto text-center my-5">
      <form class="signin-form px-5 py-3 border shadow" onSubmit={handleSubmit}>
        <img class="mb-4" src="/docs/5.3/assets/brand/bootstrap-logo.svg" alt="Logo" width="72" height="57" />
        <h1 class="h3 mb-3 fw-normal">Complete setup</h1>

        {error && <p className="alert alert-danger alert-dismissible">{error}</p>}
        <div class="form-floating">
          <input type="text" class="form-control mb-2" id="floatingName" placeholder="Team Name" ref={teamNameRef} required/>
          <label for="floatingName">Team Name</label>
        </div>
        <div class="form-floating mb-2">
          <input type="text" class="form-control" id="floatingDweetURL" placeholder="https://dweet.io/get/latest/dweet/for/xxxxxxx" ref={dweetURLRef} required/>
          <label for="floatingDweetURL">Dweet URL</label>
        </div>
        <div class="form-floating mb-2">
          <input type="text" class="form-control" id="floatingCarName" placeholder="Car Name" ref={carNameRef} required/>
          <label for="floatingCarName">Car Name</label>
        </div>
            
        <button class="w-100 btn btn-lg btn-dark" type="submit" disabled={loading}>Submit</button>
            
        <div  class="mt-2">
          <Link to="/">Skip</Link>
        </div>
      </form>
    </div>
    <Footer />
    </>
  )
}