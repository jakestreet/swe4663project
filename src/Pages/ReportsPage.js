import { Button } from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarFilterButton,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { useState, useEffect } from "react";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import { collection, getDocs } from "firebase/firestore";
import Card from "@mui/material/Card";

export default function ReportsPage() {
  const { db, projectArray, getProjects} = useAuth();
  const [projectName, setProjectName] = useState();
  const [rowArray, setRowArray] = useState([]);

  const handleChange = (event) => {
    setProjectName(event.target.value);
  };

  const columns = [
    {
      field: "user",
      headerName: "User",
      flex: 1,
    },
    {
      field: "category",
      headerName: "Category",
      flex: 1,
    },
    {
      field: "timeSpent",
      headerName: "Time Spent",
      type: "number",
      flex: 1,
    },
    {
      field: "task",
      headerName: "Task Worked On",
      sortable: false,
      flex: 1,
    },
  ];

  const rows = [
    { id: 1, user: "Snow", category: "Jon", timeSpent: 35, tasks: "Task" },
  ];

  function CustomToolBar() {
    return (
      <GridToolbarContainer>
        <GridToolbarQuickFilter />
        <GridToolbarFilterButton style={{ marginLeft: "auto" }} />
      </GridToolbarContainer>
    );
  }

  function getMenuItems() {
    return projectArray.map((element, index) => {
      return (
        <MenuItem key={index} value={element.name}>
          {element.name}
        </MenuItem>
      );
    });
  }

  function generateReport() {
    var tempLogArray = [];
    projectArray.forEach((element) => {
      if(element.name === projectName)
        tempLogArray = element.logs
    })
    populateTable(tempLogArray);
  }

  function populateTable(logArray) {
    logArray.forEach((element) => {
      rowArray.push({
        user: element.createdBy,
        category: element.category,
        task: element.task,
        timeSpent: element.timeSpent
      })
    })
  }

  // useEffect(() => {
  //   getProjects().then((name) => setProjectName(name));
    
  // }, [getProjects]);

  return (
    <div
      className="App"
      style={{
        backgroundColor: "#282c34",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <h1
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          fontSize: "calc(10px + 2vmin)",
          color: "white",
        }}
      >
        Reports Page
      </h1>
      <Card
        sx={{
          height: "81vh",
          width: "95%",
          maxWidth: 1200,
          marginLeft: "auto",
          marginRight: "auto",
          padding: 2,
        }}
        style={{ backgroundColor: "#FFFFFF" }}
      >
        <div style={{ display: "flex" }}>
          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="demo-select-small">Projects</InputLabel>
            <Select
              value={projectName ?? "Test"}
              labelId="projects-select"
              label="Projects"
              onChange={handleChange}
            >
              {getMenuItems()}
            </Select>
          </FormControl>
          <Button>Generate Reports</Button>
        </div>
        <DataGrid
          style={{ backgroundColor: "#FFFFFF", height: "75vh" }}
          rows={rowArray}
          columns={columns}
          disableSelectionOnClick
          autoPageSize
          components={{
            Toolbar: CustomToolBar,
          }}
          componentsProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 },
            },
          }}
        />
      </Card>
    </div>
  );
}
