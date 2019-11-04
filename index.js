const path = require('path');
const hbs = require('hbs');
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();

//membuat koneksi
const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'blog'
})

// koneksi ke database
  conn.connect((err) => {
    if (err) throw err
    console.log('Mysql Connected ...')
})

 // menset view
 app.set('views', path.join(__dirname, 'views'))
 app.set('view engine', 'hbs')

 // menggunakan bodyparse
 app.use(bodyParser.json())
 app.use(bodyParser.urlencoded({
     extended: false
 }))

 // menset public folder
 app.use('/assets', express.static(__dirname + '/public'))

 // routes
 // index : post list (routers pertama)
 app.get('/', (req, res) => {
     let sql = 'select * from posts'
     let query = conn.query(sql, (err, results) => {
         if (err) throw err
         res.render('index', {
             posts: results
         })
     })
 })

 // membuat router post (routers 2)
 app.post('/posts', (req, res) => {
     let data = {
         title: req.body.title,
         content: req.body.content
     }
     let sql = 'insert into posts set ?'
     let query = conn.query(sql, data, (err, results) => {
         if (err) throw err
         res.redirect('/')
     })
 })

 // membuat routers update (routers 3)
 app.post('/posts/edit', (req, res) => {
     let sql = 'update posts set title="'+req.body.title+'", content="'+req.body.content+'" where id='+req.body.id
     let query = conn.query(sql, (err, results) => {
         if (err) throw err
         res.redirect('/')
     })
 })

 // membuat routers deleted (routers 4)
 app.post('/posts/delete', (req, res) => {
     let sql = 'delete from posts where id='+req.body.id+''
     let query = conn.query(sql, (err, results) => {
         if (err) throw err
         res.redirect('/')
     })
 })

 // membuat server
 app.listen(9000, () => {
     console.log('Server is running at port 9000')
 })