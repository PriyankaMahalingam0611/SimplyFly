import { useEffect, useState } from 'react';
import { Container, Card, Table, Spinner } from 'react-bootstrap';
import AdminNavbar from '../../components/common/AdminNavbar';
import { getAllRoutesUsingAxios } from '../../api/adminService';

export default function Routes() {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const list = await getAllRoutesUsingAxios();
        setRoutes(list);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <>
      <AdminNavbar />
      <Container className="py-4">
        <h5 className="fw-semibold mb-4">Flight Routes</h5>

        {error && <div className="alert alert-danger">{error}</div>}
        {loading && <div className="text-center py-5"><Spinner animation="border" /></div>}

        {!loading && routes.length === 0 && <p className="text-muted">No flights registered yet.</p>}

        {!loading && routes.length > 0 && (
          <Card className="shadow-sm border-0 p-3">
            <Table responsive hover bordered className="mb-0 align-middle small">
              <thead className="table-header-gradient"> 
                <tr>
                  <th>Flight Number</th>
                  <th>Flight Name</th>
                  <th>Origin</th>
                  <th>Destination</th>
                  <th>Owner ID</th>
                </tr>
              </thead>
              <tbody>
                {routes.map((f) => (
                  <tr key={f.flightId}>
                    <td>{f.flightNumber}</td>
                    <td>{f.flightName}</td>
                    <td>{f.origin}</td>
                    <td>{f.destination}</td>
                    <td>{f.ownerId}</td>
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