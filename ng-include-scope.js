angular.module('drg.ngIncludeScope', [])
.factory( 'ngIncludeScopeService', function() {
    'use strict';
    
    var keywords = [ 'this', 'constructor' ]
    
    return function( scope, attrs, field, isolate ) {
        var whitelist = [],
            blacklist = angular.copy( keywords );
            
        var localBlacklist = angular.copy( blacklist );
        localBlacklist.push( attrs[ field ] );
        
        function defineGetter( key ) {
            Object.defineProperty( scope, key, { 
                get: function() {
                    if( !isolate || ( isolate && !!~whitelist.indexOf( key ) ) ) {
                        var val = scope.$eval( attrs[ field ] + "['" + key.replace("'", "\\'") + "']" );
                        if( angular.isUndefined( val ) && !isolate ) {
                            return scope.$parent[ key ];
                        }
                        return val;
                    }
                    return undefined;
                }
            } );
        }
        
        for( var key in scope ) {
            if( key.substr( 0, 1 ) === '$' || !!~localBlacklist.indexOf( key ) ) {
                blacklist.push( key );
            } else {
                defineGetter( key );
            }
        }
        
        scope.$watchCollection( attrs[ field ], function( newScope ) {
            if( newScope ) {
                whitelist = Object.keys( newScope );
                
                localBlacklist = angular.copy( blacklist );
                localBlacklist.push( attrs[ field ] );
                
                // set getters
                angular.forEach( whitelist, function(key) {
                    if( ( angular.isUndefined( scope[ key ] ) || !scope.hasOwnProperty( key ) ) && !~localBlacklist.indexOf( key ) ) {
                        defineGetter( key );
                    }
                } );
            }
        } );
    };
} )
.directive( 'ngIncludeScope', [ 'ngIncludeScopeService', function( ngIncludeScopeService ) {
    'use strict';

    return {
        restrict: 'A',
        scope: true,
        link : function( scope, elem, attrs ) {
            ngIncludeScopeService( scope, attrs, 'ngIncludeScope', false );
        }
    };
} ] )
.directive( 'ngIncludeIsolateScope', [ 'ngIncludeScopeService', function( ngIncludeScopeService ) {
    'use strict';

    return {
        restrict: 'A',
        scope: true,
        link : function( scope, elem, attrs ) {
            ngIncludeScopeService( scope, attrs, 'ngIncludeIsolateScope', true );
        }
    };
} ] );
