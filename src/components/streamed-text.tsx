const StreamedText = () => {
  return (
    <div
      hx-ext="sse"
      sse-connect="/sse"
      className="container mx-auto p-4 text-center justify-center text-gray-400"
    >
      <p className="text-2xl font-bold">Server Sent Event</p>
      <p sse-swap="timeUpdate">Waiting for server...</p>
    </div>
  );
};

export default StreamedText;