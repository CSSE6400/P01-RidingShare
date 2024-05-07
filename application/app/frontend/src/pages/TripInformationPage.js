import React from 'react';
import DriverInformationCard from '../components/DriverInformationCard';
import '../styles/TripInformationPage.css'
import { useParams } from 'react-router-dom';

const driver = {
    driversName: "Tom Jerry",
    carRepoNo: "AAA111",
    estimatedPickupTime: "09:30 AM"
}

const riders = [
    { id: 1, name: "Shristi Gupta", startingPoint: "201 Main Street", destination: "250 Ann Street" },
    { id: 2, name: "Mohamad Dabboussy", startingPoint: "201 Main Street", destination: "250 Ann Street" },
    { id: 3, name: "Bailey Stoodley", startingPoint: "201 Main Street", destination: "250 Ann Street" },
    { id: 4, name: "Henry Batt", startingPoint: "201 Main Street", destination: "250 Ann Street" },
    { id: 5, name: "Ferdi Sungkar", startingPoint: "201 Main Street", destination: "250 Ann Street" },
    { id: 6, name: "Khanh Vy", startingPoint: "201 Main Street", destination: "250 Ann Street" }
]

const TripInformation = () => {
    let { riderId } = useParams();

    let rider = riders.find(obj => obj.id === parseInt(riderId))

    return (
        <div>
            <h1> Trip Information </h1>
            <div class="container">
                <div>
                    <DriverInformationCard 
                        driversName={driver.name}
                        carRepoNo={driver.carRepoNo}
                        estimatedPickupTime={driver.carRepoNo}
                    />
                </div>
                <div class="riders">
                    <h3>{rider.name}</h3>
                    <p>pickup point</p>
                    <h3>{rider.startingPoint}</h3>
                    <p>destination</p>
                    <h3>{rider.destination}</h3>
                </div>
            </div>
        </div>
    )
}

export default TripInformation;