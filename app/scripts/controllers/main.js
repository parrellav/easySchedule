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

    /* event source that contains custom events on the scope */
//    $scope.events = [
//        {title: 'All Day Event',start: new Date(y, m, 1)},
//        {title: 'Long Event',start: new Date(y, m, d - 5),end: new Date(y, m, d - 2)},
//        {id: 999,title: 'Repeating Event',start: new Date(y, m, d - 3, 16, 0),allDay: false},
//        {id: 999,title: 'Repeating Event',start: new Date(y, m, d + 4, 16, 0),allDay: false},
//        {title: 'Birthday Party',start: new Date(y, m, d + 1, 19, 0),end: new Date(y, m, d + 1, 22, 30),allDay: false},
//    ];
//    console.log($scope.events);


    $http.get(url).
        success(function(data, status, headers, config) {
            for(var i = 0; i < data.length; i++) {
                $scope.events.push(data[i]);
            }
            $scope.eventSources.push($scope.events);
        }).
        error(function(data, status, headers, config) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
        });

    /* add custom event*/
    $scope.addEvent = function() {
        var newEvent =
        {
            title: 'Untitled Event',
            start: new Date(y, m, d, 8, 0, 0),
            end: new Date(y, m, d, 12, 0, 0),
            allDay: false,
            className: ['openSesame']
        }
        $http.post(url, newEvent).success(addToCalendar);

    };

    /* remove event */
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

    /* alert on eventClick */
    $scope.alertOnEventClick = function( event, allDay, jsEvent, view ){
        console.log(event.title + ' was clicked ');
    };

    /* Change View */
    $scope.changeView = function(view,calendar) {
        calendar.fullCalendar('changeView',view);
    };

    $scope.uiConfig = {
        calendar:{
            height: 450,
            editable: true,
            header:{
                left: 'title',
                center: '',
                right: 'today prev,next'
            }
        }
    };

    var addToCalendar = function(data, status, headers, config) {
        $scope.events.push(data);
    }


  }]);

