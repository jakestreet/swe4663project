import { Button, Icon, IconButton, TextField } from "@mui/material";
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
import { useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { Box } from "@mui/system";

const defaultFormVals = {
  name: "",
  description: "",
  funcRequirements: [{ name: "" }],
  nonFuncRequirements: [{ name: "" }],
  risks: [{ name: "", status: "" }],
  createdBy: "",
};

export default function ProjectListPage() {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: defaultFormVals,
  });

  const {
    fields: funcFields,
    append: appendFunc,
    remove: removeFunc,
  } = useFieldArray({
    control,
    name: "funcRequirements",
  });

  const {
    fields: nonFuncFields,
    append: appendNonFunc,
    remove: removeNonFunc,
  } = useFieldArray({
    control,
    name: "nonFuncRequirements",
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  const [openModal, setOpenModal] = useState(false);

  const handleClickOpen = () => setOpenModal(true);
  const handleClose = () => setOpenModal(false);

  const projectList = [
    {
      name: "Project 1",
      createdBy: "test User",
      description: "Project Description",
      funcRequirements: ["Requirement 1", "Requirement 2"],
      nonFuncRequirements: ["Requirement 1", "Requirement 2"],
      risks: [
        {
          name: "Risk Name",
          status: "status",
        },
      ],
    },
  ];
  return (
    <div className="App">
      <header className="App-header">
        <h1>Project List Page</h1>
        <List>
          {projectList.map((project, index) => {
            return (
              <ListItemButton
                key={`${project}-${index}`}
                onClick={() => {
                  navigate("/home/project-overview", { state: project });
                }}
              >
                {project.name}
              </ListItemButton>
            );
          })}
        </List>
        <Button
          variant="contained"
          onClick={() => {
            console.log("test");
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
            <DialogContent sx={{ width: "75vw" }}>
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

              <Box sx={{ display: "flex", flexDirection: "row" }}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    flexGrow: 2,
                    padding: "10px",
                  }}
                >
                  {funcFields.map((requirement, index) => {
                    return (
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          marginTop: "20px",
                        }}
                      >
                        <Controller
                          key={requirement.id}
                          control={control}
                          name={`funcRequirements.${index}.name`}
                          shouldUnregister={true}
                          rules={{
                            required: { value: true, message: "Required" },
                          }}
                          render={({
                            field: { onChange, onBlur, value, name, ref },
                            fieldState: { invalid, isTouched, isDirty, error },
                            formState,
                          }) => (
                            <TextField
                              value={value}
                              onChange={onChange}
                              name={name}
                              multiline
                              helperText={error ? error.message : null}
                              error={!!error}
                              label="Functional Requirement"
                              fullWidth
                              variant="outlined"
                            />
                          )}
                        />
                        {index > 0 && (
                          <IconButton onClick={() => removeFunc(index)}>
                            <ClearIcon />
                          </IconButton>
                        )}
                      </Box>
                    );
                  })}
                  <IconButton onClick={() => appendFunc({ name: "" })}>
                    {" "}
                    <AddCircleOutlineIcon />
                  </IconButton>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    flexGrow: 2,
                    padding: "10px",
                  }}
                >
                  {nonFuncFields.map((requirement, index) => {
                    return (
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          marginTop: "20px",
                        }}
                      >
                        <Controller
                          key={requirement.id}
                          control={control}
                          name={`nonFuncRequirements.${index}.name`}
                          shouldUnregister={true}
                          rules={{
                            required: { value: true, message: "Required" },
                          }}
                          render={({
                            field: { onChange, onBlur, value, name, ref },
                            fieldState: { invalid, isTouched, isDirty, error },
                            formState,
                          }) => (
                            <TextField
                              value={value}
                              onChange={onChange}
                              name={name}
                              multiline
                              helperText={error ? error.message : null}
                              error={!!error}
                              label="Non Functional Requirement"
                              fullWidth
                              variant="outlined"
                            />
                          )}
                        />
                        {index > 0 && (
                          <IconButton onClick={() => removeNonFunc(index)}>
                            <ClearIcon />
                          </IconButton>
                        )}
                      </Box>
                    );
                  })}
                  <IconButton onClick={() => appendNonFunc({ name: "" })}>
                    {" "}
                    <AddCircleOutlineIcon />
                  </IconButton>
                </Box>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button type="submit" variant="contained">
                Save
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      )}
    </div>
  );
}
