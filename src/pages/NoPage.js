import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import {analytics} from '../firebase'
import { logEvent } from 'firebase/analytics'

export default function NoPage() {
  // Send a page view event to Firebase Analytics
  useEffect(() => {
    logEvent(analytics,'nopage_page_view')
  })
  return (
    <>
    <div>No page found. The page might be under construction.</div>
    <Link to="/"><button class="btn btn-primary">Go back to home</button></Link>
    </>
  )
}
