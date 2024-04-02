// See https://github.com/typicode/json-server#module
const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router('database.json')
const middlewares = jsonServer.defaults()
const PORT = process.env.PORT || 3000

server.use(middlewares)

server.use(jsonServer.rewriter({
    '/api/*': '/$1',
    '/pensamento*': '/$1'
}))

server.use(router)

server.listen(PORT, () => {
    console.log(`JSON Server is running on port ${PORT} 🚀`)
})

module.exports = server