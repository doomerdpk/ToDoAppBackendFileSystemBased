const express = require('express');
const app = express()
const fs=require('fs');
const path=require('path');

let filePath = path.join(__dirname,'todos.json');

app.use(express.json());

app.get('/', function (req, res) {
    res.send("<center><h1>To Do APP (File System Based!)</h1></center>");
  })

app.get('/retrieve-todos', function (req, res) {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(404).send('Error reading the JSON file or Json File Not present!');
        }

        if(!data)
        {
            return res.send("<center><h1>Empty To-do List!</h1></center>");
        }

        let todos=[];
        
        if(data)
         {
           todos=JSON.parse(data);
         }
         let renderData=todos[0].id + ". " + todos[0].title+"<br><br>";
         for(let i=1;i<todos.length;i++)
         {
           renderData=renderData+todos[i].id + ". " +todos[i].title+"<br><br>";
         }
        
        res.status(200).send(`<center><h1>Todos List!</h1><br><br>${renderData}</center>`);
    });
})


app.post('/create-todo', function (req, res) {

    if(!req.body.description || !req.body.id)
    {
        res.status(400).send("Can't add an Empty todo!");
    }
    else
    {  
        let todos=[];
        const data=fs.readFileSync(filePath,"utf-8");
        if(data)
         {
           todos=JSON.parse(data);
         }
        
        const todoIndex = todos.findIndex(todo => todo.id === req.body.id);
        if(todoIndex<0)
        {
            const todo ={
                title: req.body.description,
                id: req.body.id
            }
            todos.push(todo);
    
            const jsonData = JSON.stringify(todos, null, 2);
    
            fs.writeFile(filePath,jsonData,(err,data)=>
            {
                if(err)
                {
                    return res.status(404).send('Error writing to the JSON file or Json File not Present!');
                }
                else
                {
                    return res.status(200).send(`Successfully created a todo with id ${todo.id}`);
                }
                
            });
        }
        else
        {
            return res.send(`Already a todo present with id ${req.body.id}`);
        }
        
    }
    
})

app.put('/update-todo/:idx', function (req, res) {
    const idx = parseInt(req.params.idx, 10); 

    let todos=[];
    const data=fs.readFileSync(filePath,"utf-8");
    if(data)
    {
        todos=JSON.parse(data);
    }
    const todoIndex = todos.findIndex(todo => todo.id === idx);
     
    if(todoIndex<0)
    {
        res.status(404).send(`There is no any todo presnt with id ${idx}`);
    }
    else if(!req.body.title)
    {
        res.status(400).send("Please provide the content to update this todo!");
    }
    else
    {
        todos[todoIndex].title = req.body.title;
        const jsonData = JSON.stringify(todos, null, 2);

        fs.writeFile(filePath,jsonData,(err,data)=>
        {
            if(err)
            {
                return res.status(404).send('Error writing to the JSON file or Json File not Present!');
            }
            else
            {
                return res.status(200).send(`Successfully updated the todo with id ${idx}`);
            }
            
        }); 
        
    }
        
});


app.delete('/delete-todo/:idx', function (req, res) {
    const idx = parseInt(req.params.idx, 10);

    let todos=[];
    const data=fs.readFileSync(filePath,"utf-8");
    if(data)
    {
        todos=JSON.parse(data);
    }
    const todoIndex = todos.findIndex(todo => todo.id === idx);

    if(todoIndex<0)
    {
         res.status(404).send(`There is no any todo presnt with id ${idx}`);
    }
    else
    {
        todos.splice(todoIndex,1);
        const jsonData = JSON.stringify(todos, null, 2);

        fs.writeFile(filePath,jsonData,(err,data)=>
        {
            if(err)
            {
                return res.status(404).send('Error writing to the JSON file or Json File not Present!');
            }
            else
            {
                return res.status(200).send(`Successfully deleted a todo with id ${idx}`);
            }
            
        });   
    }
    
})

app.listen(3000);