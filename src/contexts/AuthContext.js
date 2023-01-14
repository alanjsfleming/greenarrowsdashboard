import React, { useContext,useEffect,useState } from 'react'
import { auth } from '../firebase'
import { createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth'


const AuthContext = React.createContext()

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({ children }) {
    const [currentUser,setCurrentUser] = useState()
    const [loading,setLoading] = useState()

    function signup(email,password) {
        return createUserWithEmailAndPassword(auth,email,password)
    }

    function login(email,password) {
        return signInWithEmailAndPassword(auth,email,password)
    }

    function logout() {
        return signOut(auth)
    }

    function passwordreset(email) {
        return sendPasswordResetEmail(auth,email)
    }

    function updatedisplayname(name) {
        return updateProfile(auth.currentUser,{displayName:name})
    }

    useEffect(()=>{
        const unsubscribe = auth.onAuthStateChanged(user =>{
            setCurrentUser(user)
            setLoading(false)
            
        })
        return unsubscribe
    },[])


    const value = {
        currentUser,
        signup,
        login,
        logout,
        passwordreset,
        updatedisplayname
    }

  return (
    <AuthContext.Provider value={value}>
        {!loading && children}
    </AuthContext.Provider>
  )
}
