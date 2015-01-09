ngIncludeScope
================

A simple AngularJS directive that allows you to specify the scope for an ngInclude.  
[Demo](http://plnkr.co/edit/eLHiDcfxs7d32uIlKMOl?p=preview)

##How to use
Install via bower: 
```bash
bower install --save ng-include-scope
```
Include `drg.ngIncludeScope` as a dependency in your app: 
```javascript
angular.module('app', ['drg.ngIncludeScope'])
```
Use the `ng-include-scope` attribute to bind an object to the scope of an `ng-include`:
```html
<div ng-include="'tpl.html'" ng-include-scope="data.moredata"></div>
```

License: MIT
