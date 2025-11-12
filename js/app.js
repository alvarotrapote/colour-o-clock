var app = angular.module('clock', []);

"use strict";

app.controller('MainCtrl', function($scope, $timeout, dateFilter) {
    
    $scope.clockTime = true;

    function updateTime() {
        $timeout(function() {
            updateClock();
            updateTime();
        }, 1000);
    }

    function updateClock() {
        var time = moment().format('HH:mm:ss');
        $scope.thedate = moment().format('dddd, DD MMMM YYYY');
        $scope.thecolour = "#" + getColour(time);
        $scope.foregroundColor = getTextColor($scope.thecolour);

        if ($scope.clockTime) {
            $scope.theclock = time;
        } else {
            $scope.theclock = $scope.thecolour;
        }
    }

    function getColour(time) {
        var now = moment(time, 'HH:mm:ss');
        var startOfYear = moment().startOf('year');
        var numberOfColours = 16777216; // 256 * 256 * 256

        // Difference btw now and the start of the year, in milliseconds. Then, it maps the number of colours with the number of seconds in a year.
        if (now.diff(startOfYear, 'seconds') < numberOfColours) {
            return ('000000' + Math.floor(now.diff(startOfYear, 'seconds')).toString(16).toUpperCase()).slice(-6);
        } else {
            return ('000000' + Math.floor(now.diff(startOfYear, 'seconds') - numberOfColours).toString(16).toUpperCase()).slice(-6);
        }
    }

    function getTextColor(bgColor) {
        var nThreshold = 105;
        var components = getRGBComponents(bgColor);
        var bgDelta = (components.R * 0.299) + (components.G * 0.587) + (components.B * 0.114);
        return ((255 - bgDelta) < nThreshold) ? "#000000" : "#ffffff";
    }

    function getRGBComponents(color) {
        var normalizedColor = color.charAt(0) === '#' ? color.substring(1) : color;
        if (normalizedColor.length !== 6) {
            return {
                R: 0,
                G: 0,
                B: 0
            };
        }

        var r = normalizedColor.substring(0, 2);
        var g = normalizedColor.substring(2, 4);
        var b = normalizedColor.substring(4, 6);
        return {
            R: parseInt(r, 16),
            G: parseInt(g, 16),
            B: parseInt(b, 16)
        };
    }

    $scope.changeView = function() {
        $scope.clockTime = !$scope.clockTime;
        updateClock();
    };

    updateClock();
    updateTime();

});
