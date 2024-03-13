const mongoose = require('mongoose')

const blogSchema = mongoose.Schema ({
    title : {type : String, required : true},
    description :{ type : String, required : true},
    author_name :{ type : String},
    comments: [String]
    },
    {
        timestamps : true,
    }
)

const BlogModel = mongoose.model("blog", blogSchema)

module.exports = {BlogModel}