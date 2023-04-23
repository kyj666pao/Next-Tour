import mongoose from "mongoose";

const Schema = mongoose.Schema

const  postSchema = new Schema({
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
    author: {
        type: Schema.Types.ObjectId, ref: "Profile"
    },
    // comments: [commentSchema]
},{
    timestamps: true
})

const Post = mongoose.model("Post", postSchema)

export {
    Post
}