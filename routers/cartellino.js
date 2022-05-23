const app = require('../app/app.js')
const Cartellino = require('../models/Cartellino.js')
const {isAuthenticated, isAuthorized} = require('../middlewares/auth.js')
const {check, validationResult} = require('express-validator')

app.get('/api/v1/timbratura', isAuthenticated, isAuthorized, (req,res) =>{
    Cartellino.find().then((cartellino) => res.send(cartellino))
});

app.post('/api/v1/timbratura', isAuthenticated, isAuthorized,check('data').notEmpty(), check('tipo').notEmpty(),check('ora').notEmpty(), (req,res) => {
    let errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    
    let c = new Cartellino({data: req.body['data'],tipo: req.body['tipo'], ora: req.body['ora'], smartworking: req.body['smartworking']});
    c.save()
        .then(() => res.status(201).send(`Succesfully checked ${req.body.tipo}`))
        .catch(() => res.status(500).send(`Error checking ${req.body.tipo}`));
});

app.delete('/api/v1/timbratura/:id', isAuthenticated, isAuthorized , (req,res) => {

    Cartellino.findByIdAndRemove(req.params.id)
        .then(() => res.status(201).send(`Succesfully removed: ${req.params.id}`))
        .catch(() => res.status(500).send(`Error deleting: ${req.params.id}`));
});

app.patch('/api/v1/timbratura/:id', isAuthenticated, isAuthorized, async (req, res) => {

    Cartellino.findByIdAndUpdate({
        _id:req.params.id
    },{
        $set:req.body
    }).then(()=> {
        res.status(201).json({message:"success"});
    }).catch(err =>{
        res.status(500).send(err.message);
    });
});