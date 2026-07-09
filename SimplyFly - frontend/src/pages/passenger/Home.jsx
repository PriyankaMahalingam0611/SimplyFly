import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import Navbar from '../../components/common/Navbar';
import goaImg from '../../assets/destinations/Goa.jpg';
import delhiImg from '../../assets/destinations/Delhi.jpg';
import mumbaiImg from '../../assets/destinations/Mumbai.jpg';
import bengaluruImg from '../../assets/destinations/Bangalore.jpg';
import heroSkyBg from '../../assets/hero-sky-bg.png';

const destinations = [
  { city: 'Goa', image: goaImg },
  { city: 'Delhi', image: delhiImg },
  { city: 'Mumbai', image: mumbaiImg },
  { city: 'Bengaluru', image: bengaluruImg },
];


const today = new Date().toISOString().split('T')[0];

export default function Home() {
  const navigate = useNavigate();
  const [searchData, setSearchData] = useState({
    origin: '',
    destination: '',
    dateOfJourney: '',
  });

  const handleChange = (e) =>
    setSearchData({ ...searchData, [e.target.name]: e.target.value });

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams({
      Origin: searchData.origin,
      Destination: searchData.destination,
      DateOfJourney: searchData.dateOfJourney,
    });
    navigate(`/search-results?${params.toString()}`);
  };

  return (
    <>
      <Navbar />

      {/* Hero + Search */}
      <div className="hero-section"  style={{ backgroundImage: `url(${heroSkyBg})` }}>
        <Container className="py-5">
          <h2 className="text-center fw-semibold mb-1">Search flights & book with ease</h2>
          <p className="text-center text-muted mb-4">Best fares, secure payments, instant confirmation.</p>

          <Card className="search-card shadow-sm p-4 mx-auto">
            <Form onSubmit={handleSearch}>
              <Row className="g-3">
                <Col md={4}>
                  <Form.Label>From</Form.Label>
                  <Form.Control
                    type="text"
                    name="origin"
                    placeholder="Origin"
                    list="city-options"
                    value={searchData.origin}
                    onChange={handleChange}
                    required
                  />
                </Col>
                <Col md={4}>
                  <Form.Label>To</Form.Label>
                  <Form.Control
                    type="text"
                    name="destination"
                    placeholder="Destination"
                    list="city-options"
                    value={searchData.destination}
                    onChange={handleChange}
                    required
                  />
                </Col>
                <Col md={4}>
                  <Form.Label>Departure date</Form.Label>
                  <Form.Control
                    type="date"
                    name="dateOfJourney"
                    min={today}
                    value={searchData.dateOfJourney}
                    onChange={handleChange}
                    required
                  />
                </Col>
              </Row>

              <Row className="justify-content-center mt-4">
                <Col md={3}>
                  <Button type="submit" variant="dark" className="w-100">
                    Search
                  </Button>
                </Col>
              </Row>
              </Form>

            <datalist id="city-options">
              <option value="Chennai" />
              <option value="Bengaluru" />
              <option value="Mumbai" />
              <option value="Delhi" />
              <option value="Hyderabad" />
              <option value="Kolkata" />
              <option value="Goa" />
            </datalist>
          </Card>
        </Container>
      </div>

      {/* Popular destinations */}
      <Container className="py-5">
        <h4 className="fw-semibold mb-4">Popular destinations</h4>
        <Row className="g-4">
          {destinations.map((d) => (
            <Col key={d.city} md={3} sm={6}>
              <Card className="dest-card border-0 shadow-sm">
                <div className="dest-thumb" style={{ backgroundImage: `url(${d.image})` }} />
                <Card.Body className="text-center py-3">
                  <Card.Text className="fw-medium mb-0">{d.city}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Why choose us */}
      <div className="bg-light py-5">
        <Container>
          <h4 className="fw-semibold mb-4 text-center">Why choose us?</h4>
          <Row className="g-4 text-center">
            {[
              { title: 'Secure Payment', desc: 'Your transactions are encrypted and protected.' },
              { title: 'Easy Cancellation', desc: 'Cancel bookings anytime, refunds handled promptly.' },
              { title: 'Best Fares', desc: 'Competitive pricing across every cabin class.' },
            ].map((item) => (
              <Col md={4} key={item.title}>
                <h6 className="fw-semibold">{item.title}</h6>
                <p className="text-muted small">{item.desc}</p>
              </Col>
            ))}
          </Row>
        </Container>
      </div>

      {/* Footer */}
      <footer className="site-footer py-4">
        <Container className="text-center small">
          <div className="mb-2">Contact Us: support@simplyfly.com</div>
          <div>© {new Date().getFullYear()} SimplyFly. All rights reserved.</div>
        </Container>
      </footer>
    </>
  );
}