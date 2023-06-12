import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import {analytics} from '../firebase'
import { logEvent } from 'firebase/analytics'
import MenuBar from '../layouts/MenuBar'
import Footer from '../layouts/Footer'

export default function NoPage() {
  // Send a page view event to Firebase Analytics
  // Take this out, replace with https://stackoverflow.com/questions/59330467/how-to-track-page-view-with-firebase-analytics-in-a-web-single-page-app

  return (
    <>
    <MenuBar />
    <div className="text-center py-5 my-5 container">
      <hr></hr>
      <h1 className="mt-5">404</h1>
      <h2>Page not found</h2>
      <p>You may have been looking for one of these pages.</p>
      <Link to="/" className="card p-3">Your Dashboard</Link>
      <Link to="/register" className="card p-3 my-2">Create your account</Link>
    </div>
    <Footer />
    </>
  )
}
