(function() {

    'use strict';

    angular
        .module('dystill')
        .factory('mailboxesResource', function($resource, $window) {
            // ngResource call to our static data
            var Mailboxes = $resource("/srv/mailboxes", {}, {
                get: {
                    method: 'GET',
                    headers: {'X-Requested-With': 'XMLHttpRequest'}
                }
            });

            function getMailboxes() {
                // $promise.then allows us to intercept the results
                // which we will use later
                return Mailboxes.query().$promise.then(function(results) {
                    return results;
                }, function(error) { // Check for errors

                    // We got logged out.
                    if (error.status == 401) {
                        $window.location.href = $window.location.href;
                    }
                });
            }

            return {
                getMailboxes: getMailboxes,
            }
        });
})();
