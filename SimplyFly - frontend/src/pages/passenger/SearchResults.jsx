import { useEffect, useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Container, Card, Row, Col, Button, Spinner, Form } from 'react-bootstrap';
import Navbar from '../../components/common/Navbar';
import { searchFlightsUsingAxios } from '../../api/flightService';

const CABIN_TYPES = ['Economy', 'Premium Economy', 'Business Class', 'First Class'];

function getLowestPrice(schedule) {
  const prices = schedule.cabinOptions.map((c) => c.price);
  return prices.length ? Math.min(...prices) : Infinity;
}

function getDurationMinutes(schedule) {
  return (new Date(schedule.arrivalTime) - new Date(schedule.departureTime)) / 60000;
}

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [airlineQuery, setAirlineQuery] = useState('');
  const [sortBy, setSortBy] = useState('price-asc');
  const [selectedCabins, setSelectedCabins] = useState([]);

  const origin = searchParams.get('Origin');
  const destination = searchParams.get('Destination');
  const dateOfJourney = searchParams.get('DateOfJourney');

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      setError('');
      try {
        const results = await searchFlightsUsingAxios({ Origin: origin, Destination: destination, DateOfJourney: dateOfJourney });
        setFlights(results);
      } 
      catch (err) {
        setError(err.message);
      } 
      finally {
        setLoading(false);
      }
    };
    if (origin && destination && dateOfJourney) fetchResults();
  }, [origin, destination, dateOfJourney]);

  const toggleCabinFilter = (cabinType) => {
    setSelectedCabins((prev) =>
      prev.includes(cabinType) ? prev.filter((c) => c !== cabinType) : [...prev, cabinType]
    );
  };

  const visibleFlights = useMemo(() => {
    let result = flights;

    if (airlineQuery.trim()) {
      const q = airlineQuery.trim().toLowerCase();
      result = result.filter(
        (s) => s.flightName.toLowerCase().includes(q) || s.flightNumber.toLowerCase().includes(q)
      );
    }

    result = result.map((schedule) => ({
      ...schedule,
      cabinOptions:
        selectedCabins.length === 0
          ? schedule.cabinOptions
          : schedule.cabinOptions.filter((c) => selectedCabins.includes(c.cabinType)),
    }));

    result = result.filter((s) => s.cabinOptions.length > 0);

    switch (sortBy) {
      case 'price-asc':
        result = [...result].sort((a, b) => getLowestPrice(a) - getLowestPrice(b));
        break;
      case 'price-desc':
        result = [...result].sort((a, b) => getLowestPrice(b) - getLowestPrice(a));
        break;
      case 'departure-asc':
        result = [...result].sort((a, b) => new Date(a.departureTime) - new Date(b.departureTime));
        break;
      case 'duration-asc':
        result = [...result].sort((a, b) => getDurationMinutes(a) - getDurationMinutes(b));
        break;
      default:
        break;
    }

    return result;
  }, [flights, airlineQuery, sortBy, selectedCabins]);

  const handleSelectCabin = (schedule, cabin) => {
    navigate(`/book/${schedule.scheduleId}/${cabin.cabinId}`, {
      state: {
        flightName: schedule.flightName,
        flightNumber: schedule.flightNumber,
        origin: schedule.origin,
        destination: schedule.destination,
        departureTime: schedule.departureTime,
        arrivalTime: schedule.arrivalTime,
        cabinType: cabin.cabinType,
        price: cabin.price,
        availableSeats: cabin.availableSeats,
        totalSeats: cabin.totalSeats,
        bookedSeatNumbers: cabin.bookedSeatNumbers,
      },
    });
  };

  return (
    <>
      <Navbar />
      <Container className="py-4">
        <h5 className="fw-semibold mb-1">
          {origin} → {destination}
        </h5>
        <p className="text-muted mb-3">
          {dateOfJourney ? new Date(dateOfJourney).toDateString() : ''}
        </p>

        {loading && (
          <div className="text-center py-5">
            <Spinner animation="border" />
          </div>
        )}

        {!loading && error && <div className="alert alert-danger">{error}</div>}

        {!loading && !error && flights.length > 0 && (
          <Row className="g-3 align-items-start">
            <Col md={3}>
              <Card className="shadow-sm border-0 p-3">
                <Form.Control
                  type="text"
                  placeholder="Search for a airline"
                  size="sm"
                  className="mb-3"
                  value={airlineQuery}
                  onChange={(e) => setAirlineQuery(e.target.value)}
                />

                <Form.Select
                  size="sm"
                  className="mb-3"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="departure-asc">Departure: Earliest First</option>
                  <option value="duration-asc">Duration: Shortest First</option>
                </Form.Select>

                <div className="fw-semibold small mb-2">Cabin Class</div>
                {CABIN_TYPES.map((type) => (
                  <Form.Check
                    key={type}
                    type="checkbox"
                    id={`cabin-${type}`}
                    label={type}
                    className="small mb-1"
                    checked={selectedCabins.includes(type)}
                    onChange={() => toggleCabinFilter(type)}
                  />
                ))}
              </Card>
            </Col>

            <Col md={9}>
              {visibleFlights.length === 0 && (
                <div className="text-center text-muted py-5">
                  No flights match your search or filters.
                </div>
              )}

              {visibleFlights.map((schedule) => (
                <Card key={schedule.scheduleId} className="mb-3 shadow-sm border-0 result-card">
                  <Card.Body>
                    <Row className="align-items-center mb-3">
                      <Col md={8}>
                        <div className="fw-semibold">{schedule.flightName} · {schedule.flightNumber}</div>
                        <div className="text-muted small">
                          {new Date(schedule.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          {'  →  '}
                          {new Date(schedule.arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          {'  ·  '}
                          {schedule.origin} to {schedule.destination}
                        </div>
                      </Col>
                    </Row>

                    <Row className="g-2">
                      {schedule.cabinOptions.map((cabin) => (
                        <Col md={3} sm={6} key={cabin.cabinId}>
                          <div className="cabin-option p-3 h-100 d-flex flex-column justify-content-between">
                            <div>
                              <div className="fw-medium small">{cabin.cabinType}</div>
                              <div className="fw-semibold fs-6">₹{cabin.price}</div>
                              <div className={`small ${cabin.availableSeats === 0 ? 'text-danger' : 'text-muted'}`}>
                                {cabin.availableSeats === 0 ? 'Sold out' : `${cabin.availableSeats} seats left`}
                              </div>
                              <div className="small text-muted mt-1">
                                Check-in: {cabin.checkInBaggage}kg · Cabin: {cabin.cabinBaggage}kg
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant="dark"
                              className="mt-2"
                              disabled={cabin.availableSeats === 0}
                              onClick={() => handleSelectCabin(schedule, cabin)}
                            >
                              Select
                            </Button>
                          </div>
                        </Col>
                      ))}
                    </Row>
                  </Card.Body>
                </Card>
              ))}
            </Col>
          </Row>
        )}

        {!loading && !error && flights.length === 0 && (
          <div className="text-center text-muted py-5">
            No flights found for this route and date. Try a different search.
          </div>
        )}
      </Container>
    </>
  );
}