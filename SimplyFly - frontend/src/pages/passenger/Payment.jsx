import { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Container, Card, Form, Button } from 'react-bootstrap';
import Navbar from '../../components/common/Navbar';
import ETicket from '../../components/passenger/ETicket';
import { processPaymentUsingAxios } from '../../api/paymentService';

export default function Payment() {
  const { state: booking } = useLocation();
  const navigate = useNavigate();
  const [cardNumber, setCardNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!booking) {
    navigate('/');
    return null;
  }

  const handlePay = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await processPaymentUsingAxios({
        bookingId: booking.bookingId,
        cardNumber,
        amount: booking.totalAmount,
      });
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <>
        <Navbar />
        <Container className="py-4" style={{ maxWidth: 480 }}>
          <ETicket booking={booking} />
          <div className="text-center mt-3 no-print">
            <Link to="/my-trips">Go to My Trips →</Link>
          </div>
        </Container>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Container className="py-4" style={{ maxWidth: 480 }}>
        <Card className="shadow-sm border-0 p-4">
          <h6 className="fw-semibold mb-3">Complete payment</h6>

          {error && <div className="alert alert-danger">{error}</div>}

          <Form onSubmit={handlePay}>
            <Form.Group className="mb-3">
              <Form.Label>Card Number</Form.Label>
              <Form.Control
                type="text"
                inputMode="numeric"
                maxLength={19}
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Amount</Form.Label>
              <Form.Control type="text" value={`₹${booking.totalAmount.toFixed(2)}`} disabled />
            </Form.Group>

            <Button type="submit" variant="dark" className="w-100" disabled={loading}>
              {loading ? 'Processing...' : 'Complete Payment'}
            </Button>
          </Form>
        </Card>
      </Container>
    </>
  );
}