import React, { useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import TopBar from './components/TopBar';
import SubmitCase from './pages/SubmitCase';
import ViewCases from './pages/ViewCases';
import MapView from './components/MapView';
import './App.css';
import './index.css';

function App() {
  const [user, setUser] = useState(null);
  const [selectedCase, setSelectedCase] = useState(null);
  const [cases, setCases] = useState([
    {
      id: 1,
      name: 'Jane Doe',
      date: '2022-04-12',
      status: 'Missing',
      latitude: 38.5,
      longitude: -80.0,
    },
    {
      id: 2,
      name: 'John Smith',
      date: '2021-09-22',
      status: 'Unsolved',
      latitude: 38.9,
      longitude: -79.5,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const login = (userData) => setUser(userData);
  const logout = () => {
    setUser(null);
    setSelectedCase(null);
  };

  const onHomeClick = () => {
    setSelectedCase(null);
    navigate('/');
  };

  return (
    <div className="app-container">
      <TopBar
        user={user}
        logout={logout}
        login={login}
        onHomeClick={onHomeClick}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      {user && (
        <div style={{ margin: '1rem' }}>
          <Link to="/">Home</Link> | <Link to="/submit">Submit Case</Link> | <Link to="/cases">View Cases</Link>
        </div>
      )}

      <Routes>
        <Route
          path="/"
          element={
            <div className="content-wrapper">
              {!user && (
                <div style={{ padding: '2rem', textAlign: 'center' }}>
                  <h2>Please log in to view and select cases.</h2>
                </div>
              )}

              {user && !selectedCase && (
                <div className="sidebar">
                  <h3>Welcome!</h3>
                  <p>Select a case from the <strong>View Cases</strong> page to see it on the map.</p>
                </div>
              )}

              {user && selectedCase && (
                <>
                  <div className="map-section">
                    <MapView cases={[selectedCase]} />
                  </div>
                  <div className="sidebar">
                    <h3>Case Details</h3>
                    <p><strong>Name:</strong> {selectedCase.name}</p>
                    <p><strong>Status:</strong> {selectedCase.status}</p>
                    <p><strong>Date:</strong> {selectedCase.date}</p>
                    <p><strong>Location:</strong> {selectedCase.latitude.toFixed(3)}, {selectedCase.longitude.toFixed(3)}</p>
                    <button onClick={() => setSelectedCase(null)}>Back to case list</button>
                  </div>
                </>
              )}
            </div>
          }
        />
        <Route path="/submit" element={<SubmitCase user={user} setCases={setCases} />} />
        <Route path="/cases" element={<ViewCases user={user} cases={cases} setSelectedCase={setSelectedCase} searchTerm={searchTerm} />} />
      </Routes>
    </div>
  );
}

export default App;
