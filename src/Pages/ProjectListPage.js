import { Button } from '@mui/material';
import { useAuth } from "../contexts/AuthContext";
import { List, ListItemButton } from '@mui/material';
import { useNavigate, Link} from 'react-router-dom';
import { Routes, Route } from "react-router-dom";
import ProjectOverviewPage from './ProjectOverviewPage';
import {useContext, createContext } from 'react';

const ProjectContext = createContext();


export default function ProjectListPage() {
    const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const projectList = [
     {
        name: "Project 1",
        createdBy: "test User",
        description: "Project Description",
        funcRequirements: [
            "Requirement 1",
            "Requirement 2"
        ],
        nonFuncRequirements: [
            "Requirement 1",
            "Requirement 2"
        ],
        risks: [
            {
                name: "Risk Name",
                status: "status"
            }
        ]
    }
  ]
  return (
    <div className="App">
      <header className="App-header">
        <h1>Project List Page</h1>
        <List>
            {projectList.map((project) => {
                return(
                    <ListItemButton 
                    onClick={() => {
                        navigate("/home/project-overview", {state: project})
                    }}>{project.name}</ListItemButton>
                    )
                })}
        </List>
      </header>
    </div>
  )
}