# UDARA
Bind html and nodejs code inside a single file.
## Main js file
Main file will be executed by "**node index.js**" command
```javascript
/* Filename : /index.js */
const udara = require('udara')
const [port, message] = [4120, 'Udara started!']
udara.listen(port, message)
```
## Udara page
Use **.udara** extention for this file.
```html
<!-- Filename : /index.udara -->
-=( 'nav', { someData } )=-	<!-- Including -->
<h1>Main page</h1>
-=[ <!-- Scripting -->
	const y = 10
	for ( let x = 0; x < y; x++ ) {
		print('x = ' + x) <!-- Printing inside script -->
	}
]=-
<b>-={ y }=-</b> <!-- Printing outside script  -->
```
## Run udara
```bash
$node index.js
```
That's all you need to do. Let's go to http://localhost:4120/index.udara
# KINTARO &copy; UDARA