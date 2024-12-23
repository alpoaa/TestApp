require('dotenv').config()

const express = require('express')
const morgan  = require('morgan')
const cors    = require('cors')
const app     = express()
const Person  = require('./models/person')

app.use(express.static('dist'))
app.use(cors())
app.use(express.json())
morgan.token('body', (req) => {
    return req.body ? JSON.stringify(req.body) : ''
})
const errorHandler = (error, request , response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({error: 'malformatted id'})
    }

    next(error)
}
const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' })
}


app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = []

//GET
app.get('/info', (req, res) => {
    const currentDateTime = new Date()
    Person.find({})
    .then(dbPersons => {
        res.send(`<p>Phonebook has info for ${dbPersons.length} people</p><p>${currentDateTime}</p>`)
    })
})

app.get('/api/persons', (req, res) => {
    Person.find({})
    .then(dbPersons => {
        res.json(dbPersons)
    })
})

app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id)
    .then(person => {
        if (person) {
            res.json(person)
        } else {
            res.status(404).end()
        }
    })
    .catch(error => next(error))
})

//POST
app.post('/api/persons', (req, res) => {
    const body = req.body

    if (!body.name || !body.number) {
      return res.status(400).json({ 
        error: 'name and/or number is missing' 
      })
    }

    const person = persons.find(person => person.name === body.name)

    if (person) {
        return res.status(401).json({
            error: 'name must be unique'
        })
    }  
  
    const newPerson = new Person({
        name: body.name,
        number: body.number
    })

    newPerson.save()
    .then(savedPerson => {
        res.json(savedPerson)
    })
})

//DELETE
app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndDelete(req.params.id)
    .then(result => {
        res.status(204).end()
    })
    .catch(error => next(error))
})

//UPDATE
app.put('/api/persons/:id', (req, res, next) => {
    const body   = req.body
    const person = {
        name: body.name,
        number: body.number
    }
    
    Person.findByIdAndUpdate(req.params.id, person, {new: true})
    .then(updatedPerson => {
        res.json(updatedPerson)
    })
    .catch(error => next(error))
})

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})