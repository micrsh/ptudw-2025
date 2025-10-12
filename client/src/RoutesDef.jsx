import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import ProductDetail from "./pages/ProductDetail";

export default function RoutesDef() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/product" element={<Home />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/product/:id" element={<ProductDetail />} />
    </Routes>
  );
}
