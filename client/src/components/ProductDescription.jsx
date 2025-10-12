import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { http } from "../lib/http";
import ImageGallery from "../components/ImageGallery";

export default function ProductDescription() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let canceled = false; // Biến để kiểm tra hủy bỏ
    setLoading(true);
    setError(null); // Đặt lại lỗi trước khi tải

    async function load() {
      setLoading(true);
      setError(null); // Đặt lại lỗi trước khi tải
      try {
        // Giả sử bạn có một hàm http.get để lấy dữ liệu từ API
        const res = await http.get(`/products/${id}`);
        const data = res.data.data; // Giả sử dữ liệu sản phẩm nằm trong res.data.data
        console.log("LOG: ", data);
        if (!canceled) {
          // Chỉ cập nhật state nếu không bị hủy
          setProduct(data);
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
              "Khong tai duoc san pham"
          );
        }
      }
    }
    load();
    return () => {
      canceled = true; // Đánh dấu là đã hủy bỏ
    };
  }, [id]);

  return (
    <>
      <div>
        {loading && <div> Dang tai...</div>}
        {error && <div className="alert alert-danger">{error}</div>}
        {/*================Single Product Area =================*/}
        {!loading && !error && product && (
          <div className="product_image_area">
            <div className="container">
              <div className="row s_product_inner">
                <div className="col-lg-6">
                  <ImageGallery images={product.Images} />
                </div>
                <div className="col-lg-5 offset-lg-1">
                  <div className="s_product_text">
                    <h3>{product.name}</h3>
                    <h2>${product.price}</h2>
                    <ul className="list">
                      <li>
                        <a className="active" href="#">
                          <span>Category</span> : {product.Category.name}
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <span>Availibility</span> : In Stock
                        </a>
                      </li>
                    </ul>
                    <p>{product.summary}</p>
                    <div className="product_count">
                      <label htmlFor="qty">Quantity:</label>
                      <input
                        type="text"
                        name="qty"
                        id="sst"
                        maxLength={12}
                        defaultValue={1}
                        title="Quantity:"
                        className="input-text qty"
                      />
                      <button
                        //onclick="var result = document.getElementById('sst'); var sst = result.value; if( !isNaN( sst )) result.value++;return false;"
                        className="increase items-count"
                        type="button"
                      >
                        <i className="lnr lnr-chevron-up" />
                      </button>
                      <button
                        //onclick="var result = document.getElementById('sst'); var sst = result.value; if( !isNaN( sst ) && sst > 0 ) result.value--;return false;"
                        className="reduced items-count"
                        type="button"
                      >
                        <i className="lnr lnr-chevron-down" />
                      </button>
                    </div>
                    <div className="card_area d-flex align-items-center">
                      <a className="primary-btn" href="#">
                        Add to Cart
                      </a>
                      <a className="icon_btn" href="#">
                        <i className="lnr lnr lnr-diamond" />
                      </a>
                      <a className="icon_btn" href="#">
                        <i className="lnr lnr lnr-heart" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/*================Product Description Area =================*/}
        <section className="product_description_area">
          {!loading && !error && product && (
            <div className="container">
              <ul className="nav nav-tabs" id="myTab" role="tablist">
                <li className="nav-item">
                  <a
                    className="nav-link"
                    id="home-tab"
                    data-toggle="tab"
                    href="#home"
                    role="tab"
                    aria-controls="home"
                    aria-selected="true"
                  >
                    Description
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link"
                    id="contact-tab"
                    data-toggle="tab"
                    href="#contact"
                    role="tab"
                    aria-controls="contact"
                    aria-selected="false"
                  >
                    Comments
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link active"
                    id="review-tab"
                    data-toggle="tab"
                    href="#review"
                    role="tab"
                    aria-controls="review"
                    aria-selected="false"
                  >
                    Reviews
                  </a>
                </li>
              </ul>
              <div className="tab-content" id="myTabContent">
                <div
                  className="tab-pane fade"
                  id="home"
                  role="tabpanel"
                  aria-labelledby="home-tab"
                >
                  <p>{product.description}</p>
                </div>

                <div
                  className="tab-pane fade"
                  id="contact"
                  role="tabpanel"
                  aria-labelledby="contact-tab"
                >
                  <div className="row">
                    <div className="col-lg-6">
                      <div className="comment_list">
                        {product.Reviews.map((p) => (
                          <div className="review_item" key={p.id}>
                            <div className="media">
                              <div className="d-flex">
                                <img src={p.User.profileImage} />
                              </div>
                              <div className="media-body">
                                <h4>
                                  {p.User.firstName} {p.User.lastName}
                                </h4>
                                <h5>{p.createdAt}</h5>
                                <a className="reply_btn" href="#">
                                  Reply
                                </a>
                              </div>
                            </div>
                            <p>{p.comment}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="review_box">
                        <h4>Post a comment</h4>
                        <form
                          className="row contact_form"
                          action="contact_process.php"
                          method="post"
                          id="contactForm"
                          noValidate="novalidate"
                        >
                          <div className="col-md-12">
                            <div className="form-group">
                              <input
                                type="text"
                                className="form-control"
                                id="name"
                                name="name"
                                placeholder="Your Full name"
                              />
                            </div>
                          </div>
                          <div className="col-md-12">
                            <div className="form-group">
                              <input
                                type="email"
                                className="form-control"
                                id="email"
                                name="email"
                                placeholder="Email Address"
                              />
                            </div>
                          </div>
                          <div className="col-md-12">
                            <div className="form-group">
                              <input
                                type="text"
                                className="form-control"
                                id="number"
                                name="number"
                                placeholder="Phone Number"
                              />
                            </div>
                          </div>
                          <div className="col-md-12">
                            <div className="form-group">
                              <textarea
                                className="form-control"
                                name="message"
                                id="message"
                                rows={1}
                                placeholder="Message"
                                defaultValue={""}
                              />
                            </div>
                          </div>
                          <div className="col-md-12 text-right">
                            <button
                              type="submit"
                              value="submit"
                              className="btn primary-btn"
                            >
                              Submit Now
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className="tab-pane fade show active"
                  id="review"
                  role="tabpanel"
                  aria-labelledby="review-tab"
                >
                  <div className="row">
                    <div className="col-lg-6">
                      <div className="row total_rate">
                        <div className="col-6">
                          <div className="box_total">
                            <h5>Overall</h5>
                            <h4>4.0</h4>
                            <h6>({product.Reviews.length} Reviews)</h6>
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="rating_list">
                            <h3>Based on {product.Reviews.length} Reviews</h3>
                            <ul className="list">
                              <li>
                                <a href="#">
                                  5 Star <i className="fa fa-star" />
                                  <i className="fa fa-star" />
                                  <i className="fa fa-star" />
                                  <i className="fa fa-star" />
                                  <i className="fa fa-star" /> 01
                                </a>
                              </li>
                              <li>
                                <a href="#">
                                  4 Star <i className="fa fa-star" />
                                  <i className="fa fa-star" />
                                  <i className="fa fa-star" />
                                  <i className="fa fa-star" />
                                  <i className="fa fa-star" /> 01
                                </a>
                              </li>
                              <li>
                                <a href="#">
                                  3 Star <i className="fa fa-star" />
                                  <i className="fa fa-star" />
                                  <i className="fa fa-star" />
                                  <i className="fa fa-star" />
                                  <i className="fa fa-star" /> 01
                                </a>
                              </li>
                              <li>
                                <a href="#">
                                  2 Star <i className="fa fa-star" />
                                  <i className="fa fa-star" />
                                  <i className="fa fa-star" />
                                  <i className="fa fa-star" />
                                  <i className="fa fa-star" /> 01
                                </a>
                              </li>
                              <li>
                                <a href="#">
                                  1 Star <i className="fa fa-star" />
                                  <i className="fa fa-star" />
                                  <i className="fa fa-star" />
                                  <i className="fa fa-star" />
                                  <i className="fa fa-star" /> 01
                                </a>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div className="review_list">
                        {product.Reviews.map((p) => (
                          <div className="review_item" key={p.id}>
                            <div className="media">
                              <div className="d-flex">
                                <img src={p.User.profileImage} />
                              </div>
                              <div className="media-body">
                                <h4>
                                  {p.User.firstName} {p.User.lastName}
                                </h4>
                                <i className="fa fa-star" />
                                <i className="fa fa-star" />
                                <i className="fa fa-star" />
                                <i className="fa fa-star" />
                                <i className="fa fa-star" />
                              </div>
                            </div>
                            <p>{p.comment}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="review_box">
                        <h4>Add a Review</h4>
                        <p>Your Rating:</p>
                        <ul className="list">
                          <li>
                            <a href="#">
                              <i className="fa fa-star" />
                            </a>
                          </li>
                          <li>
                            <a href="#">
                              <i className="fa fa-star" />
                            </a>
                          </li>
                          <li>
                            <a href="#">
                              <i className="fa fa-star" />
                            </a>
                          </li>
                          <li>
                            <a href="#">
                              <i className="fa fa-star" />
                            </a>
                          </li>
                          <li>
                            <a href="#">
                              <i className="fa fa-star" />
                            </a>
                          </li>
                        </ul>
                        <p>Outstanding</p>
                        <form
                          className="row contact_form"
                          action="contact_process.php"
                          method="post"
                          id="contactForm"
                          noValidate="novalidate"
                        >
                          <div className="col-md-12">
                            <div className="form-group">
                              <input
                                type="text"
                                className="form-control"
                                id="name"
                                name="name"
                                placeholder="Your Full name"
                                //onfocus="this.placeholder = ''"
                                //onblur="this.placeholder = 'Your Full name'"
                              />
                            </div>
                          </div>
                          <div className="col-md-12">
                            <div className="form-group">
                              <input
                                type="email"
                                className="form-control"
                                id="email"
                                name="email"
                                placeholder="Email Address"
                                //onfocus="this.placeholder = ''"
                                //onblur="this.placeholder = 'Email Address'"
                              />
                            </div>
                          </div>
                          <div className="col-md-12">
                            <div className="form-group">
                              <input
                                type="text"
                                className="form-control"
                                id="number"
                                name="number"
                                placeholder="Phone Number"
                                //onfocus="this.placeholder = ''"
                                //onblur="this.placeholder = 'Phone Number'"
                              />
                            </div>
                          </div>
                          <div className="col-md-12">
                            <div className="form-group">
                              <textarea
                                className="form-control"
                                name="message"
                                id="message"
                                rows={1}
                                placeholder="Review"
                                //onfocus="this.placeholder = ''"
                                //onblur="this.placeholder = 'Review'"
                                defaultValue={""}
                              />
                            </div>
                          </div>
                          <div className="col-md-12 text-right">
                            <button
                              type="submit"
                              value="submit"
                              className="primary-btn"
                            >
                              Submit Now
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
        {/*================End Product Description Area =================*/}

        {/* Start related-product Area */}
        <section className="related-product-area section_gap_bottom">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-6 text-center">
                <div className="section-title">
                  <h1>Deals of the Week</h1>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit,
                    sed do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua.
                  </p>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-9">
                <div className="row">
                  <div className="col-lg-4 col-md-4 col-sm-6 mb-20">
                    <div className="single-related-product d-flex">
                      <a href="#">
                        <img src="/img/r1.jpg" />
                      </a>
                      <div className="desc">
                        <a href="#" className="title">
                          Black lace Heels
                        </a>
                        <div className="price">
                          <h6>$189.00</h6>
                          <h6 className="l-through">$210.00</h6>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-4 col-sm-6 mb-20">
                    <div className="single-related-product d-flex">
                      <a href="#">
                        <img src="/img/r2.jpg" />
                      </a>
                      <div className="desc">
                        <a href="#" className="title">
                          Black lace Heels
                        </a>
                        <div className="price">
                          <h6>$189.00</h6>
                          <h6 className="l-through">$210.00</h6>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-4 col-sm-6 mb-20">
                    <div className="single-related-product d-flex">
                      <a href="#">
                        <img src="/img/r3.jpg" />
                      </a>
                      <div className="desc">
                        <a href="#" className="title">
                          Black lace Heels
                        </a>
                        <div className="price">
                          <h6>$189.00</h6>
                          <h6 className="l-through">$210.00</h6>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-4 col-sm-6 mb-20">
                    <div className="single-related-product d-flex">
                      <a href="#">
                        <img src="/img/r5.jpg" />
                      </a>
                      <div className="desc">
                        <a href="#" className="title">
                          Black lace Heels
                        </a>
                        <div className="price">
                          <h6>$189.00</h6>
                          <h6 className="l-through">$210.00</h6>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-4 col-sm-6 mb-20">
                    <div className="single-related-product d-flex">
                      <a href="#">
                        <img src="/img/r6.jpg" />
                      </a>
                      <div className="desc">
                        <a href="#" className="title">
                          Black lace Heels
                        </a>
                        <div className="price">
                          <h6>$189.00</h6>
                          <h6 className="l-through">$210.00</h6>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-4 col-sm-6 mb-20">
                    <div className="single-related-product d-flex">
                      <a href="#">
                        <img src="/img/r7.jpg" />
                      </a>
                      <div className="desc">
                        <a href="#" className="title">
                          Black lace Heels
                        </a>
                        <div className="price">
                          <h6>$189.00</h6>
                          <h6 className="l-through">$210.00</h6>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-4 col-sm-6">
                    <div className="single-related-product d-flex">
                      <a href="#">
                        <img src="/img/r9.jpg" />
                      </a>
                      <div className="desc">
                        <a href="#" className="title">
                          Black lace Heels
                        </a>
                        <div className="price">
                          <h6>$189.00</h6>
                          <h6 className="l-through">$210.00</h6>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-4 col-sm-6">
                    <div className="single-related-product d-flex">
                      <a href="#">
                        <img src="/img/r10.jpg" />
                      </a>
                      <div className="desc">
                        <a href="#" className="title">
                          Black lace Heels
                        </a>
                        <div className="price">
                          <h6>$189.00</h6>
                          <h6 className="l-through">$210.00</h6>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-4 col-sm-6">
                    <div className="single-related-product d-flex">
                      <a href="#">
                        <img src="/img/r11.jpg" />
                      </a>
                      <div className="desc">
                        <a href="#" className="title">
                          Black lace Heels
                        </a>
                        <div className="price">
                          <h6>$189.00</h6>
                          <h6 className="l-through">$210.00</h6>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-3">
                <div className="ctg-right">
                  <a href="#" target="_blank">
                    <img
                      className="img-fluid d-block mx-auto"
                      src="/img/category/c5.jpg"
                    />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* End related-product Area */}
      </div>
    </>
  );
}
