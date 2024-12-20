const express = require('express')
const morgan  = require('morgan')
const cors    = require('cors')
const app     = express()

app.use(express.static('dist'))
app.use(cors())
app.use(express.json())
morgan.token('body', (req) => {
    return req.body ? JSON.stringify(req.body) : ''
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
    {
    "name": "Arto Hellas",
    "number": "040-123456",
    "id": "1"
    },
    {
    "name": "Ada Lovelace",
    "number": "39-44-5323523",
    "id": "2"
    },
    {
    "name": "Dan Abramov",
    "number": "12-43-234345",
    "id": "3"
    },
    {
    "name": "Mary Poppendieck",
    "number": "39-23-6423122",
    "id": "4"
    }
]

//GET
app.get('/info', (req, res) => {
    const currentDateTime = new Date()
    res.send(`<p>Phonebook has info for ${persons.length} people</p><p>${currentDateTime}</p>`)
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id
    const person = persons.find(note => note.id === id)

    if (person) {
        res.json(person)
    } else {
        res.status(401).end()
    }

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
  
    const newPerson = {
      name: body.name,
      number: body.number,
      id: String(Math.floor(Math.random() * 6000) + 1)
    }
  
    persons = persons.concat(newPerson)
  
    res.json(newPerson)
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