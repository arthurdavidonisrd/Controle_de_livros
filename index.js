const express = require('express');
const { create } = require('express-handlebars'); 
const mysql = require('mysql');

const port = 3000;
const app = express();

const hbs = create({ defaultLayout: 'main' });
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.static('public'));

app.use(
    express.urlencoded({
        extended: true
    }),
)

app.use(express.json())

app.get('/', (req, res) => {
    res.render('home');
});

app.post('/books/insertbooks', (req, res) =>{
    const title = req.body.title;
    const pageqty = req.body.pageqty

    const query = `INSERT INTO books (title, pageqty) VALUES ('${title}' ,  '${pageqty}')`

    conn.query(query, function(err){
        if(err){
            console.log(`Query error: ${err}`)
            return
        }

        res.redirect('/')
    })
    

})

app.get('/books', (req, res) =>{
    const query = `SELECT * FROM books`

    conn.query(query, function(err, data){
        
        if(err){
            console.log(`Query error: ${err}`)
            return
        }

        const books = data

        res.render('books', {books});
    })

})

app.get('/books/:id', (req, res) =>{
    const id = req.params.id

    const sql = `SELECT * FROM books WHERE id = ${id}`;

    conn.query(sql, function(err, data){
        if(err){
            console.log(`Query eror: ${err}`)
        }

        const book = data[0]

        res.render('book', {book});
    })
})

app.get('/books/edit/:id', (req, res) =>{
    const id = req.params.id

    const sql = `SELECT * FROM books WHERE id = ${id}`;
    conn.query(sql, function(err, data){
        if(err){
            console.log(`Query error: ${err}`)
        }

        const book = data[0]

        res.render('editbook', {book})
    })

})

app.post('/books/uptadebooks', (req, res) =>{
    const id = req.body.id;
    const title =req.body.title;
    const pageqty = req.body.pageqty;

    const sql = ` UPDATE books SET title = '${title}' , pageqty = '${pageqty}' WHERE id = '${id}' `
    conn.query(sql, function(err, data){
        if(err){
            console.log(`Query error: ${err}`)
        }

        res.redirect('/books')
    })

})

app.post('/books/remove/:id', (req, res) =>{
    const id = req.params.id;

    const sql = `DELETE FROM books WHERE id = ${id}`

    conn.query(sql, function(err, data){
        if(err){
            console.log(`Query error: ${err}`)
        }

        res.redirect('/books')
    })
})


const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'nodemon1'
});


conn.connect(function(err) {
    if (err) {
        console.error(`Error connecting to the database: ${err}`);
        return;
    }

    console.log('Connected to the database successfully!');

    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
});
