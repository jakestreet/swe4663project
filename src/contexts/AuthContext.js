import React, { useContext, useEffect, useState } from 'react'
import { auth } from '../components/utils/firebase'
import { confirmPasswordReset, createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

const AuthContext = React.createContext();

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState();
    const [loading, setLoading] = useState(true);
    const provider = new GoogleAuthProvider();

    function signup(email, password) {
        return createUserWithEmailAndPassword(auth, email, password)
    }

    function login(email, password) {
        return signInWithEmailAndPassword(auth, email, password)
    }

    function googleLogin() {
        signInWithPopup(auth, provider);
    }

    function logout() {
        return auth.signOut();
    }

    function forgotPassword(email) {
        return sendPasswordResetEmail(auth, email)
    }

    function resetPassword(oobCode, newPassword) {
        return confirmPasswordReset(auth, oobCode, newPassword)
    }

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            setCurrentUser(user)
            setLoading(false)
        })

        return unsubscribe;
    })

    const value = {
        currentUser,
        loading,
        signup,
        login,
        logout,
        forgotPassword,
        resetPassword,
        googleLogin
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}
