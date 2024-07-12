import React, { useEffect, useReducer, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import AuthRoute from './components/AuthRoute';
import routes from './config/routes';
import { initialUserState, UserContextProvider, userReducer } from './contexts/user';
import LoadingComponent from './components/LoadingComponent';
import { Validate } from './modules/auth';
import logging from './config/logging';


export interface IApplicationProps { }

const Application: React.FunctionComponent<IApplicationProps> = props => {
    const [userState, userDispatch] = useReducer(userReducer, initialUserState);
    const [loading, setLoading] = useState<boolean>(true);

    /**Used for debugging */
    const [authStage, setAuthStage] = useState<string>('Checking localstorage ...');


    useEffect(() => {
         setTimeout(() => {
            CheckLocalStorageForCredentials();
         }, 1000);

        // eslint-disable-next-line
     }, []);

     /** Check to see if we have a token. If we do, verify it with the backend. If not, we are logged out initially */
     const CheckLocalStorageForCredentials = () => {
        setAuthStage('Checking credentials ...');

         const fire_token = localStorage.getItem('fire_token');

        if (fire_token === null) {
             userDispatch({ type: 'logout', payload: initialUserState });
             setAuthStage('No credentials found');
             setTimeout(() => {
                 setLoading(false);
             }, 500);
        } 
        else 
        {
            return Validate(fire_token, (error, user) => {
                if (error) 
                 {
                    logging.error(error);
                    setAuthStage('User not valid, logging out...');
                    userDispatch({ type: 'logout', payload: initialUserState });
                    setTimeout(() => {
                        setLoading(false);
                    }, 500);
                } 
                else if (user) 
                 {
                    setAuthStage('User authenticated...');
                    userDispatch({ type: 'login', payload: { user, fire_token } });
                    setTimeout(() => {
                        setLoading(false);
                    }, 500);
                }
            })
        }
     }

    const userContextValues = {
        userState,
        userDispatch
    };

    if (loading) 
    {
        return <LoadingComponent>{authStage}</LoadingComponent>;
    }

    return (
         <UserContextProvider value={userContextValues}>
            <Routes>
                {routes.map((route, index) => {
                    if (route.auth) 
                    {
                        return (
                            <Route
                                key={index}    
                                path={route.path}
                                element={<AuthRoute><route.component /></AuthRoute>}
                                
                            />
                        );
                    }

                    return (
                        <Route
                            key={index}    
                            path={route.path}
                            element={<route.component />}
                            
                        />
                    );
                })}
            </Routes>
    </UserContextProvider>
    );
}

export default Application;
