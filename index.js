// const http = require('http');
const { response, request } = require('express');
const express = require('express');
//$ npm install cors
const cors = require('cors');
const app = express();
//se habilitan los cors para poder hacer peticiones desde cualquier lugar
app.use(cors());

app.use(express.json());

//recordar en este caso, usar let
let posts = [

    {
      "userId": 1,
      "id": 1,
      "title": "sunt aut facere repellat provident occaecati excepturi optio ",
      "body": "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto"
    },
    
    {
      "userId": 1,
      "id": 2,
      "title": "qui est esse",
      "body": "est rerum tempore vitae\nsequi sint nihil reprehenderit dolor beatae ea dolores neque\nfugiat blanditiis voluptate porro vel nihil molestiae ut reiciendis\nqui aperiam non debitis possimus qui neque nisi nulla"
    },
  
    {
      "userId": 1,
      "id": 3,
      "title": "ea molestias quasi exercitationem repellat qui ipsa sit aut",
      "body": "et iusto sed quo iure\nvoluptatem occaecati omnis eligendi aut ad\nvoluptatem doloribus vel accusantium quis pariatur\nmolestiae porro eius odio et labore et velit aut"
    }
  
  ];

// const app = http.createServer((request, response) => {
//     response.writeHead(200, {'Content-Type': 'application/json'})
//     response.end(JSON.stringify(posts))
// });

//Usado express

//Al home y tener un mensaje X
app.get('/', (request, response) => {
    response.send('<h1>Hello World</h1>');
});

//Obtener todos los recursos 
app.get('/api/posts', (request, response) => {
    response.json(posts);
});

//Obtener un solo recurso
app.get('/api/posts/:id', (request, response) => {
    const id = Number(request.params.id);

    //Buscar el id que coincida 
    const post = posts.find(post => post.id === id);
    if (post) {    
        response.json(post);
    }else {
        response.status(404).end();
    }

});

//Eliminar un recurso

app.delete('/api/posts/:id', (request, response) => {

    const id = Number(request.params.id);
    console.log({id});

    //Filtrar el id que sea distinto y solo dejar los que no coincidan  
    posts = posts.filter(post => post.id !== id);
    response.status(204).end();
    

});

// Crear un post

app.post('/api/posts/', (request, response) => {
    //Obtener todo el cuerpo de la peticion
    const post = request.body

    // Enviar un error si el contenido esta vacio
    if (!post || !post.body) {
        return response.status(400).json({error: 'post.body is missing'})
    }

    //Obteber los ids 
    const ids = posts.map(post => post.id)
    //Obtener el mayor id
    const maxId = Math.max(...ids);

    //Crear el nuevo post
    const newPost = {
        id: maxId +1,
        title: post.title,
        body: post.body, 
        userId: 1
    }    

    //Si hay algun valor booleano que se desee dejar en false si no es especificado 
        // important: typeof post.important !== undefined ? post.important : false

    // Conactena todas los post anteriores y el nuevo post
    posts = posts.concat(newPost);

    response.status(201).json(newPost)
})

//Controlando las rutas con el middleware
app.use((request,response) => {
    console.log(request.path);
    response.status(404).json({error: 'Not Found'})
})

const PORT = 3001;
//Al ser asincrono, levanta el servidor de esa forma, usando un cb
app.listen(PORT, ()=> {

    console.log(`Server running on port ${PORT}`);
});