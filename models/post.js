import mongoose from "mongoose";

const Schema = mongoose.Schema

const commentSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId, ref: "Profile"
    },
    content: {
        type: String,
        required: true
    }
}) 

const postSchema = new Schema({
    topic: {
        type: String,
        required: true,
    },
    photo: {
        type: String,
    },
    content: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: function() {
            let date = new Date()
            return date
        }
    },
    location: {
        type: String,
    },
    state:{
        type: String,
        enum: ['Alabama','Alaska','American Samoa','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','District of Columbia','Federated States of Micronesia','Florida','Georgia','Guam','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Marshall Islands','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Northern Mariana Islands','Ohio','Oklahoma','Oregon','Palau','Pennsylvania','Puerto Rico','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virgin Island','Virginia','Washington','West Virginia','Wisconsin','Wyoming']
    },
    author: {
        type: Schema.Types.ObjectId, ref: "Profile"
    },
    comments: [commentSchema]
},{
    timestamps: true
})

const Post = mongoose.model("Post", postSchema)

export {
    Post
}