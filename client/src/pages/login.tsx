import React, { FunctionComponent, useContext, useState } from 'react';
import IPageProps from '../interfaces/page';
import { useNavigate } from 'react-router-dom';
import UserContext from '../contexts/user';
import firebase from 'firebase/compat/app';
import { Authenticate, SignInWithSocialMedia as SocialMediaPopup } from '../modules/auth';
import logging from '../config/logging';
import CenterPiece from '../components/CenterPiece';
import { Button, Card, CardBody, CardHeader } from 'reactstrap';
import ErrorText from '../components/ErrorText';
import LoadingComponent from '../components/LoadingComponent';
import { Providers } from '../config/firebase';

const LoginPage: FunctionComponent<IPageProps> = (props) => {
    const [authenticating, setAuthenticating] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const userContext = useContext(UserContext);
    const navigate = useNavigate();
    const isLogin = window.location.pathname.includes('login');
    
    const signInWithSocialMedia = (provider: firebase.auth.GoogleAuthProvider) => {
        if (error !== '') setError('');
        
        setAuthenticating(true);

        SocialMediaPopup(provider)
            .then(async (result) => {
                logging.info(result);

                let user = result.user;

                if (user) {
                    let uid = user.uid;
                    let name = user.displayName;

                    if (name) {
                        try 
                        {
                            let fire_token = await user.getIdToken();
                            /**if we get a token, auth with the backend */
                            Authenticate(uid, name, fire_token, (error, _user) => {
                                if (error)
                                {
                                    setError(error);
                                    setAuthenticating(false);
                                }
                                else if (_user)
                                {
                                    userContext.userDispatch({type: 'login', payload: {user : _user, fire_token}})
                                    navigate('/');
                                }
                            })
                        } 
                        catch (error) {
                            setError('Invalid token.');
                            logging.error(error);
                            setAuthenticating(false);
                        }
                    }
                } else {
                    /**if no name is returned, can have a custom form here getting the user's name, depending on the provider being used. google generally returns ones, which will be used for now. */
                    setError("The identity provider doesn't have a name.");
                    setAuthenticating(false);
                }
            })
            .catch((error) => {
                logging.error(error);
                setAuthenticating(false);
                setError(error.message);
            });
    };

    return (
        <CenterPiece>
            <Card>
                <CardHeader>
                    {isLogin ? 'Login' : 'Sign Up'}
                </CardHeader>
                <CardBody>
                <ErrorText error={error} />
                    <Button
                        block
                        disabled={authenticating}
                        onClick={() => signInWithSocialMedia(Providers.google)}
                        style={{ backgroundColor:'#ea4335', borderColor: '#ea4335'}} 
                    >
                        <i className="fab fa-google mr-2"></i> Sign {isLogin ? 'in' : 'up'} with Google
                    </Button>
                    {authenticating && <LoadingComponent card={false} />}  
                 </CardBody>
            </Card>
        </CenterPiece>
    );
};

export default LoginPage;
