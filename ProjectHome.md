A Javascript implementation of a simplistic PNG encoder for use on Android, where toDataURL is still, as of 4.0, stubbed.

The toDataURL of the HTML5 Canvas element lets you export the content of a Canvas as (at least) PNG... if it's implemented. Sadly, the crippled Webkit version powering the Android browsers doesn't have it. Even worse, it reports that it can do it, returning a broken url instead.

The usual workaround involves creating a BMP file, which is relatively fast, but very few programs handle BMP files with alpha channel correctly.

todataurl-png-js is distributed under the GNU Affero General Public License, version 3 license.

You can find a quick tutorial [here](http://code.google.com/p/todataurl-png-js/wiki/FirstSteps).

Demos are available [here](http://code.google.com/p/todataurl-png-js/source/browse/#svn/trunk/samples)