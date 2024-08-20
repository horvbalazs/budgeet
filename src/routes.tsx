import { Route, Navigate } from 'react-router-dom';
import Login from './Pages/Login';
import ProtectedRoute from './Components/ProtectedRoute';
import Dashboard from './Pages/Dashboard';
import Upload from './Pages/Upload';
import ManageTypes from './Pages/ManageTypes';
import ManageRecords from './Pages/ManageRecords';

const routes = [
  <Route
    key="dashboard"
    path="/dashboard"
    element={
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    }
  />,
  <Route
    key="upload"
    path="/upload"
    element={
      <ProtectedRoute>
        <Upload />
      </ProtectedRoute>
    }
  />,
  <Route
    key="records"
    path="/records"
    element={
      <ProtectedRoute>
        <ManageRecords />
      </ProtectedRoute>
    }
  />,
  <Route
    key="types"
    path="/types"
    element={
      <ProtectedRoute>
        <ManageTypes />
      </ProtectedRoute>
    }
  />,
  <Route key="login" path="/login" element={<Login />} />,
  <Route key="*" path="*" element={<Navigate to={'/dashboard'} />} />,
];

export default routes;
