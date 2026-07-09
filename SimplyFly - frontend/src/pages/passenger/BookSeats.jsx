import { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Container, Card, Row, Col, Button } from 'react-bootstrap';
import Navbar from '../../components/common/Navbar';
import SeatMap from '../../components/passenger/SeatMap';
import { useAuth } from '../../context/AuthContext';

export default function BookSeats() {
  const { scheduleId, cabinId } = useParams();
  const { state: flight } = useLocation(); 
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedSeats, setSelectedSeats] = useState([]);

  if (!flight) {
    navigate('/');
    return null;
  }

  const handleContinue = () => {
    const bookingDraft = {
      scheduleId: Number(scheduleId),
      cabinId: Number(cabinId),
      seatNumbers: selectedSeats,
      cabinType: flight.cabinType,
      price: flight.price,
      flightName: flight.flightName,
      flightNumber: flight.flightNumber,
      origin: flight.origin,
      destination: flight.destination,
      departureTime: flight.departureTime,
    };

    if (!user) {
      sessionStorage.setItem('sf_pending_booking', JSON.stringify(bookingDraft));
      navigate('/login', { state: { returnTo: '/booking-review' } });
      return;
    }

    navigate('/booking-review', { state: bookingDraft });
  };

  return (
    <>
      <Navbar />
      <Container className="py-4">
        <Row className="g-4">
          <Col md={8}>
            <Card className="shadow-sm border-0 p-4">
              <h6 className="fw-semibold mb-3">Choose your seats — {flight.cabinType}</h6>
              <SeatMap
                cabinType={flight.cabinType}
                totalSeats={flight.totalSeats}
                bookedSeatNumbers={flight.bookedSeatNumbers}
                maxSelectable={9}
                selectedSeats={selectedSeats}
                onToggleSeat={setSelectedSeats}
              />
            </Card>
          </Col>

          <Col md={4}>
            <Card className="shadow-sm border-0 p-4">
              <h6 className="fw-semibold mb-3">Flight summary</h6>
              <div className="small text-muted mb-1">{flight.flightName} · {flight.flightNumber}</div>
              <div className="small mb-1">{flight.origin} → {flight.destination}</div>
              <div className="small mb-3">
                {new Date(flight.departureTime).toLocaleString()}
              </div>
              <hr />
              <div className="d-flex justify-content-between small mb-1">
                <span>Cabin</span><span>{flight.cabinType}</span>
              </div>
              <div className="d-flex justify-content-between small mb-1">
                <span>Seats selected</span><span>{selectedSeats.join(', ') || '—'}</span>
              </div>
              <div className="d-flex justify-content-between fw-semibold mb-3">
                <span>Total</span><span>₹{(flight.price * selectedSeats.length).toFixed(2)}</span>
              </div>
              <Button
                variant="dark"
                disabled={selectedSeats.length === 0}
                onClick={handleContinue}
              >
                Continue Booking
              </Button>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}