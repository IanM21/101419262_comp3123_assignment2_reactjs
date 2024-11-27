import { Link } from 'react-router-dom';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';

function NavigationBar({ isLoggedIn, handleLogout }) {
    return (
        <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
                <Navbar.Brand as={Link} to="/">Employee Manager</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/">Home</Nav.Link>
                        {isLoggedIn && (
                            <>
                                <Nav.Link as={Link} to="/employees">Employees</Nav.Link>
                                <Nav.Link as={Link} to="/add-employee">Add Employee</Nav.Link>
                            </>
                        )}
                    </Nav>
                    <Nav>
                        {!isLoggedIn ? (
                            <>
                                <Nav.Link as={Link} to="/login">
                                    <Button variant="outline-light">Login</Button>
                                </Nav.Link>
                                <Nav.Link as={Link} to="/signup">
                                    <Button variant="light">Sign Up</Button>
                                </Nav.Link>
                            </>
                        ) : (
                            <Button variant="outline-light" onClick={handleLogout}>
                                Logout
                            </Button>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavigationBar;