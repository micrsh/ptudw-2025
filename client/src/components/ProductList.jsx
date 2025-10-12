import { useState, useEffect } from "react";
import { http } from "../lib/http";
import SingleProduct from "./SingleProduct";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let canceled = false; // Biến để kiểm tra hủy bỏ
    setLoading(true);
    setError(null);

    async function load() {
      setLoading(true);
      setError(null); // Đặt lại lỗi trước khi tải
      try {
        // Giả sử bạn có một hàm http.get để lấy dữ liệu từ API
        const res = await http.get("/products");
        const data = res.data.data; // Giả sử dữ liệu sản phẩm nằm trong res.data.data

        if (!canceled) {
          // Chỉ cập nhật state nếu không bị hủy
          setProducts(data.products);
          setLoading(false);
          setError(null);
        }
      } catch (error) {
        if (!canceled) {
          setLoading(false);
          // Chỉ cập nhật state nếu không bị hủy
          setError(
            error?.response?.data.message ||
              error.message ||
              "Khong tai duoc danh muc san pham"
          );
        }
      }
    }

    load();
    return () => {
      canceled = true; // Đánh dấu là đã hủy bỏ
    };
  }, []);

  return (
    <section className="lattest-product-area pb-40 category-list">
      <div className="row">
        {loading && <div> Dang tai...</div>}
        {error && <div className="alert alert-danger">{error}</div>}
        {!loading && !error && (
          <>
            {products.length === 0 ? (
              <div className="alert alert-info">No product found</div>
            ) : (
              <>
                {products.map((p) => (
                  <SingleProduct key={p.id} product={p} />
                ))}
              </>
            )}
          </>
        )}
      </div>
    </section>
  );
}
