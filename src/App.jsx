import React, { useState } from 'react';
import IntroScreen from './components/IntroScreen';
import DateScreen from './components/DateScreen';
import TimeScreen from './components/TimeScreen';
import PlaceScreen from './components/PlaceScreen';
import TransportScreen from './components/TransportScreen';
import ConfirmScreen from './components/ConfirmScreen';
import './App.css';

function App() {
    const [currentScreen, setCurrentScreen] = useState(0);
    const [data, setData] = useState({
        date: null,
        time: null,
        place: null,
        transport: null
    });

    const screens = [
        'screen-intro',
        'screen-date',
        'screen-time',
        'screen-place',
        'screen-transport',
        'screen-confirm'
    ];

    const nextScreen = () => {
        setCurrentScreen(prev => prev + 1);
    };

    const handleDateNext = (date) => {
        setData(prev => ({ ...prev, date }));
        nextScreen();
    };

    const handleTimeNext = (time) => {
        setData(prev => ({ ...prev, time }));
        nextScreen();
    };

    const handlePlaceNext = (place) => {
        setData(prev => ({ ...prev, place }));
        nextScreen();
    };

    const handleTransportNext = (transport) => {
        setData(prev => ({ ...prev, transport }));
        nextScreen();
    };

    return (
        <div className="app-container">
            <IntroScreen onNext={nextScreen} isActive={currentScreen === 0} />
            <DateScreen onNext={handleDateNext} isActive={currentScreen === 1} />
            <TimeScreen onNext={handleTimeNext} isActive={currentScreen === 2} variant="animated" />
            <PlaceScreen onNext={handlePlaceNext} isActive={currentScreen === 3} />
            <TransportScreen onNext={handleTransportNext} isActive={currentScreen === 4} />
            <ConfirmScreen data={data} isActive={currentScreen === 5} />
        </div>
    );
}

export default App;

