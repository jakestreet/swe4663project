import React, { useContext, useEffect, useState } from 'react'
import { auth, authCreate, app } from '../components/utils/firebase'
import { confirmPasswordReset, createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, updateProfile, getAdditionalUserInfo } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDocs, collection } from "firebase/firestore";

const AuthContext = React.createContext();
const db = getFirestore(app);
export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState();
    const [loading, setLoading] = useState(true);
    const provider = new GoogleAuthProvider();
    const [projectArray, setProjectArray] = useState([]);
    const [projectName, setProjectName] = useState("");

    async function signup(name, email, password) {
        try {
            await createUserWithEmailAndPassword(authCreate, email, password)
            await setDoc(doc(db, "users", email), {
                name: name,
            })
            authCreate.signOut();
            return updateProfile(authCreate.currentUser, { displayName: name })
        } catch (e) {
            console.log(e);
        }
    }

    function login(email, password) {
        try {
            return signInWithEmailAndPassword(auth, email, password)
        } catch (e) {
            console.log(e);
        }
    }

    async function googleLogin() {
        try {
            const googleSignIn = await signInWithPopup(auth, provider)
            if (getAdditionalUserInfo(googleSignIn).isNewUser) {
                await setDoc(doc(db, "users", googleSignIn.user.email), {
                    name: googleSignIn.user.displayName,
                })
            }
        } catch (e) {
            console.log(e);
        }
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

    async function getProjects() {
        const querySnapshot = await getDocs(collection(db, "projects"));
        const tempProjectArray = [];
        querySnapshot.forEach((doc) => {
          tempProjectArray.push(doc.data());
        });
        setProjectArray(tempProjectArray);
        
        console.log("ran")
        // if(tempProjectArray.length != 0)
        //     return tempProjectArray[0].name;
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
        db,
        signup,
        login,
        logout,
        forgotPassword,
        resetPassword,
        googleLogin,
        projectArray,
        projectName,
        setProjectName,
        getProjects,
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}
