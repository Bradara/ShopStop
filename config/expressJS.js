const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const passport = require('passport')

module.exports = (app, config) => {
  // Configure middleware for parsing form data
  app.use(bodyParser.urlencoded({ extended: true }))
  // Configure user authentication and authorization
  app.use(cookieParser())
  app.use(session({ secret: 'S3cr3t', saveUninitialized: false, resave: false }))
  app.use(passport.initialize())
  app.use(passport.session())

  app.use((req, res, next) => {
    if (req.user) {
      res.locals.user = req.user
    }

    next()
  })
  // Add view engine and views folder.
  app.set('view engine', 'pug')
  app.set('views', path.join(config.rootPath, 'views'))

  // Configure "public" folder.
  let staticPath = path.normalize(path.join(config.rootPath, 'content'))
  app.use((req, res, next) => {
    if (req.url.startsWith('/content')) {
      req.url = req.url.replace('/content', '')
    }

    next()
  }, express.static(staticPath))
}