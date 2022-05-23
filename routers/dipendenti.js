const app = require('../app/app.js')
const Dipendente = require('../models/Dipendenti.js')
const {isAuthenticated, isAuthorized} = require('../middlewares/auth.js')

app.get('/dipendente', isAuthenticated, isAuthorized, (req,res) =>{
    Dipendente.find().then((dipendente) => res.send(dipendente))
});

app.post('/dipendente', isAuthenticated, isAuthorized , async (req,res) => {

    let user = await Dipendente.findOne({email: req.body['email']});
    if(user) {
        return res.status(401).send('User already exists with this email');
    }

    let dipendente = new Dipendente({nome: req.body['nome'],cognome: req.body['cognome'], livello: req.body['livello'], data: req.body['data'],email: req.body['email']});
    dipendente.save()
        .then(() => res.status(201).send(`Succesfully save ${req.body.email}`))
        .catch(() => res.status(500).send(`Error saving ${req.body.email}`));
});

app.delete('/dipendente/:id', isAuthenticated, isAuthorized, (req,res) => {
    Dipendente.findByIdAndRemove(req.params.id)
        .then(() => res.status(201).send(`Succesfully removed: ${req.body.email}`))
        .catch(() => res.status(500).send(`Error deleting: ${req.body.email}`));
});

app.patch('/dipendente/:id', isAuthenticated, isAuthorized, async (req, res) => {

    const dipendente = await Dipendente.findOne({email: req.body.email});
    if(dipendente) return res.status(400).send('Email already exists');

    Dipendente.findByIdAndUpdate({
        _id:req.params.id
    },{
        $set:req.body
    }).then(()=> {
        res.status(201).json({message:"success"});
    }).catch(err =>{
        res.status(500).send(err.message);
    });
});