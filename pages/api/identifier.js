import { handleClientScriptLoad } from 'next/script'
import { v4 as uuidv4 } from 'uuid'
import fs from "fs"

export default async function handler(req, res) {
    if(req.method === "GET"){
      const randomID = uuidv4()
      const id = randomID.replaceAll("-", "")

      const file = await fs.promises.readFile("tmp/users.json");
  
      const userList = JSON.parse(file)

      userList.push(id)
  
      await fs.promises.writeFile("tmp/users.json", JSON.stringify(userList),'utf8', err => {
          if (err) {  
            console.log(`Error writing file: ${err}`)
          } else {
            console.log(`File is written successfully!`)
          }
        })
      res.status(200).json(id)
    }else if(req.method === "POST"){

      const file = await fs.promises.readFile("tmp/users.json");
  
      const userList = JSON.parse(file)

      const userID = req.body

      const userIndex = userList.findIndex(user => user == userID)

      if(userIndex != -1){
        res.status(200).json(userIndex)
      }else{
        res.status(500).json("User Not Found")
      }
    }
  }
  