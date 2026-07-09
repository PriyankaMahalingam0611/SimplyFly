import { Link, useNavigate } from 'react-router-dom';
import { Navbar as BsNavbar, Nav, Container, Button } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <BsNavbar expand="md" className="py-3 sticky-top navbar-blue">
      <Container>
        <BsNavbar.Brand as={Link} to="/" className="fw-bold fs-4 text-white">
          ✈️SimplyFly
        </BsNavbar.Brand>

        <BsNavbar.Toggle aria-controls="main-nav" className="navbar-toggler-light" />
        <BsNavbar.Collapse id="main-nav" className="justify-content-end">
          <Nav className="align-items-md-center gap-2">
            {!user ? (
              <>
                <Button
                  variant="link"
                  size="sm"
                  className="text-white text-decoration-none"
                  onClick={() => navigate('/register-flightowner')}
                >
                  Register as flight owner
                </Button>
                <Button variant="outline-light" size="sm" onClick={() => navigate('/login')}>
                  Log in
                </Button>
                <Button variant="light" size="sm" className="fw-medium" onClick={() => navigate('/register')}>
                  Sign up
                </Button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/my-trips" className="text-white">My trips</Nav.Link>
                <Nav.Link as={Link} to="/profile" className="text-white">My profile</Nav.Link>
                <Button variant="outline-light" size="sm" onClick={handleLogout}>
                  Log out
                </Button>
              </>
            )}
          </Nav>
        </BsNavbar.Collapse>
      </Container>
    </BsNavbar>
  );
}