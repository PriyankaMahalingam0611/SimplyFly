import { useEffect, useState } from 'react';
import { Container, Card, Table, Spinner, Badge } from 'react-bootstrap';
import AdminNavbar from '../../components/common/AdminNavbar';
import { getAllBookingsUsingAxios } from '../../api/adminService';

const statusVariant = { Confirmed: 'success', PendingPayment: 'warning', Cancelled: 'secondary' };

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const list = await getAllBookingsUsingAxios();
        setBookings(list);
      } 
      catch (err) {
        setError(err.message);
      } 
      finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <>
      <AdminNavbar />
      <Container className="py-4">
        <h5 className="fw-semibold mb-4">All Bookings</h5>

        {error && <div className="alert alert-danger">{error}</div>}
        {loading && <div className="text-center py-5"><Spinner animation="border" /></div>}

        {!loading && bookings.length === 0 && <p className="text-muted">No bookings on the platform yet.</p>}

        {!loading && bookings.length > 0 && (
          <Card className="shadow-sm border-0 p-3">
            <Table responsive hover bordered className="mb-0 align-middle small">
              <thead className="table-header-gradient">
                <tr>
                  <th>Booking ID</th>
                  <th>Flight</th>
                  <th>Route</th>
                  <th>Departure</th>
                  <th>Seats</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.bookingId}>
                    <td>{b.bookingId}</td>
                    <td>{b.flightNumber}</td>
                    <td>{b.origin} → {b.destination}</td>
                    <td>{new Date(b.departureTime).toLocaleString()}</td>
                    <td>{b.bookedSeats?.join(', ')}</td>
                    <td>₹{b.totalAmount?.toFixed(2)}</td>
                    <td><Badge bg={statusVariant[b.bookingStatus] || 'secondary'}>{b.bookingStatus}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>
        )}
      </Container>
    </>
  );
}