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

function getIsMobileViewport() {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
        return false;
    }

    return window.matchMedia('(max-width: 800px)').matches;
}

function calculateClockState() {
    const now = moment();
    const time = now.format('HH:mm:ss');
    const date = formatDateForLocale(now.toDate());
    const colour = "#" + getColour(time);
    const foreground = getTextColor(colour);

    return {
        date,
        timeValue: time,
        hexValue: colour,
        background: colour,
        foreground
    };
}

function ClockApp() {
    const [showTime, setShowTime] = useState(true);
    const [clockState, setClockState] = useState(() => calculateClockState());
    const touchStartXRef = useRef(null);
    const [isMobileViewport, setIsMobileViewport] = useState(() => getIsMobileViewport());

    useEffect(() => {
        function tick() {
            setClockState(calculateClockState());
        }

        tick();
        const intervalId = setInterval(tick, 1000);
        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
            return;
        }

        const mediaQuery = window.matchMedia('(max-width: 800px)');
        function handleViewportChange(event) {
            setIsMobileViewport(event.matches);
        }

        handleViewportChange(mediaQuery);

        if (typeof mediaQuery.addEventListener === 'function') {
            mediaQuery.addEventListener('change', handleViewportChange);
            return () => mediaQuery.removeEventListener('change', handleViewportChange);
        }

        if (typeof mediaQuery.addListener === 'function') {
            mediaQuery.addListener(handleViewportChange);
            return () => mediaQuery.removeListener(handleViewportChange);
        }

        return undefined;
    }, []);

    function updateView(nextShowTime) {
        setShowTime(nextShowTime);
        setClockState(calculateClockState());
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
            touchStartXRef.current = event.touches[0].clientX;
        }
    }

    function handleTouchEnd(event) {
        if (touchStartXRef.current === null || !event.changedTouches || event.changedTouches.length === 0) {
            touchStartXRef.current = null;
            return;
        }

        const touchEndX = event.changedTouches[0].clientX;
        const deltaX = touchEndX - touchStartXRef.current;
        const swipeThreshold = 40;

        if (Math.abs(deltaX) >= swipeThreshold) {
            if (deltaX < 0 && showTime) {
                updateView(false);
            } else if (deltaX > 0 && !showTime) {
                updateView(true);
            }
        }

        touchStartXRef.current = null;
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
                React.createElement(
                    'div',
                    { className: 'time' },
                    React.createElement(
                        'div',
                        {
                            className: 'value-panels',
                            'data-orientation': isMobileViewport ? 'horizontal' : 'vertical'
                        },
                        React.createElement(
                            'span',
                            {
                                className: 'value-panel time-panel' + (showTime ? ' is-visible' : ''),
                                'aria-hidden': !showTime
                            },
                            clockState.timeValue
                        ),
                        React.createElement(
                            'span',
                            {
                                className: 'value-panel hex-panel' + (!showTime ? ' is-visible' : ''),
                                'aria-hidden': showTime
                            },
                            clockState.hexValue
                        )
                    )
                ),
                React.createElement('div', { className: 'date' }, clockState.date)
            )
        )
    );
}

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);
root.render(React.createElement(ClockApp));
