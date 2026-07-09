import { useEffect, useState } from 'react';
import { Container, Card, Table, Button, Spinner, Badge } from 'react-bootstrap';
import OwnerNavbar from '../../components/common/OwnerNavbar';
import { getMyPassengersUsingAxios, approveRefundUsingAxios } from '../../api/bookingService';

export default function MyPassengers() {
  const [passengers, setPassengers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [approvingId, setApprovingId] = useState(null);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const list = await getMyPassengersUsingAxios();
      setPassengers(list);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleApprove = async (bookingId) => {
    setApprovingId(bookingId);
    try {
      await approveRefundUsingAxios(bookingId);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setApprovingId(null);
    }
  };

  return (
    <>
      <OwnerNavbar />
      <Container className="py-4">
        <h5 className="fw-semibold mb-4">My Passengers</h5>

        {loading && <div className="text-center py-5"><Spinner animation="border" /></div>}
        {error && <div className="alert alert-danger">{error}</div>}

        {!loading && passengers.length === 0 && (
          <p className="text-muted">No bookings on your flights yet.</p>
        )}

        {!loading && passengers.length > 0 && (
          <Card className="shadow-sm border p-3">
            <Table responsive hover bordered className="mb-0 align-middle">
              <thead className="table-header-gradient">
                <tr>
                  <th>Passenger</th>
                  <th>Flight</th>
                  <th>Seats</th>
                  <th>Booking Status</th>
                  <th>Refund Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody className="small">
                {passengers.map((p) => (
                  <tr key={p.bookingId}>
                    <td>{p.passengerName}<div className="text-muted">{p.passengerEmail}</div></td>
                    <td>{p.flightNumber}</td>
                    <td>{p.bookedSeats?.join(', ')}</td>
                    <td><Badge bg={p.bookingStatus === 'Cancelled' ? 'secondary' : 'success'}>{p.bookingStatus}</Badge></td>
                    <td>
                      {p.refundStatus === 'Pending' ? (
                        <Badge bg="warning">Pending</Badge>
                      ) : (
                        <span className="text-muted">{p.refundStatus || '—'}</span>
                      )}
                    </td>
                    <td>
                      {p.refundStatus === 'Pending' && (
                        <Button
                          size="sm"
                          variant="dark"
                          disabled={approvingId === p.bookingId}
                          onClick={() => handleApprove(p.bookingId)}
                        >
                          {approvingId === p.bookingId ? 'Approving...' : 'Approve Refund'}
                        </Button>
                      )}
                    </td>
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