(function() {
    'use strict';

    angular.module('app.directives', [])
    .directive('header', function () {
        return {
            restrict: 'A',
            templateUrl: "modules/partials/header.html"
        };
    });
}());