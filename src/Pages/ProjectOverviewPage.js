import { Select, Button, Box, Typography, Card, CardContent, CardActions, ListItem, List, TextField, FormControl, ListItemIcon, ListItemButton, ListItemText, IconButton, MenuItem, InputLabel } from '@mui/material';
import { useAuth } from "../contexts/AuthContext";
import {useLocation} from 'react-router-dom';
import { useEffect, useState } from 'react';
import { updateDoc, doc, arrayUnion, getDocs, collection, where, query, addDoc } from 'firebase/firestore';
import DeleteIcon from '@mui/icons-material/Delete';
import { ModeEdit, VisibilityOutlined } from '@mui/icons-material';
import Modal from '@mui/material/Modal';


const ButtonWithTextField = (props) => {
  const { db } = useAuth();
  const [showAdd, setShowAdd] = useState(true);

  const [value, setValue] = useState("");

  const submitForm = async (event) => {
    event.preventDefault();
    await updateDoc(doc(db, props.docPath), {[props.field]: arrayUnion(value)});
    props.updateProject();
    setValue("");
    setShowAdd(true);
  }

  return(
    <>
    {!showAdd && <>
        <Box sx={{display: "flex", flexDirection: "row", alignItems:"stretch"}} component="form" onSubmit={submitForm}> 
        <TextField label={props.label} id="outlinedTextField" variant="outlined" value={value} onChange={(e) => setValue(e.target.value)}     
        sx={{width: "100%"}}
        InputProps={{
          
          endAdornment: <><Button type="submit" variant="contained" sx={{marginRight: "10px", marginLeft: "10px"}}>Save</Button>
          <Button variant="outlined" onClick={() => {
            setShowAdd(true);
            setValue("");
          }}>Cancel</Button>
          </>}}/>        
          </Box>
    </>}
    {showAdd && <Button variant="outlined" onClick={() => setShowAdd(false)}>Add</Button>}
    </>
  )
}

export default function ProjectOverviewPage() {
  const { db, getProjects, projectArray, currentProject, setCurrentProject, currentUser } = useAuth();
  const {state} = useLocation();
  const [currentEdit, setCurrentEdit] = useState("");
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [risk, setRisk] = useState();
  const [addRisk, setAddRisk] = useState(false);
  const [addUser, setAddUser] = useState();
  const [showAddUser, setShowAddUser] = useState(false);
  const [openRiskModal, setOpenRiskModal] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const handleOpen = (index, fieldName, category) => {
    setCurrentEdit({value: fieldName[index], category: category, index: index});
    setOpen(true);
  };

  const deleteItem = async (index, fieldName, category) => {
    var tempArray = currentProject[category];
    tempArray.splice(index, 1)
    const projectRef = collection(db, "projects")
    const q = query(projectRef, where("name", "==", currentProject?.name))
    var snapshot = await getDocs(q)
    snapshot.forEach((docs) => {
        updateDoc(docs.ref, {
          [category]: tempArray
        })
    });
    await updateProject();
  };

  const [logState, setLogState] = useState();
  const handleClose = () => setOpen(false);

  const [openLogModal, setOpenLogModal] = useState(false);

  const handleOpenLogModal = (index, fieldName) => {
    setLogState({index: index, name: currentProject[fieldName][index], fieldName: fieldName, category: ""});
    setOpenLogModal(true);
  }
  
  const getUsers = async () => {
    const snapshot = await getDocs(collection(db, "users"));
    let userArray = [];
    snapshot.forEach((doc) => {
      let name = doc.data();
      userArray.push({name: name.name, id: doc.id});
      
    });
    console.log("this");
    setUsers([...userArray]);
    setLoadingUsers(false);
  }
  
  useEffect(() => {
    if(users.length === 0)
      {
        getUsers();
      }
    if(currentProject === undefined){
      getProjects();
      projectArray.map((proj) => {
        if(proj?.path == state){
          console.log(proj?.path);
          setCurrentProject(proj);
        }
      })
    }
    projectArray.map((proj) => {
      if(proj.path === currentProject?.path){
        setCurrentProject(proj);
      }
    });
  }, [projectArray, users])

  const updateProject = async () => {
    await getProjects();
  }
  
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
  };

  async function uploadEdit() {
    var tempArray = currentProject[currentEdit.category];
    tempArray[currentEdit.index] = currentEdit.value
    const projectRef = collection(db, "projects")
    const q = query(projectRef, where("name", "==", currentProject?.name))
    var snapshot = await getDocs(q)
    snapshot.forEach((docs) => {
        updateDoc(docs.ref, {
          [currentEdit.category]: tempArray
        })
    })
    handleClose();
  }

  const uploadWorkLog = async() => {
      const payload = {
        createdBy: currentUser.displayName,
        category: logState.category,
        timeSpent: logState.time,
        task: logState.name
      };
      console.log(payload);
      await updateDoc(doc(db, `${currentProject.path}`), {
        logs: arrayUnion({...payload})
      });
      setOpenLogModal(false);
  }

  const uploadRisk = async () => {
    await updateDoc(doc(db, `${currentProject.path}`), {
      risks: arrayUnion({...risk})
    });
    setAddRisk(false);
    await updateProject();
  }
  
  const uploadedUpdatedRisk = async() => {
    console.log(risk);
    let tempRiskArray = currentProject.risks;
    console.log(tempRiskArray);
    let index = risk.index;
    let withoutIndex= risk;
    delete withoutIndex.index;
    console.log(withoutIndex);

    tempRiskArray[index] = withoutIndex;
    const projectRef = collection(db, "projects")
    const q = query(projectRef, where("name", "==", currentProject?.name))
    var snapshot = await getDocs(q)
    snapshot.forEach((docs) => {
      updateDoc(docs.ref, {
        risks: tempRiskArray
      })
  });
  setRisk(undefined);
  setOpenRiskModal(false);
  }

  const uploadTeamMember = async () => {
    await updateDoc(doc(db, `${currentProject.path}`), {
      teamMembers: arrayUnion({...addUser})
    });
    setAddUser(undefined);
    await updateProject();
    setShowAddUser(false);
  }

  function getUserItems() {
    return users.map((element, index) => {
      if(currentProject.teamMembers.some((user) => {
        return user.id === element.id})){
      }else{
        return (
          <MenuItem key={index} value={element}>
            {element.name}
          </MenuItem>
        );
      }
    });
  }

  const handleUserChange = (event) => {
    console.log(event.target.value);
    setAddUser({...event.target.value});
  };

  return (
    <div className="">
      <Box sx={{display: "flex", flexDirection: "row"}}>
          <Box sx={{paddingLeft: "60px"}}>
            <Typography variant="h3" sx={{paddingTop: "40px"}}>{currentProject?.name}</Typography>
            <Typography variant="body1">Description: {currentProject?.description} </Typography>
            <Typography variant="body1">Project Owner: {currentProject?.projectOwner.name} </Typography>
          </Box>
      </Box>
          <Box sx={{display: "flex", flexDirection: "row", flexWrap: "wrap", justifyContent: "space-around"}}>
            <Card elevation={5} sx={{width: "40%", height: "500px", marginTop: "25px"}}>              
            <CardContent>
                <Typography variant="h5">Functional Requirements</Typography>
                <List>
                  {currentProject?.funcRequirements && currentProject?.funcRequirements.map((req, index) => {
                      return <ListItem
                      secondaryAction={
                        <>
                        <IconButton onClick={() => {
                          handleOpenLogModal(index, "funcRequirements");
                        }}>
                          <VisibilityOutlined />
                        </IconButton>
                        <IconButton onClick={() => handleOpen(index, currentProject?.funcRequirements, "funcRequirements")}>
                          <ModeEdit />
                        </IconButton>
                        <IconButton edge="end" onClick={() => deleteItem(index, currentProject?.funcRequirements, "funcRequirements")}>
                          <DeleteIcon />
                        </IconButton>
                        </>
                      }
                      ><ListItemText primary={req} />
                      </ListItem>
                    })}                  
                  </List>
              </CardContent>
              <CardActions>
              <ButtonWithTextField label="Functional" docPath={currentProject?.path} field={"funcRequirements"} updateProject={updateProject}/>

              </CardActions>
            </Card>
            <Card elevation={5} sx={{width: "40%", height: "500px", marginTop: "25px"}}>
              <CardContent>
                <Typography variant="h5">Non-Functional Requirements</Typography>
                <List>
                  {currentProject?.nonFuncRequirements && currentProject?.nonFuncRequirements.map((req, index) => {
                    return <ListItem
                    secondaryAction={
                      <>
                      <IconButton onClick={() => {
                        handleOpenLogModal(index, "nonFuncRequirements");
                      }}>
                        <VisibilityOutlined />
                      </IconButton>
                      <IconButton onClick={() => handleOpen(index, currentProject?.nonFuncRequirements, "nonFuncRequirements")}>
                        <ModeEdit />
                      </IconButton>
                      <IconButton edge="end" onClick={() => deleteItem(index, currentProject?.nonFuncRequirements, "nonFuncRequirements")}>
                        <DeleteIcon />
                      </IconButton>
                      </>
                    }
                    ><ListItemText primary={req} />
                    </ListItem>
                  })}
                </List>
              </CardContent>
              <CardActions sx={{width: "100%"}}>
                   <ButtonWithTextField label="Non-Functional" docPath={currentProject?.path} field={"nonFuncRequirements"} updateProject={updateProject}/>
                </CardActions>
            </Card>
            <Card elevation={5} sx={{width: "40%", height: "500px", marginTop: "25px"}}>
            <CardContent>
                <Typography variant="h5">Risks</Typography>
                <List>
                  
                      {currentProject?.risks && currentProject?.risks.map((tet, index) => {
                        return(
                        <ListItem secondaryAction={<>
                        <IconButton onClick={() => {
                          setRisk({...tet, index: index});
                          setOpenRiskModal(true);
                        }}>
                            <ModeEdit />
                          </IconButton>
                        <IconButton edge="end" onClick={() => deleteItem(index, currentProject?.risks, "risks")}>
                            <DeleteIcon />
                          </IconButton></>}>
                          <ListItemText primary={`Risk: ${tet.risk}`} secondary={`Status: ${tet.status}`}/>
                        </ListItem>
                        )
                      })}
                </List>
                {addRisk && <>
                  <TextField label="Risk" onChange={(e) => setRisk({...risk, risk: e.target.value})} value={risk.risk}/>
                  <TextField label="Risk Status" onChange={(e) => setRisk({...risk, status: e.target.value})} value={risk.status}/>
                  <Button variant="contained" onClick={() => uploadRisk()}>Save</Button>
                  <Button variant="outlined" onClick={() => setAddRisk(false)}>Cancel</Button>
                </>}
              </CardContent>
              <CardActions>
                {!addRisk && <Button variant="outlined" onClick={() => {
                  setAddRisk(true);
                  setRisk({risk: "", status: ""})
                }}>Add</Button>}
              </CardActions>
            </Card>
            <Card elevation={5} sx={{width: "40%", height: "500px", marginTop: "25px"}}>
            <CardContent>
                <Typography variant="h5">Team Members</Typography>
                <List>
                  {currentProject?.teamMembers && currentProject?.teamMembers.map((req, index) => {
                    return <ListItem
                    secondaryAction={
                      <>
                      <IconButton edge="end" onClick={() => deleteItem(index, currentProject?.teamMembers, "teamMembers")}>
                        <DeleteIcon />
                      </IconButton>
                      </>
                    }
                    ><ListItemText primary={req.name} />
                    </ListItem>
                  })}
                  {showAddUser && <div style={{display: "flex", alignItems: "center"}}>
                  <FormControl sx={{ m: 1, minWidth: 120 }}>
                    <InputLabel id="demo-select-small">Users</InputLabel>
                    <Select
                      value={addUser ?? ''}
                      labelId="users-select"
                      label="Users"
                      onChange={handleUserChange}
                      renderValue={(val) => val.name}
                    >  
                        {users.map((element, index) => {
                          // console.log(element);
                          if(currentProject.teamMembers.some((user) => {
                            return user.id === element.id})){
                          }else{
                            return (
                              <MenuItem key={index} value={element}>
                                {element.name}
                              </MenuItem>
                            );
                          }
                        })
                       }
                    </Select>
                  </FormControl>
                  <Button variant="contained" sx={{height: "40px"}} onClick={() => uploadTeamMember()}>Save</Button>
                  <Button variant="outlined" onClick={() => setShowAddUser(false)} sx={{marginLeft: "5px", height: "40px"}}>Cancel</Button>
                  </div>}
                </List>
              </CardContent>
              <CardActions>
                {!showAddUser && <Button variant="outlined" onClick={() => {setShowAddUser(true)}}>Add</Button>}
              </CardActions>
            </Card>
          </Box>
          <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Edit {currentEdit.category}
          </Typography>
          <div style={{display: 'flex'}}>
            <TextField sx={{marginTop: 2}} defaultValue={currentEdit.value} onChange={(e) => setCurrentEdit({...currentEdit, value: e.target.value})}
            InputProps={{endAdornment: <><Button variant='contained' onClick={() => {uploadEdit()}}>Save</Button><Button style={{marginLeft: 5}} variant='outlined' onClick={handleClose}>Cancel</Button></>}} 
            />
            
          </div>

        </Box>
      </Modal>
      <Modal
        open={openLogModal}
        onClose={() => setOpenLogModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Log Work for {logState?.name}
          </Typography>
          <div style={{display: 'flex', flexDirection:"column", height: "30vh"}}>
                <FormControl sx={{marginTop: "30px", marginBottom: "30px" }}>
                  <InputLabel>Category</InputLabel>
                <Select
                      sx={{ width: "250px", }}
                      variant="outlined"
                      label="Category"
                      labelId="category"
                      id="category"
                      onChange={(event, val) => {
                        setLogState({...logState, category: event.target.value});
                      }}
                      value={logState?.category}
                    >
                      <MenuItem value={"Requirements Analysis"}>
                        Requirements Analysis
                      </MenuItem>
                      <MenuItem value={"Designing"}>
                        Designing
                      </MenuItem>
                      <MenuItem value={"Coding"}>
                        Coding
                      </MenuItem>
                      <MenuItem value={"Testing"}>
                        Testing
                      </MenuItem>
                      <MenuItem value={"Project Management"}>
                        Project Management
                      </MenuItem>
                    </Select>
                    </FormControl>
                  <TextField type="number" sx={{width: "250px"}} onChange={(event, val) => setLogState({...logState, time: event.target.value})} InputProps={{endAdornment: <Typography variant="body1">hours</Typography>}} />
                
          </div>
          <Button variant="contained" onClick={() => uploadWorkLog()}>Save</Button>
          <Button variant="outlined" onClick={() => setOpenLogModal(false)}>Cancel</Button>
        </Box>
      </Modal>

      <Modal
        open={openRiskModal}
        onClose={() => setOpenRiskModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Log Work for {logState?.name}
          </Typography>
          <div style={{display: 'flex', flexDirection:"column", height: "30vh"}}>
                <TextField sx={{marginTop: "15px"}}label="risk"value={risk?.risk} onChange={(e) => setRisk({...risk, risk: e.target.value})}/>
                <TextField sx={{marginTop: "15px"}} label="status"value={risk?.status} onChange={(e) => setRisk({...risk, status: e.target.value})}/>
          </div>
          <Button variant="contained" onClick={() => uploadedUpdatedRisk()}>Save</Button>
          <Button variant="outlined" onClick={() => setOpenRiskModal(false)}>Cancel</Button>
        </Box>
      </Modal>
    </div>
    </div>
  )
}