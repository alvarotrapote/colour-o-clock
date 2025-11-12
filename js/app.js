"use strict";

const { useEffect, useState } = React;

function getColour(time) {
    const now = moment(time, 'HH:mm:ss');
    const startOfYear = moment().startOf('year');
    const numberOfColours = 16777216; // 256 * 256 * 256

    const secondsSinceYearStart = now.diff(startOfYear, 'seconds');
    if (secondsSinceYearStart < numberOfColours) {
        return ('000000' + Math.floor(secondsSinceYearStart).toString(16).toUpperCase()).slice(-6);
    }

    return ('000000' + Math.floor(secondsSinceYearStart - numberOfColours).toString(16).toUpperCase()).slice(-6);
}

function getTextColor(bgColor) {
    const nThreshold = 105;
    const components = getRGBComponents(bgColor);
    const bgDelta = (components.R * 0.299) + (components.G * 0.587) + (components.B * 0.114);
    return ((255 - bgDelta) < nThreshold) ? "#000000" : "#ffffff";
}

function getRGBComponents(color) {
    if (color.charAt(0) === '#') {
        color = color.slice(1);
    }

    const r = color.substring(0, 2);
    const g = color.substring(2, 4);
    const b = color.substring(4, 6);
    return {
        R: parseInt(r, 16),
        G: parseInt(g, 16),
        B: parseInt(b, 16)
    };
}

function calculateClockState(showTime) {
    const now = moment();
    const time = now.format('HH:mm:ss');
    const date = now.format('dddd, DD MMMM YYYY');
    const colour = "#" + getColour(time);
    const foreground = getTextColor(colour);

    return {
        date,
        displayValue: showTime ? time : colour,
        background: colour,
        foreground,
        rawTime: time
    };
}

function ClockApp() {
    const [showTime, setShowTime] = useState(true);
    const [clockState, setClockState] = useState(() => calculateClockState(true));

    useEffect(() => {
        function tick() {
            setClockState(calculateClockState(showTime));
        }

        tick();
        const intervalId = setInterval(tick, 1000);
        return () => clearInterval(intervalId);
    }, [showTime]);

    function handleChangeView() {
        const nextShowTime = !showTime;
        setShowTime(nextShowTime);
        setClockState(calculateClockState(nextShowTime));
    }

    return (
        React.createElement(
            'div',
            {
                className: 'clock-container',
                onClick: handleChangeView,
                style: { backgroundColor: clockState.background }
            },
            React.createElement(
                'div',
                { className: 'clock', style: { color: clockState.foreground } },
                React.createElement('div', { className: 'date' }, clockState.date),
                React.createElement('div', { className: 'time' }, clockState.displayValue)
            )
        )
    );
}

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);
root.render(React.createElement(ClockApp));
