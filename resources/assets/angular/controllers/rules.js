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
                rulesResource.query().then(function(results) {
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

            $scope.openEditModal = function(size, rule) {
                loadMailboxes();

                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'edit-modal.html',
                    controller: 'edit-modal-controller',
                    backdrop: 'static',
                    size: size,
                    resolve: {
                        "rule": rule
                    }
                }).result.then(function(reason) {
                    loadRules();

                    if (reason == 'cancel') {

                    }
                });
            }

            $scope.editRule = function(rule) {
                $scope.openEditModal("lg", rule);
            }

            $scope.addRule = function() {
                $scope.openEditModal("lg");
            }

            $scope.deleteRule = function(rule) {
                rulesResource.remove(rule.filter_id).then(function(results) {
                    loadRules();
                });
            }

            loadRules();
            loadMailboxes();
        })

        .controller("edit-modal-controller", function($scope, $rootScope, $http, $uibModalInstance, Action, rulesResource, rule) {
            var defaultValues = {"action": "to"};

            $scope.actions = [];
            $scope.adding = false;

            if (rule) {
                $scope.rule = rule;
                $scope.rule.comparison = rule.comparison.toString();

                for (var i = 0; i < $scope.rule.actions.length; i++) {
                    var ac = $scope.rule.actions[i];
                    $scope.actions.push(new Action(ac));
                }
            } else {
                $scope.rule = {
                    "field": "From",
                    "comparison": "2"
                };
                $scope.actions.push(new Action(defaultValues));
                $scope.adding = true;
            }

            $scope.currentlyProcessing = false;
            $scope.mailboxes = [];

            $rootScope.$watch(
                "mailboxes",
                function(newValue, oldValue) {
                    $scope.mailboxes = $rootScope.mailboxes;
                }
            );

            $scope.addAction = function() {
                $scope.actions.push(new Action(defaultValues));
            }

            $scope.changeAction = function(action) {
                console.log(this);
                console.log(action);
            }

            $scope.deleteAction = function(action) {
                $scope.actions.splice($scope.actions.indexOf(action), 1);
            }

            $scope.cancel = function() {
                $uibModalInstance.close('cancel');
            }

            $scope.save = function() {
                var rule = $scope.rule;
                rule.actions = [];

                for (var i = 0; i < $scope.actions.length; i++) {
                    var action = $scope.actions[i];
                    rule.actions.push({
                        "action": action.action,
                        "argument": action.argument
                    });
                }

                if ($scope.adding) {
                    rulesResource.create(rule).then(function(results) {
                        $uibModalInstance.close('save');
                    });
                } else {
                    rulesResource.save(rule.filter_id, rule).then(function(results) {
                        $uibModalInstance.close('save');
                    });
                }
            }
        });
})();
