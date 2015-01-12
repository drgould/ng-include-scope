angular.module('drg.ngIncludeScope', [])
.factory( 'ngIncludeScopeService', function() {
    'use strict';
    
    var keywords = [ 'this', 'constructor' ]
    
    return function( scope, attrs, field, isolate ) {
        var whitelist = [],
            blacklist = angular.copy( keywords );
            
        // initialize the local blacklist
        var localBlacklist = angular.copy( blacklist );
        localBlacklist.push( attrs[ field ] );
        
        /**
         * Set up the getter for the given key
         * @param key {string}
         */ 
        function defineGetter( key ) {
            Object.defineProperty( scope, key, { 
                get: function() {
                    if( !isolate || ( isolate && !!~whitelist.indexOf( key ) ) ) {
                        // get the current value evaluated on the included scope
                        var val = scope.$eval( attrs[ field ] + "['" + key.replace("'", "\\'") + "']" );
                        if( angular.isUndefined( val ) && !isolate ) {
                            // the value is not found and this is not an isolate scope so get the value on the parent scope
                            return scope.$parent[ key ];
                        }
                        return val;
                    }
                    return undefined;
                }
            } );
        }
        
        // find all the properties currently on the scope
        for( var key in scope ) {
            if( key.substr( 0, 1 ) === '$' || !!~localBlacklist.indexOf( key ) ) {
                // the property is protected so add it to the blacklist
                blacklist.push( key );
            } else if( isolate ) {
                // this is an isolate scope so define a getter to handle 
                defineGetter( key );
            }
        }
        
        // watch the target scope
        scope.$watchCollection( attrs[ field ], function( newScope ) {
            if( newScope ) {
                
                // build the blacklist
                localBlacklist = angular.copy( blacklist );
                localBlacklist.push( attrs[ field ] );
                
                // build the whitelist
                whitelist = Object.keys( newScope );
                if( !isolate ) {
                    // this is not an isolate scope so we need to traverse up the parent scopes to find all the properties defined on them
                    for( var parent = newScope.$parent; parent; parent = parent.$parent ) {
                        // add each property in the parent scope to the whitelist if it's not already present
                        for( var key in newScope.$parent ) {
                            if( !~whitelist.indexOf( key ) ) {
                                whitelist.push( key );
                            }
                        }
                    }
                }
                
                // set getters
                angular.forEach( whitelist, function(key) {
                    // add the given property to the scope as long as it's not in the blacklist
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
