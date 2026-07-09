import { Container } from 'react-bootstrap';
import AdminNavbar from '../../components/common/AdminNavbar';
import UserManagementTable from '../../components/admin/UserManagementTable';
import { getFlightOwnersUsingAxios } from '../../api/adminService';

export default function FlightOwners() {
  return (
    <>
      <AdminNavbar />
      <Container className="py-4">
        <UserManagementTable title="Flight Owners" fetchUsersFn={getFlightOwnersUsingAxios} />
      </Container>
    </>
  );
}