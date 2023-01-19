/*
 * Simple logger for BitBurner
 * (c) 2023 p3t 
 * MIT License
 */
export const COLOR = {
	BLACK: "\u001b[30m",
	WHITE: "\u001B[37m",
	RED: "\u001B[31m",
	GREEN: "\u001b[32m",
	MAGENTA: "\u001b[35m",
	CYAN: "\u001b[36m",
	YELLOW: "\u001B[33m",
	BLUE: "\u001B[34m",
	
	GREY: "\x1b[38;5;15m",
	SLATE_BLUE: "\x1b[38;5;33m",
	DEFAULT_GREEN: "\x1b[38;5;40m",
	DARK_BROWN: "\x1b[38;5;100m",

	RED_BG: "\x1b[41m",

	RESET: "\u001B[0m"
}

var logger

/** @param {NS} ns */
export async function main(ns) {
	ns.tail()
	logger = newLogger(ns)

	logger.debug("logger.debug inBladeburner: %s", ns.getPlayer().inBladeburner)
	logger.info("logger.info => player.money = %s", ns.getPlayer().money)
	logger.warn("logger.warn => player.money = %s", ns.getPlayer().money)
	logger.error("logger.error => player.money = %s", ns.getPlayer().money)

	logger.name("main").debug("Log with name")
	let log = logger.name("main")

	log.debug("I can log objects: %s", { some: "value", other: { more: true, complex: 1e2 }})

	let log2 = logger.name("main").name("entity-name");
	log2.isTrace = true
	log2.trace("Names can be stacked!")
}

/** 
 * @param {NS}.     ns 
 * @param {string}  [logName=""]    Optional logger name (usually -> name() is used later)
 * @param {boolean} [isDebug=true]  debug log message enabled/disabled
 * @param {boolean} [isTrace=false] trace log messages enabled/disabled
 */
export function newLogger(ns, logName = "", isDebug = true, isTrace = false) {
	return ({
		isDebug: isDebug,
		isTrace: isTrace,
		logName: logName,
		prettyPrint: true,
		// log(message, ...args)   { ns.printf( this.msg("INFO",message), ...push(COLOR.SLATE_BLUE, a(args))) },
		info(message, ...args)  { this.log("INFO", COLOR.CYAN, message, args) },
		warn(message, ...args)  { this.log("WARN", COLOR.MAGENTA, message, args) },
		error(message, ...args) { this.log("ERROR", COLOR.RED, message, args) },
		alert(message, ...args) { this.log("INFO!", COLOR.WHITE, message, args) },
		debug(message, ...args) {
			if (this.isDebug) {
				this.log("DEBUG", COLOR.GREY, message, args)
			}
		},
		trace(message, ...args) {
			if (this.isTrace) {
				this.log("TRACE", COLOR.GREY, message, args)
			}
		},
		log(level, color, message, args) {
			ns.printf( this.msg(level,message), ...this.push(color, this.convert(args)))
		},
		name(withName) {
			return newLogger(ns, (this.logName !== "" ? this.logName + "|" + withName : withName), this.isDebug, this.isTrace)
		},
		msg(level, message) {
			let levelStr = ns.sprintf("%-7s", `[${level}]`)
			let nameStr = (this.logName?.length ? `(${this.logName})` : "")
			return `%s${levelStr}${COLOR.YELLOW}${nameStr}> ${COLOR.DEFAULT_GREEN}${message}${COLOR.RESET}`
		},
		convert(args) {
			if (args?.length > 0) {
				for (let i = 0; i < args.length; ++i) {
					let a = args[i]
					if (typeof a === 'object' && !Array.isArray(a) && a !== null) {
						args[i] = `${COLOR.DARK_BROWN}${JSON.stringify(a, null, this.prettyPrint ? 3 : null)}`

					}
				}
			}
			return args
		},
		push(first, args) {
			args.unshift(first)
			return args
		}
	})
}
