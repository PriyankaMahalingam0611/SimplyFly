import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from '../../components/common/AdminNavbar';
import { useAuth } from '../../context/AuthContext';
import {
  getPassengersUsingAxios,
  getFlightOwnersUsingAxios,
  getAllBookingsUsingAxios,
  getAllRoutesUsingAxios,
} from '../../api/adminService';

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
        const [passengers, owners, bookings, routes] = await Promise.all([
          getPassengersUsingAxios(),
          getFlightOwnersUsingAxios(),
          getAllBookingsUsingAxios(),
          getAllRoutesUsingAxios(),
        ]);
        setStats({
          passengers: passengers.length,
          owners: owners.length,
          bookings: bookings.length,
          routes: routes.length,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  const cards = [
    { label: 'Total passengers', value: stats?.passengers, path: '/admin/passengers' },
    { label: 'Total flight owners', value: stats?.owners, path: '/admin/flight-owners' },
    { label: 'Total bookings', value: stats?.bookings, path: '/admin/bookings' },
    { label: 'Total flight routes', value: stats?.routes, path: '/admin/routes' },
  ];

  return (
    <>
      <AdminNavbar />
      <Container className="py-4">
        
        {/* Minimal Welcome Box */}
        <Card className="bg-light border-0 p-3 mb-4 shadow-sm">
          <h5 className="fw-semibold mb-1">Welcome, {user?.name}!!</h5>
          <p className="text-muted mb-0">Admin dashboard</p>
        </Card>

        {error && <div className="alert alert-danger">{error}</div>}

        {loading ? (
          <div className="text-center py-5"><Spinner animation="border" /></div>
        ) : (
          /* Wrapped Stats Box */
          <Card className="p-4 shadow-sm border">
            <Row className="g-3">
              {cards.map((c) => (
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
      </Container>
    </>
  );
}