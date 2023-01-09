"use client";
import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "../page.module.css";
import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Card, CardActions, CardContent, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { IconButton } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteIcon from '@mui/icons-material/Delete';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import SaveIcon from '@mui/icons-material/Save';
import { Stack } from "@mui/system";
import axios from 'axios'


export default function IdeasPage() {
  const [userID, setUserID] = useState(null);
  const [addButtonPressed, setAddButtonPressed] = useState(false);
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [ideas, setIdeas] = useState([])

  useEffect(()=>{
    if(localStorage.getItem("user")){
      const id = localStorage.getItem("user")
      let response = ""
      function validate(){
        return axios.post("/api/identifier", id).then(res => res.data)
      }
      const validateUser = () => {
        const res = validate();
        response = res
      };
      validateUser();
      if(response != -1){
        setUserID(localStorage.getItem("user"))

      }else{
        async function fetchData(){
          const id = await fetch("/api/identifier", {method: "GET"}).then(res => res.json())
          console.log(id);
          localStorage.setItem("user", id)
          setUserID(id);
        }
        fetchData();

      }
    }else{
      async function fetchData(){
        const id = await fetch("/api/identifier", {method: "GET"}).then(res => res.json())
        console.log(id);
        localStorage.setItem("user", id)
        setUserID(id);
      }
      fetchData();
    }
  },[])

  const query = useQuery(
    ["ideas", userID],
    async () => await fetch(`/api/${userID}/ideas`, {method: "GET"}).then(res => res.json()),
  );

  useEffect(() => {
    if (query.isSuccess) {
      setIdeas(query.data);
    }
    console.log(query.data);
  }, [query.isSuccess]);

  async function saveNewIdea(){
    const date = new Date()
    var monthNames = new Array("January", "February", "March", 
"April", "May", "June", "July", "August", "September", 
"October", "November", "December");

    var cDate = date.getDate();
    var cMonth = date.getMonth();
    var cYear = date.getFullYear();

    var cHour = date.getHours();
    var cMin = date.getMinutes();
    var cSec = date.getSeconds();
    console.log(monthNames[cMonth] + " " +cDate  + "," +cYear + " " +cHour+ ":" + cMin+ ":" +cSec);
    const newIdea = {
      title: title,
      description: description,
      date:  monthNames[cMonth] + " " +cDate  + "," +cYear + " " +cHour+ ":" + cMin+ ":" +cSec
    }
    const user = userID
    const res = await fetch(`/api/${user}/ideas`, {method: "POST", body: JSON.stringify(newIdea)})
    const list = await fetch(`/api/${userID}/ideas`, {method: "GET"}).then(res => res.json())
    setIdeas(list)
  }

  async function deleteIdea(ideaId){
    const ideaID = ideaId
    const user = userID
    const res = await fetch(`/api/${user}/ideas`, {method: "DELETE", body: ideaID})
    const list = await fetch(`/api/${userID}/ideas`, {method: "GET"}).then(res => res.json())
    setIdeas(list)
  }

  const saveMutation = useMutation(saveNewIdea)
  const deleteMutation = useMutation(deleteIdea)

  function titleChanged(event){
    setTitle(event.target.value)
  }

  function descriptionChanged(event){
    setDescription(event.target.value)
  }

  async function saveButtonClicked(){
    saveMutation.mutate()
  }


  async function deleteButtonClicked(ideaId){
    deleteMutation.mutate(ideaId)
  }

  return (
    <main className={styles.main} style={{ height: "100%", width: "100%", margin: "0px" }}>
      <Stack direction="column" justifyContent="center" alignContent="top" >
        {!addButtonPressed && (
          <Button
            variant="outlined"
            sx={{ backgroundColor: "white", outlineColor: "secondary", margin: "10px", borderRadius: "10px" }}
            onClick={() => {
              setAddButtonPressed(true);
            }}
          >
            <AddIcon color="secondary" />
          </Button>
        )}
        {addButtonPressed && (
          <Card
            sx={{
              backgroundColor: "white",
              borderRadius: "15px",
              minHeight: "40%",
              margin: "10px"
            }}
          >
            <CardActions>
              <Stack spacing={2} direction="column" sx={{width: "100%",margin: "2%"}}>
                <Box
                  component="form"
                  sx={{width: "100%" }}
                  autoComplete="off"
                >
                  <Stack spacing={2} direction="column" sx={{width: "100%"}}>
                    <TextField
                      id="outlined-basic"
                      label="Title"
                      variant="outlined"
                      onChange={titleChanged}
                      sx={{width: "100%"}}
                    />
                    <TextField
                      id="outlined-basic"
                      label="Description"
                      variant="outlined"
                      multiline
                      minRows={3}
                      onChange={descriptionChanged}
                      sx={{width: "100%"}}
                    />
                  </Stack>
                </Box>
                <Stack spacing={1} direction="row">
                  {
                              title != "" && description != "" && <IconButton
                                onClick={() => {
                                  saveButtonClicked()
                                  setAddButtonPressed(false);
                                }}
                              >
                                <SaveIcon color="secondary" />
                              </IconButton>
                  }
                  <IconButton
                    onClick={() => {
                      setAddButtonPressed(false);
                    }}
                  >
                    <CancelIcon color="secondary" />
                  </IconButton>
                </Stack>
              </Stack>
            </CardActions>
          </Card>
        )}
        <Stack direction="column" justifyContent="center" alignContent="top" >
          {
                ideas!=[]? 
                ideas.map(idea => 
                <Card
                  key={idea.id}
                  sx={{
                    backgroundColor: "white",
                    borderRadius: "15px",
                    width: "400px",
                    minHeight: "100px",
                    margin: "10px"
                  }}
                >
                  <CardActions>
                    <Stack spacing={1} direction="column" sx={{width: "100%",margin: "2%"}}>
                      <CardContent>
                        <Typography>Title: {idea.title}</Typography>
                        <Typography>Description: {idea.description}</Typography>
                        <Typography>Date: {idea.date}</Typography>
                      </CardContent>
                      <Stack spacing={2} direction="row">
                        <IconButton
                          onClick={() => {
                            deleteButtonClicked(idea.id)
                          }}
                        >
                          <DeleteIcon color="secondary" />
                        </IconButton>
                      </Stack>
                    </Stack>
                  </CardActions>
                </Card>
                ) : <></>
          }
        </Stack>
      </Stack>
    </main>
  );
}
