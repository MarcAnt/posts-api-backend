//npm i dotenv para variables de entornos
require('dotenv').config();

require('./mongo');

// const http = require('http');
// const { response, request } = require('express');
const express = require('express');
//npm install cors
const cors = require('cors');
const path = require('path');
const app = express();
const Post = require('./models/Post');
const { request } = require('express');

//npm install mongoose
// const mongo = require('./mongo.js');

//se habilitan los cors para poder hacer peticiones desde cualquier lugar
app.use(cors());
app.use(express.json());

//recordar en este caso, usar let
// let posts = [

//     {
//       "userId": 1,
//       "id": 1,
//       "title": "sunt aut facere repellat provident occaecati excepturi optio ",
//       "body": "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto"
//     },
    
//     {
//       "userId": 1,
//       "id": 2,
//       "title": "qui est esse",
//       "body": "est rerum tempore vitae\nsequi sint nihil reprehenderit dolor beatae ea dolores neque\nfugiat blanditiis voluptate porro vel nihil molestiae ut reiciendis\nqui aperiam non debitis possimus qui neque nisi nulla"
//     },
  
//     {
//       "userId": 1,
//       "id": 3,
//       "title": "ea molestias quasi exercitationem repellat qui ipsa sit aut",
//       "body": "et iusto sed quo iure\nvoluptatem occaecati omnis eligendi aut ad\nvoluptatem doloribus vel accusantium quis pariatur\nmolestiae porro eius odio et labore et velit aut"
//     }
  
//   ];


// const app = http.createServer((request, response) => {
//     response.writeHead(200, {'Content-Type': 'application/json'})
//     response.end(JSON.stringify(posts))
// });

//Usado express

//Al home y tener un mensaje X
app.get('/', (request, response) => {
    // response.send('<h1>Hello World</h1>');
    
    //Con esta forma se usa const path = require('path')
    response.sendFile(path.join(__dirname + '/static/index.html'));
    console.log(request);
});

//Obtener todos los recursos 
app.get('/api/posts', (request, response) => {
    // response.json(posts);
    Post.find({}).then(posts => {
        response.json(posts)
    })
});

//Obtener un solo recurso por id
app.get('/api/posts/:id', (request, response, next) => {
    // const id = Number(request.params.id);
    //Estos es porque el id no se recibe de forma numerica nada mas 
    const {id} = request.params;

    Post.findById(id).then(post => {
        if (post) {    
           return response.json(post);
        }else {
            response.status(404).end();
        }
    }).catch(err =>{
        // console.log(err);
        // response.status(400).end();

        //Usando el next, estamos usando un middleware
        next(err);
    })
    //Buscar el id que coincida 
    // const post = posts.find(post => post.id === id);
    // if (post) {    
    //     return response.json(post);
    // }else {
    //     response.status(404).end();
    // }

});

// Esitar un post
app.put('/api/posts/:id', (request, response, next) => {

    // const id = Number(request.params.id);
    const {id} = request.params;

    const post = request.body

    const editPost = {
        userId: post.userId,
        title: post.title,
        body: post.title
    }

    //Filtrar el id que sea distinto y solo dejar los que no coincidan  
    // posts = posts.filter(post => post.id !== id);
    // response.status(204).end();
    
    Post.findByIdAndUpdate(id, editPost, {new: true}).then(result => {
        response.json(result);
    }).catch(err => next(err))

});


//Eliminar un recurso

app.delete('/api/posts/:id', (request, response, next) => {

    // const id = Number(request.params.id);
    const {id} = request.params;

    //Filtrar el id que sea distinto y solo dejar los que no coincidan  
    // posts = posts.filter(post => post.id !== id);
    // response.status(204).end();
    
    Post.findOneAndDelete(id).then(result => {
        response.status(204).end();
    }).catch(err => next(err))

});

// Crear un post

app.post('/api/posts/', (request, response) => {
    //Obtener todo el cuerpo de la peticion
    const post = request.body

    // Enviar un error si el contenido esta vacio
    if (!post || !post.body) {
        return response.status(400).json({error: 'Post body is missing'})
    }

    //Obteber los ids 
    // const ids = posts.map(post => post.id)
    //Obtener el mayor id
    // const maxId = Math.max(...ids);

    //Crear el nuevo post
    // const newPost = {
    //     id: maxId +1,
    //     title: post.title,
    //     body: post.body, 
    //     userId: 1
    // }  
    
    // Recordar que viene del modelo Post
    const newPost = new Post({
        title: post.title,
        body: post.body, 
        userId: Math.ceil( Math.random() * 10 )
    });

    newPost.save().then(savedPost => {
        response.json(savedPost);
    });

    //Si hay algun valor booleano que se desee dejar en false si no es especificado 
        // important: typeof post.important !== undefined ? post.important : false

    // Conactena todas los post anteriores y el nuevo post
    // posts = posts.concat(newPost);

    // response.status(201).json(newPost)
})

//Controlando las rutas con el middleware
app.use((error, request, response, next) => {
    console.error(error);
    if (error.name === 'CastError') {
        
        response.status(400).send({error: 'Bad Request'})
    }else {

        response.status(500).send({error: 'Internal Server Error'})
    }
})

app.use((request,response) => {
    console.log(request.path);
    response.status(404).json({error: 'Not Found'})
})


// const PORT = process.env.PORT || 3001;
//Asi es usando las varariables de entorno
const PORT = process.env.PORT;
//Al ser asincrono, levanta el servidor de esa forma, usando un cb
app.listen(PORT, ()=> {

    console.log(`Server running on port ${PORT}`);
});