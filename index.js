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

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = []

//GET
app.get('/info', (req, res) => {
    const currentDateTime = new Date()
    res.send(`<p>Phonebook has info for ${persons.length} people</p><p>${currentDateTime}</p>`)
})

app.get('/api/persons', (req, res) => {
    Person.find({})
    .then(dbPersons => {
        res.json(dbPersons)
    })
})

app.get('/api/persons/:id', (req, res) => {
    Person.findById(req.params.id)
    .then(person => {
        res.json(person)
    })
    .catch(error => {
        res.status(401).end()
    })
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
        res.json(newPerson)
    })
})

//DELETE
app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id
    persons = persons.filter(person => person.id !== id)
    
    res.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})