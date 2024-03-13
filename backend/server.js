const express = require('express')
const cors = require('cors')
const { BlogModel } = require('./models/Blogs.model')
const { UserModel } = require('./models/User.model')
const { connection } = require('./config/db')

const app = express()
app.use(express.json())
app.use(cors({ origin: '*' }));

app.get('/', (req, res)=> {
    res.send("This is the Main Page");
})

app.get("/blogs", async (req, res)=> {
    const blogs = await BlogModel.find();
    res.send({blogs : blogs});
})

app.post("/signup", async (req, res) => {
    const { name, email, password } = req.body;
    
    const new_user = new UserModel({
        name,
        email,
        password
    });

    try {
        await new_user.save();
        console.log(new_user);
        res.send({ msg: "User inserted successfully", new_user });
    } catch (err) {
        console.log(err);
        res.status(500).send({message :"Something went wrong"});
    }
});


app.post('/create', async(req, res)=> {
    const {title, description, author_name } = req.body;

try{
    const new_blog = new BlogModel ({
        title, 
        description, 
        author_name : author_name
    })

    await new_blog.save();
    console.log(new_blog);
    res.send("Blog Created");
}
catch(error)
{
    console.error('Error creating blog:', error);
    res.status(500).json({ message: 'Server Error' });
}
})

app.post('/blogs/:id/comments', async (req, res) => {
    const { id } = req.params;
    const { comment } = req.body;

    try {
        const blog = await BlogModel.findById(id);
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        blog.comments.push(comment);
        await blog.save();
        res.json({ message: 'Comment added successfully', blog });
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});


app.delete('/blogs/:id/comments/:commentId', async (req, res) => {
    const { id, commentId } = req.params;

    try {
        const blog = await BlogModel.findById(id);
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        blog.comments.splice(commentId, 1);
        await blog.save();
        res.json({ message: 'Comment deleted successfully', blog });
    } catch (error) {
        console.log('Error deleting comment:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

app.listen(7500, async()=> {
    try
        {
        await connection;
        console.log("Connected to DB Successfully");
        }
    catch(err)
        {
            console.log("Error while connecting to DB");
            console.log(err);
        }
    console.log("listening on port 7500");
})