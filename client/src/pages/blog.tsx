import React, { FunctionComponent, useContext, useEffect, useState } from 'react';
import { useParams, useNavigate, Link, Navigate } from 'react-router-dom';
import UserContext from '../contexts/user';
import IBlog from '../interfaces/blog';
import IUser from '../interfaces/user';
import IPageProps from '../interfaces/page';
import config from '../config/config';
import axios from 'axios';
import LoadingComponent, { Loading } from '../components/LoadingComponent';
import { Button, Container, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import Navigation from '../components/Navigation';
import ErrorText from '../components/ErrorText';
import Header from '../components/Header';

const BlogPage: React.FunctionComponent<IPageProps> = props => {
    
    const { blogID } = useParams<{ blogID: string }>();
    const [id, setId] = useState<string>('');
    const [blog, setBlog] = useState<IBlog | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [modal, setModal] = useState<boolean>(false);
    const [deleting, setDeleting] = useState<boolean>(false);
    const { user } = useContext(UserContext).userState;
    const navigate = useNavigate();

    useEffect(() => {
        if (blogID) {
            setId(blogID);
        } else {
            navigate('/');
        }
        // eslint-disable-next-line
    }, [blogID]);

    useEffect(() => {
        if (id !== '') {
            getBlog(id);
        }
        // eslint-disable-next-line
    }, [id]);

    const getBlog = async (id: string) => {
        try {
            const response = await axios({
                method: 'GET',
                url: `${config.server.url}/blogs/read/${id}`,
            });

            if (response.status === 200 || response.status === 304) {
                setBlog(response.data.blog);
            } else {
                setError(`Unable to retrieve blog ${id}`);
            }
        } catch (error: any) {
            setError(error.message);
        }
         finally {
            setTimeout(()=>{
                setLoading(false);
            }, 500);
        }
    }

    const deleteBlog = async () => {
        setDeleting(true);

        try {
            const response = await axios({
                method: 'DELETE',
                url: `${config.server.url}/blogs/${id}`,
            });

            if (response.status === 201) {
                setTimeout(()=> { 
                    navigate('/');
                }, 500);
            } else 
            {
                setError(`Unable to delete blog ${id}`);
                setDeleting(false);
            }
        } catch (error: any) {
            setError(error.message);
            setDeleting(false);
        }
    }

    if (loading) return <LoadingComponent>Loading Blog ...</LoadingComponent>;

    if (blog) {
        return (
            <Container fluid className="p-0">
                <Navigation />
                <Modal isOpen={modal}>
                    <ModalHeader>Delete</ModalHeader>
                    <ModalBody>
                        {deleting ? <Loading /> : "Are you sure you want to delete this blog?"}
                        <ErrorText error={error} />
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" onClick={deleteBlog}>Delete Permanently</Button>
                        <Button color="secondary" onClick={() => setModal(false)}>Cancel</Button>
                    </ModalFooter>
                </Modal>
                <Header
                    image={blog.picture || undefined}
                    headline={blog.headline}
                    title={blog.title}
                >
                    <p className="text-white">Posted by {(blog.author as IUser).name} on {new Date(blog.createdAt).toLocaleString()}</p>
                </Header>
                <Container className="mt-5">
                    {user._id === (blog.author as IUser)._id &&
                        <Container fluid className="p-0">
                            <Button color="info" className="mr-2" tag={Link} to={`/edit/${blog._id}`}>
                                <i className="fas fa-edit mr-2"></i>Edit
                            </Button>
                            <Button color="danger" onClick={() => setModal(true)}>
                                <i className="far fa-trash-alt mr-2"></i>Delete
                            </Button>
                            <hr />
                        </Container>
                    }
                    <ErrorText error={error} />
                    <div dangerouslySetInnerHTML={{ __html: blog.content }} />
                </Container>
            </Container>
        );
    } else {
        return <Navigate to='/' />;
    }
}

export default BlogPage;
