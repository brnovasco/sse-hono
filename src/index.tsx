import { EventEmitter } from "events";
import { Hono } from "hono";
import { streamSSE } from "hono/streaming";
import { Kafka } from "kafkajs";

const app = new Hono();

const kafka = new Kafka({
  clientId: "my-hono-app",
  brokers: [Bun.env.KAFKA_HOST!],
  connectionTimeout: 3000,
});

const consumer = kafka.consumer({ groupId: "hono-group" });
const producer = kafka.producer();
const kafkaEmitter = new EventEmitter();

const runConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: "superchat" });
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      if (message.value) {
        const strMessage = message.value.toString();
        console.log("Message received from Kafka: ", strMessage);
        kafkaEmitter.emit("message", strMessage);
      }
    },
  });
};

runConsumer().catch(console.error);

app.get("/", (c) => {
  return c.html(
    `<html>
      <head>
        <script
          src="https://unpkg.com/htmx.org@2.0.1/dist/htmx.js"
          integrity="sha384-gpIh5aLQ0qmX8kZdyhsd6jA24uKLkqIr1WAGtantR4KsS97l/NRBvh8/8OYGThAf"
          crossorigin="anonymous"
        ></script>
        <script src="https://unpkg.com/htmx-ext-sse@2.2.1/sse.js"></script>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body class="bg-gray-800">
        <div class="w-full min-h-[100dvh] grid grid-rows-[auto_1fr_auto]">
          <h1 class="text-3xl font-bold text-white text-center justify-center bg-gray-700 flex p-8">
            SSE Kafka
          </h1>
          <div class="text-white text-center items-center justify-center flex flex-col gap-4">
            <form hx-post="/message" hx-swap="none" hx-on::after-request="this.reset()" class="flex flex-col gap-2">
              <input name="message" type="text" class="text-black" />
              <button type="submit" class="border bg-gray-400 rounded-sm text-black">Submit</button>
            </form>
            <p>SSE messages</p>
            <div
              hx-ext="sse"
              sse-connect="/sse"
              class="container h-64 overflow-y-auto mx-auto p-4 text-center justify-center text-gray-400"
            >
              <p sse-swap="chatMessage" hx-swap="afterend">Chat...</p>
            </div>
          </div>
          <footer class="text-white text-sm text-center bg-gray-900 p-8">
            <p>Made with bun, hono, htmx and tailwindcss</p>
          </footer>
        </div>
      </body>
    </html>`
  );
});

app.post("/message", async (c) => {
  const body = await c.req.formData();
  const message = body.get("message");
  console.log("Message received from form: ", message);
  await producer.connect();
  await producer.send({
    topic: "superchat",
    messages: [{ value: message?.toString() ?? "hello!" }],
  });
  await producer.disconnect();
  return c.text("Message sent");
});

let id = 0;
app.get("/sse", async (c) => {
  return streamSSE(c, async (stream) => {
    const listener = (message: string) => {
      const sseMessage = `<p>${message}</p>`;
      stream.writeSSE({
        event: "chatMessage",
        data: sseMessage,
        id: String(id++),
      });
    };
    kafkaEmitter.on("message", listener);
    stream.onAbort(() => {
      kafkaEmitter.off("message", listener);
    });
    while (true) {
      await stream.sleep(1000);
    }
  });
});

export default {
  port: Bun.env.PORT || 3000,
  fetch: app.fetch,
};
