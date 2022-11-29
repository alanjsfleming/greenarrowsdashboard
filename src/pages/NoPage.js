import React from 'react'
import { Link } from 'react-router-dom'

export default function NoPage() {
  return (
    <>
    <div>No page found. The page might be under construction.</div>
    <Link to="/"><button class="btn btn-primary">Go back to home</button></Link>
    </>
  )
}
