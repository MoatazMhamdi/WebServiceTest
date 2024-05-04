const Blog = require("../models/backendBLOGSModels.js");




    exports.addBlog = async function(req, res, next) {
        const blogs = new Blog({
         Title: req.body.Title,
            Description: req.body.Description,
            image: req.body.image,
            Sujet: req.body.Sujet,
        });

        await blogs.save()
            .then((blogs) => res.status(200).json({ blogs }))
            .catch((error) => res.status(400).json({ error }));
        }
    
    exports.getAllBlogs = async function(req, res, next) {
        try {
            const blogs = await Blog.find().exec();
            res.status(200).json(blogs);
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
            console.error(error);
        }
        }
    
    exports.PATCHBlog  = async function (req, res) {
        try {
            const blogsId = req.params.id; // Corrected from req.param.id

            const { Title, Description, image, Sujet } = req.body;

            const blog = await Blog.findById(blogsId); // Corrected from blogs.findById

            if (!blog) {
            return res.status(404).json({ error: "Blog not found" }); // Corrected from "blog not found"
            }

            blog.Title = Title;
            blog.Description = Description;
            blog.image = image;
            blog.Sujet = Sujet;

            const updatedBlog = await blog.save(); // Renamed to avoid conflict with function name

            res.status(200).json(updatedBlog);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
        }
    
    exports.deleteBlog = async function (req, res, next) {
        try {
            const blogId = req.params.id; // Corrected from req.param.id

            console.log('Attempting to delete blog with ID:', blogId);

            // Find the blog by its ID
            const blogToDelete = await Blog.findOne({ _id: blogId }); // Corrected to use _id

            if (!blogToDelete) {
            console.log('Blog not found for ID:', blogId);
            return res.status(404).json({ message: 'Blog not found' });
            }

            // Delete the blog
            await blogToDelete.deleteOne();

            console.log('Blog deleted successfully:', blogToDelete);
            res.json({ message: 'Blog deleted successfully', blog: blogToDelete });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
        }
    