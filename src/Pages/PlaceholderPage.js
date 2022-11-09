import { Button } from '@mui/material';
import { useAuth } from "../contexts/AuthContext";

export default function PlaceholderPage() {
  const { currentUser, logout } = useAuth();
  return (
    <div className="App">
      <header className="App-header">
        <h1>Home</h1>
        <h5>Current User: {currentUser?.displayName}</h5>
        <Button variant='contained' onClick={()=>logout()}>Logout</Button>
      </header>
    </div>
  )
}
