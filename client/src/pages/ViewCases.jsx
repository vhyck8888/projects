import React from 'react';
import { useNavigate } from 'react-router-dom';

const ViewCases = ({ user, cases, setSelectedCase, searchTerm }) => {
  const navigate = useNavigate();

  if (!user) {
    return <p>Please log in to view cases.</p>;
  }

  const filtered = cases.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (c) => {
    setSelectedCase(c);
    navigate('/');
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Cases List</h2>
      {filtered.length === 0 ? (
        <p>No cases match your search.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {filtered.map((c) => (
            <li
              key={c.id}
              style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px', cursor: 'pointer' }}
              onClick={() => handleSelect(c)}
            >
              <strong>Name:</strong> {c.name}<br />
              <strong>Status:</strong> {c.status}<br />
              <strong>Date:</strong> {c.date}<br />
              <strong>Location:</strong> {c.latitude.toFixed(3)}, {c.longitude.toFixed(3)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ViewCases;
