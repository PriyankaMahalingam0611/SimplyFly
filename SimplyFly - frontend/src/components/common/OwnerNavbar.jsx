import { Link, useNavigate } from 'react-router-dom';
import { Navbar as BsNavbar, Nav, Container, Button } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';

export default function OwnerNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <BsNavbar expand="md" className="py-3 sticky-top navbar-blue">
      <Container>
        <BsNavbar.Brand as={Link} to="/owner/dashboard" className="fw-bold fs-4 text-white">
          SimplyFly <span className="fs-6 fw-normal text-white-50">owner</span>
        </BsNavbar.Brand>
        <BsNavbar.Toggle aria-controls="owner-nav" className="navbar-toggler-light" />
        <BsNavbar.Collapse id="owner-nav" className="justify-content-end">
          <Nav className="align-items-md-center gap-3">
            <Nav.Link as={Link} to="/owner/add-flight" className="text-white">Add flight</Nav.Link>
            <Nav.Link as={Link} to="/owner/create-schedule" className="text-white">Create schedule</Nav.Link>
            <Nav.Link as={Link} to="/owner/my-flights" className="text-white">My flights</Nav.Link>
            <Nav.Link as={Link} to="/owner/my-passengers" className="text-white">My passengers</Nav.Link>
            <Button variant="outline-light" size="sm" onClick={handleLogout}>
              Log out
            </Button>
          </Nav>
        </BsNavbar.Collapse>
      </Container>
    </BsNavbar>
  );
}