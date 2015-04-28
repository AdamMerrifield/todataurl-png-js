# Introduction #

The toDataURL of the HTML5 Canvas element lets you export the content of a Canvas as (at least) PNG... if it's implemented. Sadly, the crippled Webkit version powering the Android browsers doesn't have it. Even worse, it reports that it can do it, returning a broken url instead.

The usual workaround involves creating a BMP file, which is relatively fast, but very few programs handle BMP files with alpha channel correctly.

Using todataurl-png-js you get a working implementation with alpha channel, but with some severe drawbacks.
  1. It's slow. There's just no way a JS implemented method can keep up with a native one. Plus, the PNG format wasn't created to be fast: it needs two checksums in order to create a working file and neither of these methods is implemented in a browser's native code.
  1. It won't compress the data. Compressing would simply take too long.

# First steps #

## Demo ##

You can find a working version of this at [dest.at/tdu/draw.html](http://dest.at/tdu/draw.html)

## Details ##

In order to deploy todataurl-png-js, you have to add [this file](http://todataurl-png-js.googlecode.com/svn/trunk/todataurl.js) to your HTML's head element. Linking to it directly is not recommended, since Google may change the location of project files at any time.

Assuming this is your basic HTML
```
 <!DOCTYPE html>
 <html>
 	<head>
 		<title>My Canvas page</title>
 	</head>
 	<body>
 		<canvas width="320" height="200"></canvas>
 	</body>
 </html>
```

You just add the script element like so
```
 <!DOCTYPE html>
 <html>
 	<head>
 		<title>My Canvas page</title>
 		<script src="todataurl.js"></script>
 	</head>
 	<body>
 		<canvas width="320" height="200"></canvas>
 	</body>
 </html>
```

And start drawing
```
 <!DOCTYPE html>
 <html>
 	<head>
 		<title>My Canvas page</title>
 		<script src="todataurl.js"></script>
 		<script>
 			window.addEventListener("mousedown",function(evt){
 				var cv=document.getElementsByTagName("canvas")[0];
 				var cx=cv.getContext("2d");
 				cx.fillRect(evt.clientX-cv.offsetLeft-8,evt.clientY-cv.offsetTop-8,16,16);
 			},false);
 		</script>
 	</head>
 	<body>
 		<canvas width="320" height="200"></canvas>
 	</body>
 </html>
```

Once you're satisfied, you can get the dataURL like you usually would. For this example we'll assign it as the window's background.
```
 <!DOCTYPE html>
 <html>
 	<head>
 		<title>My Canvas page</title>
 		<script src="todataurl.js"></script>
 		<script>
 			window.addEventListener("mousedown",function(evt){
 				var cv=document.getElementsByTagName("canvas")[0];
 				var cx=cv.getContext("2d");
 				cx.fillRect(evt.clientX-cv.offsetLeft-8,evt.clientY-cv.offsetTop-8,16,16);
 			},false);
 		</script>
 	</head>
 	<body>
 		<canvas width="320" height="200" style="border:2px solid black;background:white;"></canvas>
 		<input type="button" value="Set as background" onclick="var cv=document.getElementsByTagName('canvas')[0];document.documentElement.style.background='url('+cv.toDataURL()+')';" />
 	</body>
 </html>
```