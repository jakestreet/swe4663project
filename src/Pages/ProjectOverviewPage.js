import { Button } from '@mui/material';
import { useAuth } from "../contexts/AuthContext";
import {useLocation} from 'react-router-dom';
import { Typography } from '@mui/material';

export default function ProjectOverviewPage() {
  const { currentUser, logout } = useAuth();
  const {state} = useLocation();
  console.log(state);
  return (
    <div className="App">
        <Typography variant="h2">{state.name}</Typography>
        {/* <Typography variant = "h4"> Created by: {state.createdBy} </Typography> */}
        <Typography variant="h4"> {state.description} </Typography>
    </div>
  )
}