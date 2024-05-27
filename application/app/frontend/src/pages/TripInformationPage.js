import React from 'react';
import DriverInformationCard from '../components/DriverInformationCard';
import '../styles/TripInformationPage.css'
import { useParams } from 'react-router-dom';

const driver = {
    name: "Tom Jerry",
    carRepoNo: "AAA111",
    estimatedPickupTime: "09:30 AM"
}

const TripInformation = () => {
    const { tripId } = useParams();

    return (
        <div>
            <div class="container">
                <h1> Trip Information </h1>
            </div>
            <div class="container">
                <div>
                    <DriverInformationCard 
                        driversName={driver.name}
                        carRepoNo={driver.carRepoNo}
                        estimatedPickupTime={driver.carRepoNo}
                    />
                </div>
                <div class="riders">
                    <h3>{tripId}</h3>
                    <p>pickup point</p>
                    <h3>{"pickup"}</h3>
                    <p>destination</p>
                    <h3>{"destination"}</h3>
                </div>
            </div>
        </div>
    )
}

export default TripInformation;