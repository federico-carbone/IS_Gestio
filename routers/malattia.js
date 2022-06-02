const app = require('../app/app.js')
const Malattia = require('../models/Malattia.js')
const {isAuthenticated, isAuthorized} = require('../middlewares/auth.js')
const {check, validationResult} = require('express-validator')

app.get('/api/v1/malattia', isAuthenticated, isAuthorized, (req, res) => {
    Malattia.find().then((malattia) => res.send(malattia));
});

app.post('/api/v1/malattia', isAuthenticated, isAuthorized, check('certificato').notEmpty(),check('dataInizio').notEmpty(),check('dataFine').notEmpty(),check('email').notEmpty(), (req, res) => {
    let errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    } else {
        let m = new Malattia({ certificato: req.body['certificato'], dataInizio: req.body['dataInizio'],dataFine: req.body['dataFine'], email: req.body['email'] });
        m.save()
            .then(() => res.status(201).send(`Successfully uploaded`))
            .catch(() => res.status(500).send('Error while uploading'));
    }
});

app.delete('/api/v1/malattia/:id', isAuthenticated, isAuthorized, (req, res) => {
    Malattia.findByIdAndRemove(req.params.id)
        .then(() => res.status(201).send(`Successfully remove id ${req.params.id}`))
        .catch(() => res.status(500).send('Error deleting user'));
});

app.patch('/api/v1/malattia/:id', isAuthenticated, isAuthorized, async (req, res) => {

    Malattia.findByIdAndUpdate({
        _id:req.params.id
    },{
        $set:req.body
    }).then(()=> {
        res.status(201).json({message:"success"});
    }).catch(err =>{
        res.status(500).send(err.message);
    });
})
