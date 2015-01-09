angular.module('drg.ngIncludeScope', [])
.factory( 'ngIncludeScopeService', function() {
    'use strict';
    
    return function( scope, attrs, field, isolate ) {
        var keys = [];
        
        scope.$watchCollection( attrs[ field ], function( newScope ) {
            keys = newScope ? Object.keys( newScope ) : [];
            // set getters
            angular.forEach( keys, function(key) {
                if( !scope.hasOwnProperty( key ) ) {
                    Object.defineProperty( scope, key, { 
                        get: function() {
                            return !isolate || ( isolate && !!~keys.indexOf( key ) ) ? scope.$eval( attrs[ field ] + "['" + key.replace("'", "\\'") + "']" ) : undefined;
                        }
                    } );
                }
            } );
        } );
    };
} )
.directive( 'ngIncludeScope', [ 'ngIncludeScopeService', function( ngIncludeScopeService ) {
    'use strict';

    return {
        restrict: 'A',
        link : function( scope, elem, attrs ) {
            ngIncludeScopeService( scope, attrs, 'ngIncludeScope', false );
        }
    };
} ] )
.directive( 'ngIncludeIsolateScope', [ 'ngIncludeScopeService', function( ngIncludeScopeService ) {
    'use strict';

    return {
        restrict: 'A',
        link : function( scope, elem, attrs ) {
            ngIncludeScopeService( scope, attrs, 'ngIncludeIsolateScope', true );
        }
    };
} ] );
