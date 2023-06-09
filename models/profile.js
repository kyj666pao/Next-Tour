import mongoose from 'mongoose'

const Schema = mongoose.Schema

const profileSchema = new Schema({
  name: String,
  avatar: String,
  myPost: [{
    type: Schema.Types.ObjectId, ref: "Post"
  }],
  savedPost: [{
    type: Schema.Types.ObjectId, ref: "Post"
  }],
  following: [{
    type: Schema.Types.ObjectId, ref: "Profile"
  }],
}, {
  timestamps: true
})

const Profile = mongoose.model('Profile', profileSchema)

export {
  Profile
}
