import { useState } from 'react';
import { Container, Card, Form, Button } from 'react-bootstrap';
import Navbar from '../../components/common/Navbar';
import { useAuth } from '../../context/AuthContext';
import { updateProfileUsingAxios, deleteAccountUsingAxios } from '../../api/userService';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { user, logout, updateUserInContext } = useAuth(); 
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    contactNumber: user?.contactNumber || '',
    address: user?.address || '',
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleChange = (e) => {
    setSaved(false);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
      e.preventDefault();
      setErrors({});
      setSaving(true);
      try {
        await updateProfileUsingAxios({ ...formData, email: user.email }); 
        updateUserInContext(formData);
        setSaved(true);
      } 
      catch (err) {
        if (err.fieldErrors) setErrors(err.fieldErrors);
        else setErrors({ general: err.message });
      } 
      finally {
        setSaving(false);
      }
  };

  const handleDeleteConfirmed = async () => {
    try {
      await deleteAccountUsingAxios();
      logout();
      navigate('/');
    } 
    catch (err) {
      setErrors({ general: err.message });
      setShowDeleteConfirm(false);
    }
  };

  return (
    <>
      <Navbar />
      <Container className="py-4" style={{ maxWidth: 560 }}>
        <h5 className="fw-semibold mb-4">My Profile</h5>

        {errors.general && <div className="alert alert-danger">{errors.general}</div>}
        {saved && <div className="alert alert-success">Profile updated successfully.</div>}

        <Card className="shadow-sm border-0 p-4">
          <Form onSubmit={handleSave}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" value={user?.email || ''} disabled />
              <Form.Text className="text-muted">Email cannot be changed.</Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                name="name"
                value={formData.name}
                onChange={handleChange}
                isInvalid={!!errors.Name}
              />
              <Form.Control.Feedback type="invalid">{errors.Name}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Contact Number</Form.Label>
              <Form.Control
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                isInvalid={!!errors.ContactNumber}
              />
              <Form.Control.Feedback type="invalid">{errors.ContactNumber}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Address</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="address"
                value={formData.address}
                onChange={handleChange}
                isInvalid={!!errors.Address}
              />
              <Form.Control.Feedback type="invalid">{errors.Address}</Form.Control.Feedback>
            </Form.Group>

            <div className="d-flex justify-content-between">
              <Button variant="outline-dark" onClick={() => navigate(-1)}>
                Back
              </Button>
              <Button type="submit" variant="dark" disabled={saving}>
                {saving ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </Form>
        </Card>

        <Card className="shadow-sm border-0 p-4 mt-3">
          <h6 className="fw-semibold text-danger mb-2">Delete Account</h6>
          <p className="small text-muted mb-3">This action is permanent and cannot be undone.</p>
          {!showDeleteConfirm ? (
            <Button variant="outline-danger" size="sm" onClick={() => setShowDeleteConfirm(true)}>
              Delete Account
            </Button>
          ) : (
            <div className="d-flex gap-2 align-items-center">
              <span className="small">Are you sure you want to delete your account?</span>
              <Button variant="danger" size="sm" onClick={handleDeleteConfirmed}>
                Confirm Delete
              </Button>
              <Button variant="outline-secondary" size="sm" onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </Button>
            </div>
          )}
        </Card>
      </Container>
    </>
  );
}