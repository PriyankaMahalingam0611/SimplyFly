import { Container } from 'react-bootstrap';
import AdminNavbar from '../../components/common/AdminNavbar';
import UserManagementTable from '../../components/admin/UserManagementTable';
import { getPassengersUsingAxios } from '../../api/adminService';

export default function Passengers() {
  return (
    <>
      <AdminNavbar />
      <Container className="py-4">
        <UserManagementTable title="Passengers" fetchUsersFn={getPassengersUsingAxios} />
      </Container>
    </>
  );
}