// models/Post.js
const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
        trim: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  // Reference to User Model
        required: true
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'  // List of users who liked the post
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Populate user information for the likes when fetching posts (optional, but could be useful in some scenarios)
PostSchema.pre('find', function() {
    this.populate('likes', 'username'); // Populate username for likes (if needed)
});

module.exports = mongoose.model('Post', PostSchema);
