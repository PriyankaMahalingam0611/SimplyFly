import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import OwnerNavbar from '../../components/common/OwnerNavbar';
import { useAuth } from '../../context/AuthContext';
import { getMyFlightsUsingAxios } from '../../api/flightService';
import { getMyPassengersUsingAxios } from '../../api/bookingService';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      setError('');
      try {
        const [flights, passengers] = await Promise.all([
          getMyFlightsUsingAxios(),
          getMyPassengersUsingAxios(),
        ]);
        setStats({
          flights: flights.length,
          bookings: passengers.length,
          activeBookings: passengers.filter((p) => p.bookingStatus !== 'Cancelled').length,
          pendingRefunds: passengers.filter((p) => p.refundStatus === 'Pending').length,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  const statCards = [
    { label: 'Total flights', value: stats?.flights, path: '/owner/my-flights' },
    { label: 'Total bookings', value: stats?.bookings, path: '/owner/my-passengers' },
    { label: 'Active bookings', value: stats?.activeBookings, path: '/owner/my-passengers' },
    { label: 'Pending refunds', value: stats?.pendingRefunds, path: '/owner/my-passengers' },
  ];

  const actions = [
    { title: 'Add flight', desc: 'Register a new flight route.', path: '/owner/add-flight', highlight: true },
    { title: 'Create schedule', desc: 'Set departure/arrival and cabins.', path: '/owner/create-schedule' },
    { title: 'My flights', desc: 'View and manage schedules.', path: '/owner/my-flights' },
    { title: 'My passengers', desc: 'View bookings, approve refunds.', path: '/owner/my-passengers' },
  ];

  return (
    <>
      <OwnerNavbar />
      <Container className="py-4">
        
        {/* Minimal Welcome Box */}
        <Card className="bg-light border-0 p-3 mb-4 shadow-sm">
          <h5 className="fw-semibold mb-1">Welcome, {user?.name}</h5>
          <p className="text-muted mb-0">Flight owner dashboard</p>
        </Card>

        {error && <div className="alert alert-danger">{error}</div>}

        {loading ? (
          <div className="text-center py-5"><Spinner animation="border" /></div>
        ) : (
          /* Wrapped Stats Box */
          <Card className="p-4 shadow-sm border mb-4">
            <Row className="g-3">
              {statCards.map((c) => (
                <Col md={3} sm={6} key={c.label}>
                  <Card className="stat-card p-3 h-100" role="button" onClick={() => navigate(c.path)}>
                    <div className="stat-label">{c.label}</div>
                    <div className="stat-value">{c.value}</div>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        )}

        <Row className="g-3">
          {actions.map((a) => (
            <Col md={3} sm={6} key={a.title}>
              <Card
                className={`p-3 h-100 ${a.highlight ? 'card-flat-accent' : 'card-flat'}`}
                role="button"
                onClick={() => navigate(a.path)}
              >
                <h6 className="fw-semibold">{a.title}</h6>
                <p className="small mb-0">{a.desc}</p>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
}