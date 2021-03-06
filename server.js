const net = require('net'),
clients = new Set(),
HOST = '127.0.0.1',
PORT = 30000,
{createInterface} = require('readline'),
cmd = createInterface({
	input: process.stdin,
	output: process.stdout
})

clients.send = function (data, client) {
	for (let c of this) {
		if (client && c !== client) c.write(data)
	}
}

cmd.on('line', msg => {
	clients.send(`[SERVER] ${msg}`, true)
})

const server = net.createServer(async client => {
	clients.add(client)
	console.log(`On: ${client.remoteAddress}:${client.remotePort}`)
	clients.send(`${client.remotePort} Entrou.`, client)

	client.on('data', async data => {
		console.log(`[${client.remoteAddress}]: ${data}`)
		if (data.toString().startsWith('/s ')) return
		clients.send(`[${client.remotePort}] ${data}`, client)
	})
	
	client.on('close', async data => {
		clients.delete(client)
		clients.send(`${client.remotePort} Saiu.`, true)
		console.log(`Off: ${client.remoteAddress}:${client.remotePort}`)
	})
	
	client.on('error', err => {
		//console.log('Erro:', err)
		client.destroy()
	})
	
	//client.pipe(client)
})

server.listen(PORT, HOST)

process.title = `[Server] ${HOST}:${PORT}`
