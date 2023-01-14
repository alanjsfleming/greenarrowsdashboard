import React, { useEffect,useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'


export default function PrivateRoute({ children }) {
    const { currentUser } = useAuth()
    const [isLoggedIn,setLoginStatus]=useState()


    useEffect(() => {
        console.log("current user",currentUser) 
        if (typeof currentUser === 'undefined') {
            console.log("undefined")
            setLoginStatus('loading')
        } else if (currentUser === null) { 
            setLoginStatus('false')
        } else if (currentUser) {
            setLoginStatus('true')
        }
    },[currentUser]);
    
    
    if (isLoggedIn === 'true') {
        return children
    } else if (isLoggedIn === 'loading') {
        return <h1>Loading...</h1>
    } else if (isLoggedIn === 'false') {
        console.log(isLoggedIn)
        return <Navigate to="/login" replace />
    }
}