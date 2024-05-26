import React from 'react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import '../styles/RiderCard.css';

const RiderCard = ({ riderName, startingPoint, destination, onApprove }) => {
  return (
    <div className="rider-card">
      <h3 style={{marginBottom:40}}>{riderName}</h3>
      <div className="rider-cards">
      <div className="rider-info">
        <p>{startingPoint}</p>
        <p>{destination}</p>
      </div>
      <div className="actions">
        <center>
        <button className="approve" onClick={onApprove}>
          <CheckCircleIcon style={{ color: 'green' }} />
        </button>
        </center>
      </div>
      </div>
    </div>
  );
};

export default RiderCard;
