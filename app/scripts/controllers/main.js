'use strict';

var scheduleControllers = angular.module('scheduleControllers', []);

scheduleControllers.controller('MainCtrl', ['$scope', '$http', function ($scope, $http) {

    var url = 'http://localhost:3000/events';

    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();
    $scope.events = [];
    $scope.eventSources = [];

    $http.get(url).
        success(function(data, status, headers, config) {
            for(var i = 0; i < data.length; i++) {
                $scope.events.push(data[i]);
            }
            $scope.eventSources.push($scope.events);
        }).
        error(function(data, status, headers, config) {
            window.alert("An error has occurred.");
        });

    $scope.addEvent = function() {
        var newEvent =
        {
            title: 'Untitled Event',
            start: new Date(y, m, d, 8, 0, 0),
            end: new Date(y, m, d, 12, 0, 0),
            allDay: false,
            className: ['openSesame']
        }
        $http.post(url, newEvent).success(function(data, status, headers, config) {
            $scope.events.push(data);
        });
    };

    $scope.remove = function(index) {
        var myId = $scope.events[index]._id;
        console.log('deleting ' + myId);
        $http.delete(url + '/' + myId).success(function(data, status, headers, config) {
            for(var i = 0; i < $scope.events.length; i++) {
                if($scope.events[i]._id === myId) {
                    $scope.events.splice(i,1);
                    break;
                }
            }
        });
    };

    $scope.changeView = function(view,calendar) {
        calendar.fullCalendar('changeView',view);
    };

    $scope.editEvent = function(event, dayDelta, minuteDelta, revertFunc, jsEvent, ui, view ){
        console.log(event._id + " resized");
        updateEvent(event);
    };

    $scope.eventDrop = function( event, allDay, jsEvent, view ){
        console.log(event + ' dropped ');
        updateEvent(event);
    };

    $scope.change = function(event) {
        console.log(event + " changed");
        updateEvent(event);
    };

    $scope.uiConfig = {
        calendar:{
            height: 450,
            editable: true,
            header:{
                left: 'title',
                center: '',
                right: 'today prev,next'
            },
            eventResize: $scope.editEvent,
            eventDrop: $scope.eventDrop
        }
    };

    var updateEvent = function(event) {

        var updatedEvent =
        {
            title: event.title,
            start: event.start,
            end: event.end,
            allDay: event.allDay,
            className: event.className
        }

        $http.put(url + '/' + event._id, updatedEvent).success(function(data, status, headers, config) {
            console.log(data);
        });
    };

  }]);

