import { useEffect, useState } from "react";
import { http } from "../lib/http";

export default function SidebarCategory() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let canceled = false;
    async function load() {
      setLoading(true);
      setError(null);

      try {
        const res = await http.get("/categories");
        const data = res.data.data;

        if (!canceled) {
          setCategories(data);
          setLoading(false);
        }
      } catch (error) {
        if (!canceled) {
          setError(
            error?.response?.data.message ||
              error.message ||
              "Khong tai duoc danh muc san pham"
          );
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      canceled = true;
    };
  }, []);

  return (
    <div className="sidebar-categories">
      <div className="head">Browse Categories</div>
      <ul className="main-categories">
        {loading && <div> Dang tai...</div>}
        {error && <div className='alert alert-danger'>{error}</div>}
        {categories.map((c) => (
          <li className="main-nav-list" key={c.id}>
            <a href="#">
              {c.name}
              <span className="number">({c.Products.length})</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
