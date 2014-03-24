# first-page-loader

Basic lib for downloading additional JS and CSS.
Used to show the first (skeletal) browser page in under 1 sec.

### First page loading in under 1 second.

Advances in Internet technology like widespread broadband access have made the
Web much faster over the years, and now it's mobile's turn. Google is now
recommending webmasters try to get their pages to load in just one second on
mobile devices as a way to keep people from leaving due to waiting too long.

When it comes to 3G or 4G mobile traffic, speeds plummet. That's where
[Google's recommendations]
(https://developers.google.com/speed/docs/insights/mobile)
could come in handy. You can see the details [here.]
(https://docs.google.com/presentation/d/1IRHyU7_crIiCjl0Gvue0WY3eY_eYvFQvSfwQouW9368/present#slide=id.ge02bf84a_0546)

Of immediate interest to us is:

> Due to this TCP behavior, it is important to optimize your content to minimize
> the number of roundtrips required to deliver the necessary data to perform the
> first render of the page. Ideally, the ATF [above the fold] content should fit
> under 14KB - this allows the browser to paint the page after just one
> roundtrip.

This *very small* lib lets you start downloading your main CSS, JS and
template files after the initial 14k payload is delivered.

### How to install
```sh
bower install first-page-loader
    or
bower install git://github.com/eddyystop/first-page-loader
```

### How to use

##### 1. Specify a function to execute when the DOM is fully loaded.
```js
PJAX.onReady( handler );
```
This is similar to what `$( document ).ready( handler )`
would do if jQuery was loaded.

`handler` is called when all assets such as images have been completely
received. Therefore it does not delay the initial render of the page.

##### 2. Load JavaScript files sequentially.
```js
PJAX.loadJsUrls([
    '//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.js',
    '/js/vendor/modernizr.js',
    '/js/vendor/foundation.js',
    '/js/vendor/foundation.abide.js',
    '/js/app.js'
], handler);
```
Each JavaScript file is loaded and parsed before the next file is downloaded,
so dependencies are respected.

The optional `handler` is called once all the files have loaded successfully.

##### 3. Load other script files, such as templates, sequentially.
```js
PJAX.loadJsUrls([
    '/template/signin.ejs',
    '/template/profile.ejs'
], 'text/template', handler);
```

Use any mime type you want.

##### 4. Initiate loading of CSS files in parallel.
```js
PJAX.loadCssUrls([
    '//cdn.jsdelivr.net/foundation/5.0.2/css/foundation.css',
    '/css/vendor/zurb-responsive-tables.css'
]);
```

##### 5. Load CSS files sequentially.
```js
PJAX.loadCssUrls([
    '//cdn.jsdelivr.net/foundation/5.0.2/css/foundation.css',
    '/css/vendor/zurb-responsive-tables.css'
], handler);
```
The order in which CSS files are loaded can be meaningful. The last-specified
selector is used when multiple selectors have the same
importance, i.e. `!important`, and
[specificity.] (http://www.w3.org/TR/CSS21/cascade.html#specificity)

It turns out a cross-browser solution for this [is harder than it should be.]
(http://www.phpied.com/when-is-a-stylesheet-really-loaded/)

##### 6. Load files in parallel.
You can load JavaScript, CSS and template files in parallel if you need to,
using a pattern such as:
```js
 PJAX.onReady(function () {
     // Load 3 streams of files in parallel
     var asyncRemaining = 3;

     PJAX.loadCssUrls([
         '/concat/production.css'
     ], function () { if (!--asyncRemaining) {doOnceAllLoaded();} }
     );

     PJAX.loadJsUrls([
         '/template/signin.ejs'
     ], 'text/template',
     function () { if (!--asyncRemaining) {doOnceAllLoaded();} }
     );

     PJAX.loadJsUrls([
         '//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.js',

         // Load individual files during development.
         '/js/vendor/jquery.pjax-custom.js',
         '/js/vendor/modernizr.js',
         '/js/vendor/foundation.js',
         '/js/vendor/foundation.abide.js',
         '/js/lib/zurb-responsive-tables-custom.js',
         '/js/lib/ousFramework.js',
         '/js/app.js'
     ], function () { if (!--asyncRemaining) {doOnceAllLoaded();} }
     );

     // Once all files have loaded
     function doOnceAllLoaded () {
         $(document).foundation();
         $.pjax({url: '/signin', container: '#pjax-container'});
     }
 });
 ```

### License
Copyright (c) 2014 John Szwaronek (<johnsz9999@gmail.com>).
Distributed under the MIT license. See LICENSE.md for details.