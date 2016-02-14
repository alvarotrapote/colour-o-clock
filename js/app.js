var app = angular.module('clock', []);

app.controller('MainCtrl', function($scope, $timeout, dateFilter) {
    $scope.clockTime = true;

    $scope.updateTime = function() {        
        console.log('updateTime');  
        $timeout(function(){
            $scope.updateClock();
            $scope.updateTime();
        }, 1000);
    };

    $scope.updateClock = function() {
        $scope.thetime = (dateFilter(new Date(), 'HH:mm:ss'));
        $scope.thedate = (dateFilter(new Date(), 'fullDate'));
        if ($scope.clockTime)
            $scope.theclock = $scope.thetime;
        else
            $scope.theclock = "#" + $scope.thecolour;
        var dt = new Date();        
        $scope.newColour();
    }

    $scope.newColour = function() {
        var startOfYear = moment().startOf('year');
        var endOfYear = moment().endOf('year');
        var secondsInYear = endOfYear.diff(startOfYear, 'seconds');
        var now = moment();
        var numberOfColours = 256 * 256 * 256;
        // Difference btw now and the start of the year, in milliseconds. Then, map the number of colours with the number of seconds in a year.
        if (now.diff(startOfYear, 'seconds') < numberOfColours) {
            $scope.thecolour = Math.floor(now.diff(startOfYear, 'seconds')).toString(16);            
        } else {
            $scope.thecolour = Math.floor(now.diff(startOfYear, 'seconds') - numberOfColours).toString(16);
        }
        $scope.foregroundColor = $scope.getTextColor($scope.thecolour);
    };

    $scope.getTextColor = function(bgColor) {
        var nThreshold = 105;
        var components = $scope.getRGBComponents(bgColor);
        // debugger
        var bgDelta = (components.R * 0.299) + (components.G * 0.587) + (components.B * 0.114);
        // debugger
        console.log((255 - bgDelta) < nThreshold)
        return ((255 - bgDelta) < nThreshold) ? "#000000" : "#ffffff";
    }

    $scope.getRGBComponents = function(color) {
        var r = color.substring(0, 2);
        var g = color.substring(2, 4);
        var b = color.substring(4, 6);
        return {
            R: parseInt(r, 16),
            G: parseInt(g, 16),
            B: parseInt(b, 16)
        };
    }

    $scope.updateTime();
});