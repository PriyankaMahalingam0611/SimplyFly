import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Button, Card } from 'react-bootstrap';
import { registerStaffUsingAxios } from '../../api/authService';
import PasswordStrengthMeter from '../../components/common/PasswordStrengthMeter';

const initialForm = { name: '', email: '', contactNumber: '', address: '', password: '', confirmPassword: '' };

export default function RegisterFlightOwner() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (formData.password !== formData.confirmPassword) {
      setErrors({ confirmPassword: 'Passwords do not match.' });
      return;
    }

    setLoading(true);
    try {
      const { confirmPassword, ...payload } = formData;
      await registerStaffUsingAxios({ ...payload, roleId: 2 });
      navigate('/login');
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

  const fields = [
    { name: 'name', label: 'Full Name', type: 'text' },
    { name: 'email', label: 'Email', type: 'email' },
    { name: 'contactNumber', label: 'Contact Number', type: 'text' },
    { name: 'address', label: 'Address', type: 'text' },
    { name: 'password', label: 'Password', type: 'password' },
    { name: 'confirmPassword', label: 'Confirm Password', type: 'password' },
  ];

  return (
    <div className="auth-bg d-flex justify-content-center align-items-center py-5">
      <Card className="auth-card shadow-sm p-4">
        <Link to="/" className="text-decoration-none text-dark">
          <h4 className="text-center fw-semibold mb-1">SimplyFly</h4>
        </Link>
        <p className="text-center text-muted mb-4">Register as Flight Owner</p>

        {errors.general && <div className="alert alert-danger py-2">{errors.general}</div>}

        <Form onSubmit={handleSubmit}>
          {fields.map(({ name, label, type }) => {
            const capitalized = name.charAt(0).toUpperCase() + name.slice(1);
            const errorMessage = name === 'confirmPassword' ? errors.confirmPassword : errors[capitalized];
            return (
              <Form.Group className="mb-3" key={name}>
                <Form.Label>{label}</Form.Label>
                <Form.Control
                  type={type}
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  isInvalid={!!errorMessage}
                  required
                />
                <Form.Control.Feedback type="invalid">{errorMessage}</Form.Control.Feedback>
                {name === 'password' && <PasswordStrengthMeter password={formData.password} />}
              </Form.Group>
            );
          })}

          <Button type="submit" variant="dark" className="w-100 mt-2" disabled={loading}>
            {loading ? 'Creating account...' : 'Register as Flight Owner'}
          </Button>
        </Form>

        <p className="text-center text-muted mt-3 mb-0">
          Already have an account? <Link to="/login">Log In</Link>
        </p>
      </Card>
    </div>
  );
}