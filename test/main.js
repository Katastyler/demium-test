import { resolve } from 'path'
import { Nuxt, Builder } from 'nuxt'
import { JSDOM } from 'jsdom'
import test from 'ava'

// We keep the nuxt and server instance
// So we can close them at the end of the test
let nuxt = null

// Init Nuxt.js and create a server listening on localhost:4000
test.before(async () => {
	const config = {
		dev: false,
		rootDir: resolve(__dirname, '..')
	}
	nuxt = new Nuxt(config)
	await new Builder(nuxt).build()
	await nuxt.server.listen(4000, 'localhost')
}, 30000)

test('Route /', async t => {
	const context = {}
	const { html } = await nuxt.server.renderRoute('/', context)
	const { window } = new JSDOM(html).window

	const draggable = window.document.querySelector('#draggable')
	t.not(draggable, null)

	const newListNameModal = window.document.querySelector('#newListNameModal')
	t.not(newListNameModal, null)
})

test('Route /login', async t => {
	const context = {}
	const { html } = await nuxt.server.renderRoute('/login', context)
	const { window } = new JSDOM(html).window

	const pwdInput = window.document.querySelector('#pwdInput')
	t.not(pwdInput, null)

	const userInput = window.document.querySelector('#userInput')
	t.not(userInput, null)
})

test('Route /register', async t => {
	const context = {}
	const { html } = await nuxt.server.renderRoute('/register', context)
	const { window } = new JSDOM(html).window

	const pwdInput = window.document.querySelector('#pwdInput')
	t.not(pwdInput, null)

	const userInput = window.document.querySelector('#userInput')
	t.not(userInput, null)
})

// Close server and ask nuxt to stop listening to file changes
test.after('Closing server and nuxt.js', (t) => {
	nuxt.close()
})
