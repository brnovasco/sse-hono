import { Hono } from 'hono'
import { streamSSE } from 'hono/streaming'
import Home from './pages/home'

const app = new Hono()

app.get('/', (c) => {
  return c.html(<Home />);
});

let id = 0

app.get('/sse', async (c) => {
  return streamSSE(c, async (stream) => {
    while (true) {
      const message = `<p>It is ${new Date().toISOString()}</p>`
      await stream.writeSSE({
        data: message,
        event: 'timeUpdate',
        id: String(id++),
      })
      await stream.sleep(1000)
    }
  })
})

export default {
  port: process.env.PORT || 3000,
  fetch: app.fetch,
};