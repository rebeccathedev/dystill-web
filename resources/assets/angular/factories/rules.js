(function() {

    'use strict';

    angular
        .module('dystill')
        .factory('rulesResource', function($resource, $window) {
            // ngResource call to our static data
            var Rule = $resource("/srv/rules/:ruleId", {ruleId: "@id"}, {
                get: {
                    method: 'GET',
                    headers: {'X-Requested-With': 'XMLHttpRequest'}
                },
                save: {
                    method: 'POST',
                    headers: {'X-Requested-With': 'XMLHttpRequest'}
                },
                remove: {
                    method: 'DELETE',
                    headers: {'X-Requested-With': 'XMLHttpRequest'}
                }
            });

            function query() {
                // $promise.then allows us to intercept the results
                // which we will use later
                return Rule.query().$promise.then(function(results) {
                    return results;
                }, function(error) { // Check for errors

                    // We got logged out.
                    if (error.status == 401) {
                        $window.location.href = $window.location.href;
                    }
                });
            }

            function create(data) {
                return Rule.save({}, data).$promise.then(function(results) {
                    return results;
                }, function(error) { // Check for errors

                    // We got logged out.
                    if (error.status == 401) {
                        $window.location.href = $window.location.href;
                    }
                });
            }

            function save(id, data) {
                if (!id && data.filter_id) {
                    id = data.filter_id;
                }

                return Rule.save({ruleId: id}, data).$promise.then(function(results) {
                    return results;
                }, function(error) { // Check for errors

                    // We got logged out.
                    if (error.status == 401) {
                        $window.location.href = $window.location.href;
                    }
                });
            }

            function remove(id) {
                return Rule.remove({ruleId: id}).$promise.then(function(results) {
                    return results;
                }, function(error) { // Check for errors

                    // We got logged out.
                    if (error.status == 401) {
                        $window.location.href = $window.location.href;
                    }
                });
            }

            return {
                query: query,
                create: create,
                save: save,
                remove: remove
            }
        });
})();
