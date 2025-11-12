"use strict";

const { useEffect, useRef, useState } = React;

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

function getPreferredLocale() {
    if (Array.isArray(navigator.languages) && navigator.languages.length > 0) {
        return navigator.languages[0];
    }

    return navigator.language || 'en-US';
}

function formatDateForLocale(date) {
    const locale = getPreferredLocale();
    const formatter = new Intl.DateTimeFormat(locale, {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });

    return formatter.format(date);
}

function calculateClockState(showTime) {
    const now = moment();
    const time = now.format('HH:mm:ss');
    const date = formatDateForLocale(now.toDate());
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
    const touchStartYRef = useRef(null);

    useEffect(() => {
        function tick() {
            setClockState(calculateClockState(showTime));
        }

        tick();
        const intervalId = setInterval(tick, 1000);
        return () => clearInterval(intervalId);
    }, [showTime]);

    function updateView(nextShowTime) {
        setShowTime(nextShowTime);
        setClockState(calculateClockState(nextShowTime));
    }

    function handleContainerTap() {
        updateView(!showTime);
    }

    function handleSelectView(nextShowTime, event) {
        if (event) {
            event.stopPropagation();
        }

        if (nextShowTime !== showTime) {
            updateView(nextShowTime);
        }
    }

    function handleTouchStart(event) {
        if (event.touches && event.touches.length === 1) {
            touchStartYRef.current = event.touches[0].clientY;
        }
    }

    function handleTouchEnd(event) {
        if (touchStartYRef.current === null || !event.changedTouches || event.changedTouches.length === 0) {
            touchStartYRef.current = null;
            return;
        }

        const touchEndY = event.changedTouches[0].clientY;
        const deltaY = touchEndY - touchStartYRef.current;
        const swipeThreshold = 40;

        if (Math.abs(deltaY) >= swipeThreshold) {
            if (deltaY < 0 && showTime) {
                updateView(false);
            } else if (deltaY > 0 && !showTime) {
                updateView(true);
            }
        }

        touchStartYRef.current = null;
    }

    function renderToggleButton(label, shortLabel, isActive, onClick) {
        const className = 'toggle-button' + (isActive ? ' active' : '');
        return React.createElement(
            'button',
            {
                type: 'button',
                className,
                onClick,
                'aria-pressed': isActive,
                'aria-label': label,
                'data-short-label': shortLabel
            },
            React.createElement('span', { className: 'toggle-button-label' }, label)
        );
    }

    return (
        React.createElement(
            'div',
            {
                className: 'clock-container',
                onClick: handleContainerTap,
                onTouchStart: handleTouchStart,
                onTouchEnd: handleTouchEnd,
                style: {
                    backgroundColor: clockState.background,
                    '--toggle-color': clockState.foreground
                }
            },
            React.createElement(
                'div',
                { className: 'view-toggle', role: 'group', 'aria-label': 'Display mode' },
                renderToggleButton('Time', 'T', showTime, (event) => handleSelectView(true, event)),
                renderToggleButton('Hex', '#', !showTime, (event) => handleSelectView(false, event))
            ),
            React.createElement(
                'div',
                { className: 'clock', style: { color: clockState.foreground } },
                React.createElement('div', { className: 'time' }, clockState.displayValue),
                React.createElement('div', { className: 'date' }, clockState.date)
            )
        )
    );
}

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);
root.render(React.createElement(ClockApp));
