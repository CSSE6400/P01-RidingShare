import React from 'react';
import './RiderCard.css';
import DoneRoundedIcon from '@mui/icons-material/DoneRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

const RiderCard = ({ riderName, startingPoint, destination }) => {
  return (
    <div className="rider-card">
      <div className="rider-info">
        <h3>{riderName}</h3>
        <p>{startingPoint}</p>
        <p>{destination}</p>
      </div>
      <div className="actions">
        <button className="decline">
          <CloseRoundedIcon style={{ color: 'red' }} />
        </button>
        <button className="approve">
          <DoneRoundedIcon style={{ color: 'green' }} />
        </button>
      </div>
    </div>
  );
};

export default RiderCard;
