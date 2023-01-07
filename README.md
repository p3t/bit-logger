# bitLogger
This is a simple logger implementation for [BitBurner](https://danielyxie.github.io/bitburner/) a in-brow.ser game where you need to code javascript in order to automate tasks.

## Install / use
Download the script into your home folder:
````
$BitBurnerTerminal> wget https://github.com/p3t/bitLogger/blob/main/logger.js
````
Use it in your scripts:
````javascript
import {newLogger} from 'logger.js'
// ...
````


## Example usage:
````javascript
import {newLogger} from 'logger.js'

export async function main(ns) {
	ns.tail()
	let logger = newLogger(ns)

	logger.debug("logger.debug %s", ns.getPlayer().money)
	logger.info("logger.info => player.money = %s", ns.getPlayer().money)
	logger.warn("logger.warn => player.money = %s", ns.getPlayer().money)
	logger.error("logger.error => player.money = %s", ns.getPlayer().money)

	logger.name("main").debug("Log with name")
	let log = logger.name("main")

	log.debug("I can log objects: %s", { some: "value", other: { more: true, complex: 1e2 }})
}
````

## Output will be:

<img width="642" alt="example" src="https://user-images.githubusercontent.com/3204560/211153346-a8517616-a2b9-41fb-84c8-78d2c2ce5381.png">
