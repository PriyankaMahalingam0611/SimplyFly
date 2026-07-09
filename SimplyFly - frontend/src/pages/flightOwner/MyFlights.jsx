import { useEffect, useState } from 'react';
import { Container, Card, Accordion, Button, Spinner, Badge } from 'react-bootstrap';
import OwnerNavbar from '../../components/common/OwnerNavbar';
import { getMyFlightsUsingAxios, getFlightSchedulesUsingAxios, deleteScheduleUsingAxios } from '../../api/flightService';

export default function MyFlights() {
  const [flights, setFlights] = useState([]);
  const [schedulesByFlight, setSchedulesByFlight] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const list = await getMyFlightsUsingAxios();
        setFlights(list);
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

  const handleExpand = async (flightId) => {
    if (schedulesByFlight[flightId]) return; 
    try {
      const schedules = await getFlightSchedulesUsingAxios(flightId);
      setSchedulesByFlight((prev) => ({ ...prev, [flightId]: schedules }));
    } 
    catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (flightId, scheduleId) => {
    setDeletingId(scheduleId);
    setError('');
    try {
      await deleteScheduleUsingAxios(scheduleId);
      const refreshed = await getFlightSchedulesUsingAxios(flightId);
      setSchedulesByFlight((prev) => ({ ...prev, [flightId]: refreshed }));
    } 
    catch (err) {
      setError(err.message); 
    } 
    finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      <OwnerNavbar />
      <Container className="py-4">
        <h5 className="fw-semibold mb-4">My Flights</h5>

        {loading && <div className="text-center py-5"><Spinner animation="border" /></div>}
        {error && <div className="alert alert-danger">{error}</div>}

        {!loading && flights.length === 0 && (
          <p className="text-muted">You haven't added any flights yet.</p>
        )}

        <Accordion onSelect={(key) => key && handleExpand(Number(key))}>
          {flights.map((f) => (
            <Accordion.Item eventKey={String(f.flightId)} key={f.flightId}>
              <Accordion.Header>
                <span className="fw-semibold me-2">{f.flightNumber}</span>
                <span className="text-muted">{f.origin} → {f.destination}</span>
              </Accordion.Header>
              <Accordion.Body>
                {!schedulesByFlight[f.flightId] && <Spinner size="sm" animation="border" />}
                {schedulesByFlight[f.flightId]?.length === 0 && (
                  <p className="text-muted small mb-0">No schedules yet for this flight.</p>
                )}
                {schedulesByFlight[f.flightId]?.map((s) => (
                  <Card key={s.scheduleId} className="p-2 mb-2 d-flex flex-row justify-content-between align-items-center">
                    <div className="small">
                      {new Date(s.departureTime).toLocaleString()} → {new Date(s.arrivalTime).toLocaleString()}
                      {s.hasBookings && <Badge bg="warning" className="ms-2">Has Bookings</Badge>}
                    </div>
                    <Button
                      size="sm"
                      variant="outline-danger"
                      disabled={s.hasBookings || deletingId === s.scheduleId}
                      onClick={() => handleDelete(f.flightId, s.scheduleId)}
                    >
                      {deletingId === s.scheduleId ? 'Deleting...' : 'Delete'}
                    </Button>
                  </Card>
                ))}
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      </Container>
    </>
  );
}