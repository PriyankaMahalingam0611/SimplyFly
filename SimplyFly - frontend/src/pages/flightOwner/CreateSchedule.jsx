import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Card, Form, Button, Row, Col } from 'react-bootstrap';
import OwnerNavbar from '../../components/common/OwnerNavbar';
import { getMyFlightsUsingAxios, createScheduleUsingAxios } from '../../api/flightService';

const CABIN_TYPES = ['Economy', 'Premium Economy', 'Business Class', 'First Class'];
const emptyCabin = () => ({ cabinType: 'Economy', price: '', totalSeats: '', checkInBaggage: '', cabinBaggage: '' });

export default function CreateSchedule() {
  const { state } = useLocation(); 
  const navigate = useNavigate();

  const [flights, setFlights] = useState([]);
  const [flightId, setFlightId] = useState(state?.flight?.flightId || '');
  const [departureTime, setDepartureTime] = useState('');
  const [arrivalTime, setArrivalTime] = useState('');
  const [cabins, setCabins] = useState([emptyCabin()]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loadingFlights, setLoadingFlights] = useState(true);

  useEffect(() => {
    const loadFlights = async () => {
      try {
        const list = await getMyFlightsUsingAxios();
        setFlights(list);
      } 
      catch (err) {
        setErrors({ general: err.message });
      } 
      finally {
        setLoadingFlights(false);
      }
    };
    loadFlights();
  }, []);

  const handleCabinChange = (index, field, value) => {
    const updated = [...cabins];
    updated[index] = { ...updated[index], [field]: value };
    setCabins(updated);
  };

  const addCabinRow = () => setCabins([...cabins, emptyCabin()]);
  const removeCabinRow = (index) => setCabins(cabins.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccess(false);
    setLoading(true);
    try {
      await createScheduleUsingAxios({
        flightId: Number(flightId),
        departureTime,
        arrivalTime,
        cabins: cabins.map((c) => ({
          cabinType: c.cabinType,
          price: Number(c.price),
          totalSeats: Number(c.totalSeats),
          checkInBaggage: Number(c.checkInBaggage),
          cabinBaggage: Number(c.cabinBaggage),
        })),
      });
      setSuccess(true);
      setCabins([emptyCabin()]);
      setDepartureTime('');
      setArrivalTime('');
    } 
    catch (err) {
      if (err.fieldErrors) 
        setErrors(err.fieldErrors);
      else 
        setErrors({ general: err.message });
    } 
    finally {
      setLoading(false);
    }
  };

  return (
    <>
      <OwnerNavbar />
      <Container className="py-4" style={{ maxWidth: 720 }}>
        <h5 className="fw-semibold mb-4">Create Schedule</h5>

        {errors.general && <div className="alert alert-danger">{errors.general}</div>}
        {success && <div className="alert alert-success">Schedule created successfully.</div>}

        <Card className="shadow-sm border-2 p-4 mb-3">
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Flight</Form.Label>
              <Form.Select
                value={flightId}
                onChange={(e) => setFlightId(e.target.value)}
                disabled={loadingFlights}
                required
              >
                <option value="">{loadingFlights ? 'Loading flights...' : 'Select a flight'}</option>
                {flights.map((f) => (
                  <option key={f.flightId} value={f.flightId}>
                    {f.flightNumber} — {f.origin} to {f.destination}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Row className="g-3 mb-3">
              <Col md={6}>
                <Form.Label>Departure Time</Form.Label>
                <Form.Control
                  type="datetime-local"
                  value={departureTime}
                  onChange={(e) => setDepartureTime(e.target.value)}
                  isInvalid={!!errors.DepartureTime}
                  required
                />
                <Form.Control.Feedback type="invalid">{errors.DepartureTime}</Form.Control.Feedback>
              </Col>
              <Col md={6}>
                <Form.Label>Arrival Time</Form.Label>
                <Form.Control
                  type="datetime-local"
                  value={arrivalTime}
                  onChange={(e) => setArrivalTime(e.target.value)}
                  isInvalid={!!errors.ArrivalTime}
                  required
                />
                <Form.Control.Feedback type="invalid">{errors.ArrivalTime}</Form.Control.Feedback>
              </Col>
            </Row>

            <h6 className="fw-semibold mt-4 mb-2">Cabins</h6>
            {cabins.map((cabin, index) => (
              <Card key={index} className="p-3 mb-2 bg-light border-0">
                <Row className="g-2 align-items-end">
                  <Col md={3}>
                    <Form.Label className="small">Cabin Type</Form.Label>
                    <Form.Select
                      value={cabin.cabinType}
                      onChange={(e) => handleCabinChange(index, 'cabinType', e.target.value)}
                    >
                      {CABIN_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                    </Form.Select>
                  </Col>
                  <Col md={2}>
                    <Form.Label className="small">Price (₹)</Form.Label>
                    <Form.Control
                      type="number" min="0.01" step="0.01"
                      value={cabin.price}
                      onChange={(e) => handleCabinChange(index, 'price', e.target.value)}
                      required
                    />
                  </Col>
                  <Col md={2}>
                    <Form.Label className="small">Total Seats</Form.Label>
                    <Form.Control
                      type="number" min="0"
                      value={cabin.totalSeats}
                      onChange={(e) => handleCabinChange(index, 'totalSeats', e.target.value)}
                      required
                    />
                  </Col>
                  <Col md={2}>
                    <Form.Label className="small">Check-in Bag (kg)</Form.Label>
                    <Form.Control
                      type="number" min="0"
                      value={cabin.checkInBaggage}
                      onChange={(e) => handleCabinChange(index, 'checkInBaggage', e.target.value)}
                      required
                    />
                  </Col>
                  <Col md={2}>
                    <Form.Label className="small">Cabin Bag (kg)</Form.Label>
                    <Form.Control
                      type="number" min="0"
                      value={cabin.cabinBaggage}
                      onChange={(e) => handleCabinChange(index, 'cabinBaggage', e.target.value)}
                      required
                    />
                  </Col>
                  <Col md={1}>
                    {cabins.length > 1 && (
                      <Button variant="outline-danger" size="sm" onClick={() => removeCabinRow(index)}>
                        ✕
                      </Button>
                    )}
                  </Col>
                </Row>
              </Card>
            ))}

            <Button variant="outline-dark" size="sm" onClick={addCabinRow} className="mb-4">
              + Add Cabin
            </Button>

            <Button type="submit" variant="dark" className="w-100" disabled={loading}>
              {loading ? 'Creating...' : 'Complete Schedule'}
            </Button>
          </Form>
        </Card>
      </Container>
    </>
  );
}