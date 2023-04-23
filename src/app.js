const express = require('express');
const path = require('path');
const app = express();
const hbs = require('hbs');
const port = process.env.PORT || 3000;

require("./db/conn");
const Register = require('./models/registers');
const {json} = require('express');
const {log} = require('console');

const static_path = path.join(__dirname,"../public");
const template_path = path.join(__dirname,"../templates/views");
const partials_path = path.join(__dirname,"../templates/partials");

app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use(express.static(static_path));
app.set('view engine','hbs');
app.set('views',template_path);
hbs.registerPartials(partials_path);



app.get('/',(req,res)=>{
    res.render("index");
})

app.get('/signup',(req,res)=>{
    res.render("signUp");
})

app.get('/login',(req,res)=>{
    res.render("login");
})

// create a new user on our database
app.post('/signup',async(req,res)=>{
    try{
        const password = req.body.password;
        const confirm_password = req.body.confirmpassword;

        if(password === confirm_password){

            const registerEmployee = new Register({
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                confirmpassword: req.body.confirmpassword
            })

            const registered = await registerEmployee.save();
            res.status(201).render("dashboard");
        }else{
            res.status(404).send("Password is incorrect..");
        }
    }catch(error){
        res.status(404).send(error);
    }
})

app.post('/login',async(req,res)=>{
    try{
        const email = req.body.email;
        const password = req.body.password;

        const useremail = await Register.findOne({email:email});

        if(useremail.password === password){
            res.status(201).render('dashboard');
        }
    }catch(error){
        res.status(400).send("Invalid Details");
    }
})

app.listen(port,()=>{
    console.log(`Listen is successful on port ${port}`);
});