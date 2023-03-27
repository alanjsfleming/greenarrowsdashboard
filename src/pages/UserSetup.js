import React, { useRef, useState,useEffect} from 'react'
import Footer from './components/Footer'
import MenuBar from './components/Navbar'
import { useAuth } from '../contexts/AuthContext'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { doc, updateDoc } from 'firebase/firestore'
import { db,analytics } from '../firebase'
import { logEvent } from 'firebase/analytics'
import Emoji from './components/Emoji'
// has to submit team name, dweet url, car name to firebase
// has to update the display name to the team name

export default function UserSetup() {
  // Send a page view event to Firebase Analytics
  useEffect(() => {
    logEvent(analytics,'details_page_view')
  })


    const teamNameRef = useRef()
    const dweetURLRef = useRef()
    const carNameRef = useRef()
    const [error,setError] = useState('')
    const [loading,setLoading] = useState(false)

    
    const { currentUser,updatedisplayname } = useAuth()

    const navigate = useNavigate()

    const handleSubmit = async(e)=> {
        e.preventDefault()
        try {
          const userDocRef = doc(db, "users", currentUser.uid)
          setError('')
          setLoading(true)
          await updatedisplayname(teamNameRef.current.value)
          await updateDoc(userDocRef, {
            "team_name":teamNameRef.current.value,
            "appearance_theme":"light",
            "track_length":"500",
            "race_length":"90",
            "race_start_time":null

          })
        } catch (e) {
            console.log(e)
            setError('Could not complete sign-up.')
            console.log(error)
            setLoading(false)
            return 'Could not complete sign-up.'
        }
        setLoading(false)
        console.log('we are navigating')
        navigate('/')
        }

        //<img class="mb-4" src="/docs/5.3/assets/brand/bootstrap-logo.svg" alt="Logo" width="72" height="57" />
  return (
    <>
    <MenuBar />
    <div class="form-signin m-auto text-center my-5">
      <form class="signin-form px-5 py-3 rounded-3 shadow" onSubmit={handleSubmit}>
        <div class="my-2">
        <Emoji symbol="🦉" label="owl" />
        </div>
        <h1 class="h3 mb-3 fw-normal my-1">Set up your first car</h1>

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
            
        <button class="w-100 btn  btn-lg btn-primary" type="submit" disabled={loading}>Submit</button>
            
        <div  class="mt-2">
          <Link to="/">Skip</Link>
        </div>
      </form>
    </div>
    <Footer />
    </>
  )
}