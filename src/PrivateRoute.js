import React, { useEffect,useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import Loading from './pages/Loading'


export default function PrivateRoute({ children }) {
    const { currentUser } = useAuth()
    const [isLoggedIn,setLoginStatus]=useState()


    useEffect(() => {
        if (typeof currentUser === 'undefined') {
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
        return <span><Loading /></span>
    } else if (isLoggedIn === 'false') {
        console.log(isLoggedIn)
        return <Navigate to="/login" replace />
    }
}