import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import PostJob from './pages/PostJob';
import JobList from './pages/JobList';
import AppliedJobs from './pages/AppliedJobs';
import JobApplicants from './pages/JobApplicants';
import Homepage from './pages/Homepage';
import Aboutp from './pages/Aboutp';
import Contact from './pages/Contact';
import PostedJobsPage from './pages/PostedJobsPage';
import ViewApplicantsPage from './pages/ViewApplicantsPage';

function App() {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<Aboutp />} />
        <Route path="/contact" element={<Contact />} />

        {/* Protected Dashboard Route */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/view-jobs" element={<JobList />} />
          <Route path="/post-job" element={<PostJob />} />
          <Route path="/my-posted-jobs" element={<PostedJobsPage />} />
          
          <Route path="/applied-jobs" element={<AppliedJobs />} />
          {/* <Route path="/job/:jobId/applicants" element={<JobApplicants />} /> */}
          <Route path="/jobs/:jobId/applicants" element={<ViewApplicantsPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
