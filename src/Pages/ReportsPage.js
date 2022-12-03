import { Button } from '@mui/material';
import { useAuth } from "../contexts/AuthContext";
import { DataGrid } from '@mui/x-data-grid';


export default function ReportsPage() {
  const { currentUser, logout } = useAuth();
  return (
    <div className="App">
      <header className="App-header">
        <h1>Reports Page</h1>
        <h5>Current User: {currentUser?.displayName}</h5>
      </header>
    </div>
  )
}