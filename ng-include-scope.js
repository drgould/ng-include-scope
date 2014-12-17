angular.module('drg.ngIncludeScope', [])
.directive( 'ngIncludeScope', function() {
    'use strict';

    return {
        restrict: 'A',
        link : function( scope, elem, attrs ) {
            scope.$watch( attrs.ngIncludeScope, function( newScope, oldScope ) {
                var key,
                    newKeys = Object.keys( newScope ),
                    oldKeys = Object.keys( oldScope );
                
                // update values
                for( key in newKeys ) {
                    key = newKeys[ key ];
                    if( newScope.hasOwnProperty( key ) ) {
                        scope[ key ] = newScope[ key ];
                    }
                }
                
                // remove old values
                for( key in oldKeys ) {
                    key = oldKeys[ key ];
                    if( typeof newScope[ key ] === 'undefined' ) {
                        delete scope[ key ];
                    }
                }
            }, true );
        }
    };
});
