require('dotenv').config()

const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Not enough parameters')
  process.exit()
}

const dbPassword      = process.argv[2]
const dbUrl           = `mongodb+srv://${process.env.MONGO_DB_USER}:${dbPassword}@webdev.perkp.mongodb.net/addressbook?retryWrites=true&w=majority`

console.log('Trying to log into database:', dbUrl)
mongoose.set('strictQuery', false)
mongoose.connect(dbUrl)

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = new mongoose.model('Person', personSchema)

if (process.argv.length > 3) {
  const newPersonName   = process.argv[3]
  const newPersonNumber = process.argv[4]

  const person = new Person({
    name: newPersonName,
    number: newPersonNumber
  })

  person.save()
    // eslint-disable-next-line no-unused-vars
    .then(result => {
      console.log('New person saved!')
      mongoose.connection.close()
    })
} else {
  Person.find({})
    .then(result => {
      result.forEach(person => {
        console.log(person)
      })
      mongoose.connection.close()
    })
}

