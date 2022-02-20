const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejs = require('ejs');
const ejsMate = require('ejs-mate');


const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render('home.ejs')
})

app.get('/conditions', (req, res) => {
    res.render('conditions.ejs')
})

app.get('/game', (req, res) => {
    res.render('game.ejs')
})

app.get('/end', (req, res) => {
    res.render('end.ejs')
})

app.get('/highscores', (req, res) => {
    res.render('highscores.ejs')
})

app.all('*', (req, res, next) => {
    res.redirect('/')
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Serving on Port ${port}`)
});