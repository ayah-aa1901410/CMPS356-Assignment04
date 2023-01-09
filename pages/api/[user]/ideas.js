"use client"
import fs from "fs"

export default async function handler(req, res){

    if(req.method === "GET"){
          const file = await fs.promises.readFile("tmp/ideas.json");

          const ideasList = JSON.parse(file)

          const userID = req.query.user
          const userIndex = ideasList.findIndex(user => user.id == userID)
          let userIdeas = []


          if(userIndex  != -1){

            userIdeas = ideasList[userIndex].ideas
            res.status(200).json(userIdeas)

          }else{

            const userFile = await fs.promises.readFile("tmp/users.json")  
            const userList = JSON.parse(userFile)
            const userInd = userList.findIndex(user => user == userID)
      
            if(userInd != -1){
              const newUser = {
                id: userID,
                ideas: []
              }
              ideasList.push(newUser)

              await fs.promises.writeFile("tmp/ideas.json", JSON.stringify(ideasList),'utf8', err => {
                if (err) {
                  console.log(`Error writing file: ${err}`)
                } else {
                  console.log(`File is written successfully!`)
                }
              })
              res.status(200).json(userIdeas)

            }else{
              res.status(500).json("User Not Found")
            }
          }

    }else if(req.method === "POST"){
        const file = await fs.promises.readFile("tmp/ideas.json");

        const ideasList = JSON.parse(file)
        const userID = req.query.user
      
        const newIdea = JSON.parse(req.body)
        console.log(typeof(newIdea));

        const userIndex = ideasList.findIndex(user => user.id == userID)
        let newID = -1
        if(ideasList[userIndex].ideas.length == 0){
          newID = 0
        }else{
          newID = Number(ideasList[userIndex].ideas[ideasList[userIndex].ideas.length-1].id)+1
        }
        if(userIndex  != -1){
          const ideaObject = {
            id: newID,
            title: newIdea.title,
            description: newIdea.description,
            date: newIdea.date
          }
          ideasList[userIndex].ideas.push(ideaObject)

        }else{
          const newUser = {
            id: userID,
            ideas: [
              {
                id: 0,
                title: newIdea.title,
                description: newIdea.description,
                date: newIdea.date
              }
            ]
          }

          ideasList.push(newUser)
        }
    
        await fs.promises.writeFile("tmp/ideas.json", JSON.stringify(ideasList),'utf8', err => {
            if (err) {
              console.log(`Error writing file: ${err}`)
            } else {
              console.log(`File is written successfully!`)
            }
          })

          res.status(200).json("success")
    }else if(req.method === "DELETE"){

        const file = await fs.promises.readFile("tmp/ideas.json");

        const ideasList = JSON.parse(file)
        const userID = req.query.user
      
        const ideaID = req.body

        const userIndex = ideasList.findIndex(user => user.id == userID)

        if(userIndex  != -1){
          const ideaIndex = ideasList[userIndex].ideas.findIndex(idea => idea.id == ideaID)
          ideasList[userIndex].ideas.splice(ideaIndex, 1)
        }
    
        await fs.promises.writeFile("tmp/ideas.json", JSON.stringify(ideasList),'utf8', err => {
            if (err) {
              console.log(`Error writing file: ${err}`)
            } else {
              console.log(`File is written successfully!`)
            }
          })

          res.status(200).json("success")
    }
}