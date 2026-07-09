import { useEffect, useState } from 'react';
import { Table, Card, Button, Spinner, Modal, Form } from 'react-bootstrap';
import { updateUserUsingAxios, deleteUserUsingAxios } from '../../api/adminService';

export default function UserManagementTable({ title, fetchUsersFn }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingUser, setEditingUser] = useState(null); 
  const [formData, setFormData] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const list = await fetchUsersFn();
      setUsers(list);
    } 
    catch (err) {
      setError(err.message);
    } 
    finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openEdit = (user) => {
    setEditingUser(user);
    setFieldErrors({});
    setFormData({
      name: user.name,
      email: user.email,
      contactNumber: user.contactNumber || '',
      address: user.address || '',
    });
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFieldErrors({});
    try {
      await updateUserUsingAxios(editingUser.userId, formData);
      setEditingUser(null);
      await load();
    } 
    catch (err) {
      if (err.fieldErrors) 
        setFieldErrors(err.fieldErrors);
      else 
        setError(err.message);
    } 
    finally {
      setSaving(false);
    }
  };

  const handleDelete = async (userId) => {
    setDeletingId(userId);
    setError('');
    try {
      await deleteUserUsingAxios(userId);
      await load();
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
      <h5 className="fw-semibold mb-4">{title}</h5>

      {error && <div className="alert alert-danger">{error}</div>}
      {loading && <div className="text-center py-5"><Spinner animation="border" /></div>}

      {!loading && users.length === 0 && <p className="text-muted">No records found.</p>}

      {!loading && users.length > 0 && (
        <Card className="shadow-sm border p-3">
          {/* Added 'bordered' property here */}
          <Table responsive hover bordered className="mb-0 align-middle small">
            {/* Switched to standard Bootstrap table-dark */}
            <thead className="table-header-gradient">
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Contact</th>
                <th>Address</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.userId}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.contactNumber || '—'}</td>
                  <td>{u.address || '—'}</td>
                  <td className="text-end">
                    <Button size="sm" variant="outline-dark" className="me-2" onClick={() => openEdit(u)}>
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline-danger"
                      disabled={deletingId === u.userId}
                      onClick={() => handleDelete(u.userId)}
                    >
                      {deletingId === u.userId ? 'Deleting...' : 'Delete'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card>
      )}

      {/* ... Modal code remains unchanged ... */}
      <Modal show={!!editingUser} onHide={() => setEditingUser(null)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="fs-6 fw-semibold">Edit User</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSave}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                name="name"
                value={formData.name || ''}
                onChange={handleChange}
                isInvalid={!!fieldErrors.Name}
                required
              />
              <Form.Control.Feedback type="invalid">{fieldErrors.Name}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email || ''}
                onChange={handleChange}
                isInvalid={!!fieldErrors.Email}
                required
              />
              <Form.Control.Feedback type="invalid">{fieldErrors.Email}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Contact Number</Form.Label>
              <Form.Control
                name="contactNumber"
                value={formData.contactNumber || ''}
                onChange={handleChange}
                isInvalid={!!fieldErrors.ContactNumber}
                required
              />
              <Form.Control.Feedback type="invalid">{fieldErrors.ContactNumber}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
              <Form.Label>Address</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="address"
                value={formData.address || ''}
                onChange={handleChange}
                isInvalid={!!fieldErrors.Address}
                required
              />
              <Form.Control.Feedback type="invalid">{fieldErrors.Address}</Form.Control.Feedback>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-secondary" onClick={() => setEditingUser(null)}>Cancel</Button>
            <Button type="submit" variant="dark" disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}