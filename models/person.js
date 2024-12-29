const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI
console.log('connecting to', url)

mongoose.connect(url)
  // eslint-disable-next-line no-unused-vars
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true
  },
  number: {
    type: String,
    validate: {
      validator: (number) => {
        return /\d{2,3}-\d{7,8}/gm.test(number)
      },
      message: props => `${props.value} is not valid phone number. It should start with 2 or 3 numbers with separated by hyphen the additional 7 to 8 numbers.`
    },
    required: true
  },
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)