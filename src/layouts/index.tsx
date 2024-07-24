export default function Layout({ children } : { children: JSX.Element }) {
  return (
    <html>
      <head>
        <script
          src="https://unpkg.com/htmx.org@2.0.1/dist/htmx.js"
          integrity="sha384-gpIh5aLQ0qmX8kZdyhsd6jA24uKLkqIr1WAGtantR4KsS97l/NRBvh8/8OYGThAf"
          crossorigin="anonymous"
        ></script>
        <script src="https://unpkg.com/htmx-ext-sse@2.2.1/sse.js"></script>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body class="bg-gray-800">{children}</body>
    </html>
  );
}
