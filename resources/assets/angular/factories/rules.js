(function() {

    'use strict';

    angular
        .module('dystill')
        .factory('rulesResource', function($resource, $window) {
            // ngResource call to our static data
            var Rules = $resource("/srv/rules", {}, {
                get: {
                    method: 'GET',
                    headers: {'X-Requested-With': 'XMLHttpRequest'}
                }
            });

            function getRules() {
                // $promise.then allows us to intercept the results
                // which we will use later
                return Rules.query().$promise.then(function(results) {
                    return results;
                }, function(error) { // Check for errors

                    // We got logged out.
                    if (error.status == 401) {
                        $window.location.href = $window.location.href;
                    }
                });
            }

            return {
                getRules: getRules,
            }
        });
})();
