
const express = require("express")
const app = express()
const mustacheExpress = require("mustache-express")
const bodyParser = require("body-parser")
const pgp = require("pg-promise")()
const bcrypt = require("bcrypt")

const PORT = 3000
const CONNECTION_STRING = "postgres://localhost:5432/newsdb"
const SALT_ROUNDS = 10 

// Configuring your view engine
app.engine("mustache",mustacheExpress())
app.set("views","./views")
app.set("view engine","mustache")

app.use(bodyParser.urlencoded({extended: false}))

const db = pgp(CONNECTION_STRING)


app.post('/register', (req,res) => {

    let username = req.body.username
    let password = req.body.password
// hash and add salt rounds
    db.oneOrNone("SELECT userid  FROM users WHERE username = $1",[username])
    .then((user) => {
        if(user) {
            res.render("register", {message: "User name already exists"})
        } else {
            bcrypt.hash(password,SALT_ROUNDS,(error, hash) =>  {

                if(error == null) {
                    db.none('INSERT INTO users(username,password) VALUES($1,$2)',[username,hash])
                    .then(() => {
                    res.send("Success")
                    })
                }
            })
        }
    })
})

// to  show the  register page

app.get('/register', (req,res)  => {
    res.render("register")
})

// to make sure your port is listening

app.listen(PORT, () => {
    console.log(`Server has started on ${PORT}`)
})