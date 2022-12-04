import {
  Autocomplete,
  Button,
  Icon,
  IconButton,
  Select,
  TextField,
  MenuItem,
  InputLabel,
  FormControl,
  Typography,
  CircularProgress,
  Divider,
  Checkbox
} from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import { List, ListItemButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ClearIcon from "@mui/icons-material/Clear";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useEffect, useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { Box } from "@mui/system";
import { collection, getDocs, setDoc, doc, addDoc } from "firebase/firestore";

const defaultFormVals = {
  name: "",
  description: "",
  createdBy: "",
  projectOwner: "",
  teamMembers: [],
};

export default function ProjectListPage() {
  const navigate = useNavigate();
  const { currentUser, logout, db, projectArray, getProjects, loading, setCurrentProject } = useAuth();

  const [users, setUsers] = useState([]);
  // const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUsers = async () => {
      const snapshot = await getDocs(collection(db, "users"));
      let userArray = [];
      snapshot.forEach((doc) => {
        let name = doc.data();
        userArray.push({name: name.name, id: doc.id});
        
      });
      setUsers([...userArray]);
      getProjects();
    }
    getUsers();
  }, []);


  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isDirty },
    setValue,
    getValues
  } = useForm({
    defaultValues: defaultFormVals,
  });

  const onSubmit = async (data) => {
    try{
      await addDoc(collection(db, "projects"), {
        ...data,
        createdBy: currentUser.email,
      }).then(async (val) => {
        setOpenModal(false);
        getProjects();
      })
    }catch(error){
      console.error(error);
    }
  };

  const [openModal, setOpenModal] = useState(false);

  const handleClickOpen = () => setOpenModal(true);
  const handleClose = () => {
    console.log(getValues());
        setOpenModal(false);
  };
  return (
    <div className="App">
      <header className="App-header">
        <Typography variant="h2" sx={{paddingBottom: "30px", paddingTop: "30px"}}>Projects</Typography>
        {!loading ? <List sx={{width: "500px"}}>
          {projectArray.map((project, index) => {
            return (
             <> <ListItemButton
                key={`${project}-${index}`}
                onClick={() => {
                  setCurrentProject(project);
                  navigate("/home/project-overview", {state: project.path});
                }}
              >
                {project.name}
              </ListItemButton>
              <Divider sx={{backgroundColor: "white"}} />
              </>
            );
          })}
        </List> : <CircularProgress />}
        <Button
          variant="contained"
          onClick={() => {
            handleClickOpen();
          }}
        >
          Create New Project <AddCircleOutlineIcon />
        </Button>
      </header>

      {openModal && (
        <Dialog open={openModal} onClose={handleClose} maxWidth="xl">
          <DialogTitle>Create Project</DialogTitle>
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogContent sx={{ width: "50vw" }}>
              <Controller
                
                control={control}
                name="name"
                shouldUnregister={true}
                rules={{
                  required: { value: true, message: "Name is required" },
                }}
                render={({
                  field: { onChange, onBlur, value, name, ref },
                  fieldState: { invalid, isTouched, isDirty, error },
                  formState,
                }) => (
                  <TextField
                    sx={{ marginTop: "20px" }}
                    value={value}
                    onChange={onChange}
                    name={name}
                    helperText={error ? error.message : null}
                    error={!!error}
                    label="Project Name"
                    fullWidth
                    variant="outlined"
                  />
                )}
              />

              <Controller
                control={control}
                name="description"
                shouldUnregister={true}
                rules={{
                  required: { value: true, message: "Description is required" },
                }}
                render={({
                  field: { onChange, onBlur, value, name, ref },
                  fieldState: { invalid, isTouched, isDirty, error },
                  formState,
                }) => (
                  <TextField
                    sx={{ marginTop: "20px" }}
                    value={value}
                    onChange={onChange}
                    name={name}
                    multiline
                    helperText={error ? error.message : null}
                    error={!!error}
                    label="Project Description"
                    fullWidth
                    variant="outlined"
                    minRows={3}
                  />
                )}
              />
              <Box sx={{display: "flex", justifyContent: "space-evenly", flexDirection: "row", paddingTop: "30px"}}>
              <Controller
                control={control}
                name="projectOwner"
                shouldUnregister={true}
                rules={{
                  required: {
                    value: true,
                    message: "Project Owner is required",
                  },
                }}
                render={({
                  field: { onChange, onBlur, value, name, ref },
                  fieldState: { invalid, isTouched, isDirty, error },
                  formState,
                }) => {
                  const getOptions = () => {
                    return users.map((val, index) => {
                      return (
                        <MenuItem value={val} key={`${val.id}-${index}`}>
                          {val.name}
                        </MenuItem>
                      );
                    });
                  };
                  return (
                    <FormControl>
                    <InputLabel>Project Owner</InputLabel>
                    <Select
                      sx={{ width: "250px" }}
                      variant="outlined"
                      label="Project Owner"
                      labelId="projectOwner"
                      id="projectOwner"
                      onChange={(event, val) => {
                        onChange(event);
                      }}
                      defaultValue={''}
                      value={getValues("projectOwner") ?? ""}
                      renderValue={(value) => {
                        return value.name;
                      }}
                    >
                      {getOptions()}
                    </Select>
                    </FormControl>
                  );
                }}
              />

              <Controller
                control={control}
                name="teamMembers"
                shouldUnregister={true}
                rules={{
                  required: {
                    value: true,
                    message: "Team Members are required",
                  },
                }}
                render={({
                  field: { onChange, onBlur, value, name, ref },
                  fieldState: { invalid, isTouched, isDirty, error },
                  formState,
                }) => {
                  const getOptions = () => {
                    return users.map((val, index) => {
                      return (
                        <MenuItem value={val} key={`${val.id}-${index}`}>
                          {/* <Checkbox checked={getValues("teamMembers")?.some((teamMember) => teamMember.id ===val.id)} /> */}
                          {val.name}
                        </MenuItem>
                      );
                    });
                  };
                  // console.log(field.value);
                  return (
                    <FormControl>
                      <InputLabel>Team Members</InputLabel>
                      <Select
                        // {...field}
                        multiple
                        sx={{ width: "250px" }}
                        variant="outlined"
                        label="Team Members"
                        labelId="teamMembers"
                        id="teamMembers"
                        onChange={onChange}
                        value={getValues("teamMembers") ?? []}
                        renderValue={(value) => {
                          if(value.length > 0){
                            return value.map(val => val.name).join(", ");
                          }else{
                            return "";
                          }
                        }}
                        // defaultValue={[]}
                      >
                        {getOptions()}
                      </Select>
                      </FormControl>
                  );
                }}
              />
            
            </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button type="submit" variant="contained" disabled={!isDirty}>
                Save
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      )}
    </div>
  );
}
