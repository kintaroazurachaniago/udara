const http = require('http')
const fs   = require('fs')
const path = require('path')

const base = path.resolve()

class Udara {

	request
	response
	filename = ''
	script   = ''
	output   = ''

	constructor(isInclude=false) {
		this.isInclude = isInclude
	}

	parse (filename, data='') {
		this.filename = filename

		if (this.isInclude) {
			process.stdout.write(`Including... ~/${filename} `)
			fs.appendFileSync('./output.udara', '<!-- Include : ' + filename + ' -->')
		} else {
			process.stdout.write(`Rendering... ~${filename} `)
			fs.writeFileSync('./output.udara', '<!-- Main : ' + filename + ' -->')
		}

		let file
		try {
			file = fs.readFileSync(path.join(base, filename), 'utf8')
			console.log('Success!')
		} catch (err) {
			file = err.toString().replace(base, '~').replace(/\\/g, '/')
			console.log('\n', err)
		}
		this.script = `
			const data = ${JSON.stringify(data)}
			function print (string='') {
				const fs = require('fs')
				fs.appendFileSync('./output.udara', string?.toString())
			}
			function include (filename, data) {
				print(new Udara(true).parse(filename+'.udara', data))
			}
			print(\`${file.trim()
			.replace(/-=\{/g, '`); print(')
			.replace(/\}=-/g, '); print(`')
			.replace(/-=\[/g, '`);')
			.replace(/\]=-/g, '; print(`')
			.replace(/-=\(/g, '`); include(')
			.replace(/\)=-/g, '); print(`')}\`);
		`

		this.script = this.script.replace(/\t/g, ' ')

		return this.eval()
	}

	eval () {
		try {
			eval(this.script)
			const output = fs.readFileSync('./output.udara', 'utf8')
			fs.writeFileSync('./output.udara', '')
			return output
		} catch (err) {
			console.log('\n\n===> EVAL ERROR : ' + this.filename + ' <===')
			console.log(err, '\n\n\n')
			return err.toString()
		}
	}

}

const callback = (req, res) => {
	console.log('~' + req.url)
	const udara = new Udara().parse(req.url, {
		URL : req.url,
		METHOD : req.method
	})
	res.end(udara)
	process.stdout.write('Listening... ')
}

const server = http.createServer(callback)

server.start = (port, message) => server.listen(port, _ => {
	process.stdout.write('Listening... ')
})

module.exports = server