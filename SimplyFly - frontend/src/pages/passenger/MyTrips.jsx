import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Row, Col, Button, Spinner, Badge, Modal } from 'react-bootstrap';
import Navbar from '../../components/common/Navbar';
import ETicket from '../../components/passenger/ETicket';
import { getMyBookingHistoryUsingAxios, cancelBookingUsingAxios } from '../../api/bookingService';

const statusVariant = {
  Confirmed: 'success',
  Pending: 'warning',
  Cancelled: 'secondary',
};

export default function MyTrips() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancellingId, setCancellingId] = useState(null);
  const [viewingTicket, setViewingTicket] = useState(null);

  const loadBookings = async () => {
    setLoading(true);
    setError('');
    try {
      const history = await getMyBookingHistoryUsingAxios();
      setBookings(history);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handlePayNow = (booking) => {
    navigate('/payment', { state: booking });
  };

  const handleCancel = async (bookingId) => {
    setCancellingId(bookingId);
    setError('');
    try {
      await cancelBookingUsingAxios(bookingId);
      await loadBookings();
    } catch (err) {
      setError(err.message);
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <>
      <Navbar />
      <Container className="py-4">
        <h5 className="fw-semibold mb-4">My Trips</h5>

        {loading && (
          <div className="text-center py-5"><Spinner animation="border" /></div>
        )}

        {!loading && error && <div className="alert alert-danger">{error}</div>}

        {!loading && !error && bookings.length === 0 && (
          <Card className="shadow-sm border-0 p-5 text-center">
            <p className="text-muted mb-3">Looks like you have no bookings yet.</p>
            <Button variant="dark" className="mx-auto" style={{ width: 200 }} onClick={() => navigate('/')}>
              Start Exploring
            </Button>
          </Card>
        )}

        {!loading &&
          bookings.map((b) => {
            const isPending = b.transactionStatus === 'Pending' && b.bookingStatus !== 'Cancelled';
            const isCancellable = b.bookingStatus === 'Confirmed' && !isPending;
            const isConfirmed = b.bookingStatus === 'Confirmed' && !isPending;

            return (
              <Card key={b.bookingId} className="mb-3 shadow-sm border-0 p-3">
                <Row className="align-items-center">
                  <Col md={7}>
                    <div className="d-flex align-items-center gap-2 mb-1">
                      <span className="fw-semibold">{b.flightNumber}</span>
                      <Badge bg={statusVariant[b.bookingStatus] || 'secondary'}>{b.bookingStatus}</Badge>
                      {isPending && <Badge bg="danger">Payment Pending</Badge>}
                    </div>
                    <div className="small text-muted">
                      {b.origin} → {b.destination} · {new Date(b.departureTime).toLocaleString()}
                    </div>
                    <div className="small text-muted">
                      {b.cabinType} · Seats: {b.bookedSeats.join(', ')}
                    </div>
                  </Col>
                  <Col md={3} className="fw-semibold">
                    ₹{b.totalAmount.toFixed(2)}
                  </Col>
                  <Col md={2} className="text-md-end">
                    {isPending && (
                      <Button size="sm" variant="dark" onClick={() => handlePayNow(b)}>
                        Pay Now
                      </Button>
                    )}
                    {isConfirmed && (
                      <Button
                        size="sm"
                        variant="outline-dark"
                        className="me-2 mb-1"
                        onClick={() => setViewingTicket(b)}
                      >
                        View E-Ticket
                      </Button>
                    )}
                    {isCancellable && (
                      <Button
                        size="sm"
                        variant="outline-danger"
                        disabled={cancellingId === b.bookingId}
                        onClick={() => handleCancel(b.bookingId)}
                      >
                        {cancellingId === b.bookingId ? 'Cancelling...' : 'Cancel'}
                      </Button>
                    )}
                  </Col>
                </Row>
              </Card>
            );
          })}
      </Container>

      <Modal show={!!viewingTicket} onHide={() => setViewingTicket(null)} centered size="lg">
        <Modal.Header closeButton className="no-print">
          <Modal.Title className="fs-6 fw-semibold">E-Ticket</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {viewingTicket && <ETicket booking={viewingTicket} />}
        </Modal.Body>
      </Modal>
    </>
  );
}