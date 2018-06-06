const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const _ = require('underscore')
const mongoose = require('mongoose')
const Movie = require('./models/movie')
// const cookiePaeser = require('cookie-parser')

const port = process.env.PORT || 3000
const app = express()

mongoose.connect('mongodb://localhost/movie-site')

app.set('views', './views')
app.set('view engine', 'jade')

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.locals.moment = require('moment')

app.use(express.static(path.join(__dirname, 'public')))
app.listen(port)

console.log('Movie Site 已启动 ! 端口为: ', port)

// index page
app.get('/', (req, res) => {
    Movie.fetch(function(err, movies) {
        if (err) {
            console.error(err)
        }
        res.render('pages/index', {
            title: '电影首页',
            movies: movies
        })
    })
})

// movie page
app.get('/movie/:id', (req, res) => {
    const id = req.params.id
    Movie.findById(id, function(err, movie) {
        if (err) {
            console.error(err)
        }
        res.render('pages/detail', {
            title: '电影详情: ' + movie.title,
            movie: movie
        })
    })
})

// list page
app.get('/admin/list', (req, res) => {
    Movie.fetch(function(err, movies) {
        if (err) {
            console.error(err)
        }
        res.render('pages/list', {
            title: '电影列表',
            movies: movies
        })
    })
})

// list page
app.delete('/admin/list', (req, res) => {
    const id = req.query.id
    Movie.remove({_id: id}, function (err) {
        if (err) {
            console.error(err)
            res.json({status: 0})
        } else {
            res.json({status: 1})
        }
    })
})

// admin page
app.get('/admin/movie', (req, res) => {
    res.render('pages/admin', {
        title: '后台录入',
        movie: {
            doctor: '',
            country: '',
            title: '',
            year: '',
            poster: '',
            language: '',
            flash: '',
            summary: ''
        }
    })
})

// admin update movie
app.get('/admin/update/:id', function (req, res) {
    const id = req.params.id
    if (id) {
        Movie.findById(id, function (err, movie) {
            if (err) {
                console.error(err)
            }
            res.render('pages/admin', {
                title: '更新电影：' + movie.title,
                movie: movie
            })
        })
    }
})

// admin post movie
app.post('/admin/movie/new', function (req, res) {
    const id = req.body._id
    const movieObj = req.body
    let _movie

    if (id !== 'undefined') {
        Movie.findById(id, function (err, movie) {
            if (err) {
                console.error(err)
            }
            _movie = _.extend(movie, movieObj)
            _movie.save(function (err, movie) {
                if (err) {
                    console.error(err)
                }
                res.redirect('/movie/' + movie._id)
            })
        })
    } else {
        _movie = new Movie({
            doctor: movieObj.doctor,
            title: movieObj.title,
            country: movieObj.country,
            language: movieObj.language,
            year: movieObj.year,
            poster: movieObj.poster,
            summary: movieObj.summary,
            flash: movieObj.flash,
        })
        _movie.save(function (err, movie) {
            if (err) {
                console.error(err)
            }
            res.redirect('/movie/' + movie._id)
        })
    }
})