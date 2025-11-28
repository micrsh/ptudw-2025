import { useEffect } from "react";
import Layout from "./components/Layout";
import RoutesDef from "./RoutesDef";

function App() {
  useEffect(() => {
    // nap main.js sau khi react da tao Virtual DOM
    const script = document.createElement("script");
    script.src = "/js/main.js";
    script.async = false; // giu thu tu thuc thi cua file
    document.body.appendChild(script);
    return () => {
      // don dep script khi unmount
      document.body.removeChild(script);
    };
  });

  return (
    <Layout>
      <RoutesDef />
    </Layout>
  );
}

export default App;
