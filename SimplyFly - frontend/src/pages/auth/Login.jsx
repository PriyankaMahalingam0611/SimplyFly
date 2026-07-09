import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Button, Card } from 'react-bootstrap';
import { loginUsingAxios } from '../../api/authService';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { loginUser } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    try {
      const authData = await loginUsingAxios(formData); 
      loginUser(authData);

      const pendingBooking = sessionStorage.getItem('sf_pending_booking');
      if (pendingBooking && authData.roles.includes('Passenger')) {
        sessionStorage.removeItem('sf_pending_booking');
        navigate('/booking-review', { state: JSON.parse(pendingBooking) });
        return;
      }

      if (authData.roles.includes('Admin')) 
        navigate('/admin/dashboard');
      else if (authData.roles.includes('FlightOwner')) 
        navigate('/owner/dashboard');
      else 
        navigate('/dashboard');
    } 
    catch (err) {
      if (err.fieldErrors) 
        setErrors(err.fieldErrors);
      else 
        setErrors({ general: err.message });
    } 
    finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-bg d-flex justify-content-center align-items-center vh-100">
      <Card className="auth-card shadow-sm p-4">
        <Link to="/" className="text-decoration-none text-dark">
          <h4 className="text-center fw-semibold mb-1">SimplyFly</h4>
        </Link>
        <p className="text-center text-muted mb-4">Login</p>

        {errors.general && <div className="alert alert-danger py-2">{errors.general}</div>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              isInvalid={!!errors.Email}
              //required
            />
            <Form.Control.Feedback type="invalid">{errors.Email}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              isInvalid={!!errors.Password}
              //required
            />
            <Form.Control.Feedback type="invalid">{errors.Password}</Form.Control.Feedback>
          </Form.Group>

          <Button type="submit" variant="dark" className="w-100" disabled={loading}>
            {loading ? 'Logging in...' : 'Log In'}
          </Button>
        </Form>

        <p className="text-center text-muted mt-3 mb-0">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </Card>
    </div>
  );
}