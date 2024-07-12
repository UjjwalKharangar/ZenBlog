import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import {Button, Container, Nav, Navbar, NavbarBrand, NavbarText} from 'reactstrap';
import UserContext from '../../contexts/user';

export interface INavigationProps {}

const Navigation: React.FunctionComponent<INavigationProps>= props => {
    const userContext= useContext(UserContext);
    const {user}= userContext.userState;

    const logout = () => {
        userContext.userDispatch({ type: 'logout', payload: userContext.userState });
    }

    return (
        <Navbar color="light" light sticky="top" expand="md">
            <Container>
                <NavbarBrand tag={Link} to="/">📝</NavbarBrand>
            <Nav className="mr-auto" navbar />
            {user._id ! === '' ?
                        <div>
                        <NavbarText tag={Link} to="/login">Login</NavbarText>
                        <NavbarText className="ml-2 mr-2">|</NavbarText>
                        <NavbarText tag={Link} to="/register">Signup</NavbarText>
                        </div>
                    :
                        <div>
                        <Button outline tag={Link} to="/edit">
                            Post a Blog
                        </Button>
                        <NavbarText className="ml-2 mr-2">|</NavbarText>
                        <Button outline size="sm" onClick={() => logout()}>
                            Logout
                        </Button>
                        </div>                                     
                }
            </Container>
        </Navbar>
    );
} 

export default Navigation;