(function() {

    'use strict';

    angular
        .module('dystill')
        .controller('rules', function ($rootScope, $scope, $uibModal, $timeout, rulesResource) {
            $rootScope.rules = [];
            $scope.rules = [];

            $rootScope.$watch(
                "rules",
                function(newValue, oldValue) {
                    $scope.rules = $rootScope.rules;
                }
            );

            function loadRules() {
                rulesResource.getRules().then(function(results) {
                    $rootScope.rules = results;
                }, function(error) { // Check for errors
                    console.log(error);
                });
            }

            var poll = function() {
                $timeout(function() {
                    loadRules();
                    poll();
                }, 5000);
            };

            loadRules();
            poll();
        });
})();
