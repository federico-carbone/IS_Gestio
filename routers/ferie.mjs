import app from '../app/app.mjs'
import Ferie from '../models/Ferie.mjs';
import {isAuthenticated, isAuthorized} from '../auth_middleware/auth.mjs'
import { check, validationResult,body }  from 'express-validator';

app.get('/ferie', isAuthenticated, isAuthorized, (req,res) =>{
    Ferie.find().then((ferie) => res.send(ferie))
});

app.post('/ferie', isAuthenticated, isAuthorized, (req,res) => {
    let errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    let ferie = new Ferie({id:req.body['id'],dataInizio: req.body['dataInizio'],dataFine: req.body['dataFine'], motivazione: req.body['motivazione']});
    ferie.save()
        .then(() => res.status(201).send(`Succesfully save ${req.body.dataInizio}`))
        .catch(() => res.status(500).send(`Error saving ${req.body.dataInizio}`));
});

app.delete('/ferie/:id', isAuthenticated, isAuthorized, check('id').notEmpty(), (req,res) => {
    Ferie.findByIdAndRemove(req.params.id)
        .then(() => res.status(201).send(`Succesfully removed: ${req.params.id}`))
        .catch(() => res.status(500).send(`Error deleting: ${req.params.id}`));
});

app.patch('/ferie/:id', isAuthenticated, isAuthorized, async (req, res) => {

    Ferie.findByIdAndUpdate({
        _id:req.params.id
    },{
        $set:req.body
    }).then(()=> {
        res.status(201).json({message:"success"});
    }).catch(err =>{
        res.status(500).send(err.message);
    });
});