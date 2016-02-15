(function() {

    'use strict';

    angular
        .module('dystill')
        .controller('rules', function ($rootScope, $scope, $uibModal, rulesResource, mailboxesResource) {
            $rootScope.rules = [];
            $rootScope.mailboxes = [];
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

            function loadMailboxes() {
                mailboxesResource.getMailboxes().then(function(results) {
                    $rootScope.mailboxes = results;
                }, function(error) { // Check for errors
                    console.log(error);
                });
            }

            $scope.openEditModal = function(size) {
                loadMailboxes();

                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'edit-modal.html',
                    controller: 'edit-modal-controller',
                    backdrop: 'static',
                    size: size
                }).result.then(function(reason) {

                    if (reason == 'cancel') {

                    }
                });
            }

            $scope.editRule = function(rule_id) {
                $scope.openEditModal("lg");
            }

            $scope.addRule = function() {
                $scope.openEditModal("lg");
            }

            loadRules();
            loadMailboxes();
        })

        .controller("edit-modal-controller", function($scope, $rootScope, $http, $uibModalInstance) {
            $scope.currentlyProcessing = false;
            $scope.mailboxes = [];

            $rootScope.$watch(
                "mailboxes",
                function(newValue, oldValue) {
                    $scope.mailboxes = $rootScope.mailboxes;
                }
            );

            $scope.cancel = function() {
                $uibModalInstance.close('cancel');
            }
        });
})();
