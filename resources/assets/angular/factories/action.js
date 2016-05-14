(function() {
    'use strict';
    angular
        .module('dystill')
        .factory('Action', function() {
            function Action(data) {
                if (data) {
                    this.setData(data);
                }
            }

            Action.prototype.setData = function(data) {
                angular.extend(this, data);
            };

            Action.prototype.type = function() {
                switch (this.action) {
                    case "to":
                    case "copy":
                        return "mailbox";
                        break;
                    case "header":
                    case "forward":
                    case "blocknote":
                        return "input";
                        break;
                    default:
                        return "none";
                }
            }

            return Action;
        });
})();
