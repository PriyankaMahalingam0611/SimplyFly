import { Card, Row, Col, Button, Badge } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';

export default function ETicket({ booking }) {
  const { user } = useAuth();

  const handlePrint = () => window.print();

  return (
    <>
      <Card className="shadow-sm border-0 p-4 e-ticket" id="e-ticket-print-area">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div>
            <h5 className="fw-bold mb-0">SimplyFly</h5>
            <div className="small text-muted">E-Ticket / Booking Confirmation</div>
          </div>
          <Badge bg="success" className="fs-6">Confirmed</Badge>
        </div>

        <hr />

        <Row className="mb-3">
          <Col xs={6}>
            <div className="small text-muted">Booking Reference</div>
            <div className="fw-semibold">SF-{String(booking.bookingId).padStart(6, '0')}</div>
          </Col>
          <Col xs={6} className="text-end">
            <div className="small text-muted">Passenger</div>
            <div className="fw-semibold">{user?.name}</div>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col xs={6}>
            <div className="small text-muted">Flight</div>
            <div className="fw-semibold">{booking.flightNumber}</div>
          </Col>
          <Col xs={6} className="text-end">
            <div className="small text-muted">Cabin</div>
            <div className="fw-semibold">{booking.cabinType}</div>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col xs={6}>
            <div className="small text-muted">Route</div>
            <div className="fw-semibold">{booking.origin} → {booking.destination}</div>
          </Col>
          <Col xs={6} className="text-end">
            <div className="small text-muted">Departure</div>
            <div className="fw-semibold">{new Date(booking.departureTime).toLocaleString()}</div>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col xs={6}>
            <div className="small text-muted">Seat(s)</div>
            <div className="fw-semibold">{booking.bookedSeats?.join(', ')}</div>
          </Col>
          <Col xs={6} className="text-end">
            <div className="small text-muted">Amount Paid</div>
            <div className="fw-semibold">₹{booking.totalAmount?.toFixed(2)}</div>
          </Col>
        </Row>

        <hr />
        <div className="small text-muted text-center">
          Please carry a valid photo ID matching the passenger name at check-in.
        </div>
      </Card>

        <Button variant="outline-dark" className="mt-3 no-print d-block mx-auto px-4" onClick={handlePrint}>
            Print / Download Ticket
        </Button>
    </>
  );
}