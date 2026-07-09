import { Link, useNavigate } from 'react-router-dom';
import { Navbar as BsNavbar, Nav, Container, Button } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';

export default function AdminNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <BsNavbar expand="md" className="py-3 sticky-top navbar-blue">
      <Container>
        <BsNavbar.Brand as={Link} to="/admin/dashboard" className="fw-bold fs-4 text-white">
          SimplyFly <span className="fs-6 fw-normal text-white-50">admin</span>
        </BsNavbar.Brand>
        <BsNavbar.Toggle aria-controls="admin-nav" className="navbar-toggler-light" />
        <BsNavbar.Collapse id="admin-nav" className="justify-content-end">
          <Nav className="align-items-md-center gap-3">
            <Nav.Link as={Link} to="/admin/passengers" className="text-white">Passengers</Nav.Link>
            <Nav.Link as={Link} to="/admin/flight-owners" className="text-white">Flight owners</Nav.Link>
            <Nav.Link as={Link} to="/admin/bookings" className="text-white">Bookings</Nav.Link>
            <Nav.Link as={Link} to="/admin/routes" className="text-white">Routes</Nav.Link>
            <span className="text-white-50 small">{user?.name}</span>
            <Button variant="outline-light" size="sm" onClick={handleLogout}>
              Log out
            </Button>
          </Nav>
        </BsNavbar.Collapse>
      </Container>
    </BsNavbar>
  );
}