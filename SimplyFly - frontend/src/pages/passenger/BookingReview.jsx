import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Card, Row, Col, Button } from 'react-bootstrap';
import Navbar from '../../components/common/Navbar';
import { useAuth } from '../../context/AuthContext';
import { createBookingUsingAxios } from '../../api/bookingService';

export default function BookingReview() {
  const { state: draft } = useLocation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!draft) {
    navigate('/');
    return null;
  }

  const handleConfirm = async () => {
    setLoading(true);
    setError('');
    try {
      const booking = await createBookingUsingAxios({
        scheduleId: draft.scheduleId,
        cabinId: draft.cabinId,
        seatNumbers: draft.seatNumbers,
      });
      navigate('/payment', { state: booking });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <Container className="py-4" style={{ maxWidth: 700 }}>
        <h5 className="fw-semibold mb-4">Review your booking</h5>

        {error && <div className="alert alert-danger">{error}</div>}

        <Card className="shadow-sm border-0 p-4 mb-3">
          <h6 className="fw-semibold mb-3">Flight details</h6>
          <Row className="small mb-1"><Col xs={5} className="text-muted">Flight</Col><Col>{draft.flightName} · {draft.flightNumber}</Col></Row>
          <Row className="small mb-1"><Col xs={5} className="text-muted">Route</Col><Col>{draft.origin} → {draft.destination}</Col></Row>
          <Row className="small mb-1"><Col xs={5} className="text-muted">Departure</Col><Col>{new Date(draft.departureTime).toLocaleString()}</Col></Row>
          <Row className="small mb-1"><Col xs={5} className="text-muted">Cabin</Col><Col>{draft.cabinType}</Col></Row>
          <Row className="small"><Col xs={5} className="text-muted">Seats</Col><Col>{draft.seatNumbers.join(', ')}</Col></Row>
        </Card>

        <Card className="shadow-sm border-0 p-4 mb-3">
          <h6 className="fw-semibold mb-3">Traveller details</h6>
          <Row className="small mb-1"><Col xs={5} className="text-muted">Name</Col><Col>{user?.name}</Col></Row>
          <Row className="small"><Col xs={5} className="text-muted">Email</Col><Col>{user?.email}</Col></Row>
          <div className="small mt-2">
            Details incorrect? <a href="/profile">Update your profile</a> before confirming.
          </div>
        </Card>

        <Card className="shadow-sm border-0 p-4 mb-4">
          <div className="d-flex justify-content-between fw-semibold fs-5">
            <span>Total amount</span>
            <span>₹{(draft.price * draft.seatNumbers.length).toFixed(2)}</span>
          </div>
        </Card>

        <Button variant="dark" className="w-100" disabled={loading} onClick={handleConfirm}>
          {loading ? 'Confirming...' : 'Confirm Booking'}
        </Button>
      </Container>
    </>
  );
}