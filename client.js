const {Socket} = require('net'),
{createInterface} = require('readline')

var HOST = '127.0.0.1'
var PORT = 30000

let client = new Socket()
client.connect(PORT, HOST, async => {
	process.title = `[Client] ${HOST}:${PORT}`
})

client.on('connect', async => {
	console.log('Você esta conectado')
	let cmd = createInterface({
	  input: process.stdin,
	  output: process.stdout
	})

	cmd.on('line', msg => {
		client.write(msg)
	})
})

client.on('data', async data => {
	console.log(data.toString())
})

client.on('close', async => {
	console.log('Conexão fechada.')
})

client.on('error', err => {
	//console.log('Erro:', err)
	client.destroy()
})