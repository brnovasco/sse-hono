import StreamedText from "../components/streamed-text";
import Layout from "../layouts";

const Home = () => {
  return (
    <Layout>
      <div class="w-full min-h-[100dvh] grid grid-rows-[auto_1fr_auto]">
        <h1 className="text-3xl font-bold text-white text-center justify-center bg-gray-700 flex p-8">
          SSE Clock
        </h1>
        <div className="text-white text-center items-center justify-center flex flex-col gap-4">
          <p>I'm an SSE clock from the backend</p>
          <StreamedText />
        </div>
        <footer className="text-white text-sm text-center bg-gray-900 p-8">
          <p>Made with bun, hono, htmx and tailwindcss</p>
        </footer>
      </div>
    </Layout>
  );
}

export default Home;
