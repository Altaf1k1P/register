import mongoose, {Schema} from 'mongoose';
import {User} from "./user.models.js"
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";


const PostSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
});
PostSchema.plugin(mongooseAggregatePaginate)
// Define the Post model with the schema

export const Post = mongoose.model('Post', PostSchema);