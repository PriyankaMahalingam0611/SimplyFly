import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Form, Button } from 'react-bootstrap';
import OwnerNavbar from '../../components/common/OwnerNavbar';
import { createFlightUsingAxios } from '../../api/flightService';

const initialForm = { flightName: '', flightNumber: '', origin: '', destination: '' };

export default function AddFlight() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    try {
      const flight = await createFlightUsingAxios(formData); 
      navigate('/owner/create-schedule', { state: { flight } });
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
    { name: 'flightName', label: 'Flight Name' },
    { name: 'flightNumber', label: 'Flight Number' },
    { name: 'origin', label: 'Origin' },
    { name: 'destination', label: 'Destination' },
  ];

  return (
    <>
      <OwnerNavbar />
      <Container className="py-4" style={{ maxWidth: 560 }}>
        <h5 className="fw-semibold mb-4">Add Flight</h5>

        {errors.general && <div className="alert alert-danger">{errors.general}</div>}

        <Card className="shadow-sm border-2 p-4">
          <Form onSubmit={handleSubmit}>
            {fields.map(({ name, label }) => {
              const capitalized = name.charAt(0).toUpperCase() + name.slice(1);
              return (
                <Form.Group className="mb-3" key={name}>
                  <Form.Label>{label}</Form.Label>
                  <Form.Control
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    isInvalid={!!errors[capitalized]}
                    required
                  />
                  <Form.Control.Feedback type="invalid">{errors[capitalized]}</Form.Control.Feedback>
                </Form.Group>
              );
            })}
            <Button type="submit" variant="dark" className="w-100" disabled={loading}>
              {loading ? 'Creating...' : 'Create Flight & Continue to Schedule'}
            </Button>
          </Form>
        </Card>
      </Container>
    </>
  );
}