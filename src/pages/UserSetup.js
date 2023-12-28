import React, { useRef, useState,useEffect} from 'react'
import Footer from '../layouts/Footer'
import MenuBar from '../layouts/Navbar'
import { useAuth } from '../contexts/AuthContext'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase'
import Emoji from '../layouts/Emoji'
import { collection } from 'firebase/firestore'
import { getDocs } from 'firebase/firestore'
import { limit } from 'firebase/firestore'


import { query, where, orderBy } from 'firebase/firestore'

// has to submit team name, dweet url, car name to firebase
// has to update the display name to the team name

export default function UserSetup() {


    const teamNameRef = useRef()
    const dweetURLRef = useRef()
    const carNameRef = useRef()
    const [error,setError] = useState('')
    const [loading,setLoading] = useState(false)
    const carsRef = collection(db, "cars")
    

    
    const { currentUser,updatedisplayname } = useAuth()

    const navigate = useNavigate()

    const handleSubmit = async(e)=> {
        e.preventDefault()
        try {
          const userDocRef = doc(db, "users", currentUser.uid)
          const carQuery = query(carsRef, where("owner","==",currentUser.uid), orderBy("car_number"),limit(1))
          
          setError('')
          setLoading(true)
          await updatedisplayname(teamNameRef.current.value)
          await updateDoc(userDocRef, {
            "team_name":teamNameRef.current.value,
          })

          // Need to query the cars collection to find the car doc, this is probably not the best way to do it.
          const querySnapshot = await getDocs(carQuery).then((querySnapshot) => {
            // console log the data of snapshot
            querySnapshot.forEach((d) => {
      
              const carDocRef = doc(db, "cars", d.id)
               updateDoc(carDocRef, {
                "car_name":carNameRef.current.value,
                "dweet_name":dweetURLRef.current.value,
              }).then(() => {
                navigate('/')
              }
              )
              
            })
          })
          
          
        } catch (e) {
      
            setError('Could not complete sign-up.')
       
            setLoading(false)
        }
      
        
        }

        //<img class="mb-4" src="/docs/5.3/assets/brand/bootstrap-logo.svg" alt="Logo" width="72" height="57" />
  return (
    <>
    <MenuBar />
    <div className="form-signin m-auto text-center my-5">
      <form className="signin-form px-5 py-3 rounded-3 shadow" onSubmit={handleSubmit}>
        <div className="my-2">
          <Emoji symbol="🦉" label="owl" />
        </div>
        {currentUser?.displayName && <p className="h3 fw-normal">Hi {currentUser.displayName}!</p>}
        <h1 class="h3 mb-3 fw-normal my-1 mb-4">Let's set up your first car!</h1>

        {error && <p className="alert alert-danger alert-dismissible">{error}</p>}
        <div className="form-floating">
          <input type="text" className="form-control mb-2" id="floatingName" placeholder="Team Name" ref={teamNameRef} required/>
          <label htmlFor="floatingName">Team Name</label>
        </div>
        <div className="form-floating mb-2">
          <input type="text" className="form-control" id="floatingDweetURL" placeholder="https://dweet.io/get/latest/dweet/for/xxxxxxx" ref={dweetURLRef} required/>
          <label htmlFor="floatingDweetURL">Dweet Thing Name</label>
        </div>
        <div className="form-floating mb-2">
          <input type="text" className="form-control" id="floatingCarName" placeholder="Car Name" ref={carNameRef} required/>
          <label htmlFor="floatingCarName">Car Name</label>
        </div>
            
        <button className="w-100 btn  btn-block mt-2 btn-primary" type="submit" disabled={loading}>Submit</button>
            
        <div  className="mt-2">
          <Link to="/">Skip</Link>
        </div>
      </form>
    </div>
    <Footer />
    </>
  )
}