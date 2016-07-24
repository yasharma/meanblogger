(function() {
    'use strict';

    angular.module('app.directives', [])
    .directive('header', function () {
        return {
            restrict: 'A',
            templateUrl: "partials/header.html"
        };
    })
    .directive('sidebar', function () {
        return {
            restrict: 'A',            
            //scope: {user: '='},
            templateUrl: "partials/sidebar.html",
            controller: ['$scope', '$location', function ($scope, $location) {
                // Your behaviour goes here :)
                
            }]
        };
    })
    .directive('adminHeader', function () {
        return {
            restrict: 'A',            
            //scope: {user: '='},
            templateUrl: "partials/admin-header.html",
            controller: ['$scope', '$filter', function ($scope, $filter) {
                // Your behaviour goes here :)
            }]
        };
    })
    .directive('adminSidebar', function () {
        return {
            restrict: 'A',            
            //scope: {user: '='},
            templateUrl: "partials/admin-sidebar.html",
            controller: ['$scope', '$filter', function ($scope, $filter) {
                // Your behaviour goes here :)
            }]
        };
    });
}());