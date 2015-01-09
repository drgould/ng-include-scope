angular.module('drg.ngIncludeScope', [])
.directive( 'ngIncludeScope', function() {
    'use strict';

    return {
        restrict: 'A',
        link : function( scope, elem, attrs ) {
            var keys = [];
            scope.$watch( attrs.ngIncludeScope, function( newScope, oldScope ) {
                var key;
                
                keys = Object.keys( newScope );
                
                // set getters
                angular.forEach( keys, function(key) {
                    if( newScope.hasOwnProperty( key ) && angular.isUndefined( scope[ key ] ) ) {
                        Object.defineProperty( scope, key, { 
                            get: function() {
                                return !!~keys.indexOf( key ) ? scope.$eval( attrs.ngIncludeScope + "['" + key.replace("'", "\\'") + "']" ) : undefined;
                            }
                        } );
                    }
                } );
            } );
        }
    };
});
