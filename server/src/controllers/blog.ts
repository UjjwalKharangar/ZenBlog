import { NextFunction, Request, Response } from 'express';
import logging from '../config/logging';
import Blog from '../models/blog';
import mongoose from 'mongoose'; 

const create = (req: Request, res: Response, next: NextFunction) => {
    logging.info('Attempting to register blog ...');

    let { author, title, content, headline, picture } = req.body;

    const blog = new Blog({
        _id: new mongoose.Types.ObjectId(),
        author,
        title,
        content,
        headline,
        picture
    });

    return blog
        .save()
        .then((newBlog) => {
            logging.info(`New blog created...`);

            return res.status(201).json({ blog: newBlog });
        })
        .catch((error) => {
            logging.error(error.message);

            return res.status(500).json({
                message: error.message
            });
        });
};

const read = (req: Request, res: Response, next: NextFunction) => {
    const _id = req.params.blogID;
    logging.info(`Incoming read for ${_id}`);

    Blog.findById(_id)
        .populate('author')
        .then((blog) => {
            if (blog) {
                return res.status(200).json({
                    blog: blog
                });
            } else {
                return res.status(404).json({
                    error: 'Not Found.'
                });
            }
        })
        .catch((error) => {
            logging.error(error.message);

            return res.status(500).json({
                error: error.message
            });
        });
};

const readAll = (req: Request, res: Response, next: NextFunction) => {
    logging.info('Incoming read all');

    Blog.find()
        .populate('author')
        .exec()
        .then((blogs) => {
            return res.status(200).json({
                count: blogs.length,
                blogs: blogs
            });
        })
        .catch((error) => {
            logging.error(error.message);

            return res.status(500).json({
                message: error.message
            });
        });
};

const query = (req: Request, res: Response, next: NextFunction) => {
    logging.info('Incoming query');

    Blog.find(req.body)
        .populate('author')
        .exec()
        .then((blogs) => {
            return res.status(200).json({
                count: blogs.length,
                blogs: blogs
            });
        })
        .catch((error) => {
            logging.error(error.message);

            return res.status(500).json({
                message: error.message
            });
        });
};

const update = (req: Request, res: Response, next: NextFunction) => {
  const _id = req.params.blogID;
  logging.info(`Incoming update for ${_id}`);

    Blog.findById(_id)
        .exec()
        .then((blog) => {
            if(blog)
            {
                blog.set(req.body);
                blog.save()
                    .then((savedBlog) => {
                        logging.info(`Blog updated...`);

                        return res.status(201).json({ 
                            blog: savedBlog 
                        });
                    })
                    .catch((error) => {
                        logging.error(error.message);

                        return res.status(500).json({
                            message: error.message
                        });
                    });
            }
            else
            {
                return res.status(401).json({message: 'Not found'});
            }
        })
        .catch((error) => {
            logging.error(error.message);

            return res.status(500).json({
                message: error.message
            });
        });
};

const deleteBlog = (req: Request, res: Response, next: NextFunction) => {
    const _id = req.params.blogID;

    logging.warn(`Incoming delete for ${_id}`);

    Blog.findByIdAndDelete(_id)
        .exec()
        .then(() => {
            return res.status(201).json({message: 'Blog deleted'});
        })
        .catch((error) => {
            logging.error(error.message);

            return res.status(500).json({
                error: error.message
            });
        });
};


export default {
    create,
    read,
    readAll,
    query,
    update,
    deleteBlog
};
