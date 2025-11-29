import Banner from "../components/Banner";

export default function Contact() {
  return (
    <>
      <Banner title="Contact Us" to="/contact" />
      <div classname="container">
        <div
          id="mapBox"
          classname="mapBox"
          data-lat="40.701083"
          data-lon="-74.1522848"
          data-zoom="{13}"
          data-info="PO Box CT16122 Collins Street West, Victoria 8007, Australia."
          data-mlat="40.701083"
          data-mlon="-74.1522848"
        />
        <div classname="row">
          <div classname="col-lg-3">
            <div classname="contact_info">
              <div classname="info_item">
                <i classname="lnr lnr-home">
                  <h6>California, United States</h6>
                  <p>Santa monica bullevard</p>
                </i>
              </div>
              <i classname="lnr lnr-home">
                <div classname="info_item">
                  <i classname="lnr lnr-phone-handset">
                    <h6>
                      <a href="#">00 (440) 9865 562</a>
                    </h6>
                    <p>Mon to Fri 9am to 6 pm</p>
                  </i>
                </div>
                <i classname="lnr lnr-phone-handset">
                  <div classname="info_item">
                    <i classname="lnr lnr-envelope">
                      <h6>
                        <a href="#">support@colorlib.com</a>
                      </h6>
                      <p>Send us your query anytime!</p>
                    </i>
                  </div>
                  <i classname="lnr lnr-envelope"></i>
                </i>
              </i>
            </div>
            <i classname="lnr lnr-home">
              <i classname="lnr lnr-phone-handset">
                <i classname="lnr lnr-envelope"></i>
              </i>
            </i>
          </div>
          <i classname="lnr lnr-home">
            <i classname="lnr lnr-phone-handset">
              <i classname="lnr lnr-envelope">
                <div classname="col-lg-9">
                  <form
                    classname="row contact_form"
                    action="contact_process.php"
                    method="post"
                    id="contactForm"
                    noValidate="novalidate"
                  >
                    <div classname="col-md-6">
                      <div classname="form-group">
                        <input
                          type="text"
                          classname="form-control"
                          id="name"
                          name="name"
                          placeholder="Enter your name"
                          onfocus="this.placeholder = ''"
                          onblur="this.placeholder = 'Enter your name'"
                        />
                      </div>
                      <div classname="form-group">
                        <input
                          type="email"
                          classname="form-control"
                          id="email"
                          name="email"
                          placeholder="Enter email address"
                          onfocus="this.placeholder = ''"
                          onblur="this.placeholder = 'Enter email address'"
                        />
                      </div>
                      <div classname="form-group">
                        <input
                          type="text"
                          classname="form-control"
                          id="subject"
                          name="subject"
                          placeholder="Enter Subject"
                          onfocus="this.placeholder = ''"
                          onblur="this.placeholder = 'Enter Subject'"
                        />
                      </div>
                    </div>
                    <div classname="col-md-6">
                      <div classname="form-group">
                        <textarea
                          classname="form-control"
                          name="message"
                          id="message"
                          rows="{1}"
                          placeholder="Enter Message"
                          onfocus="this.placeholder = ''"
                          onblur="this.placeholder = 'Enter Message'"
                          defaultvalue='{""}'
                          defaultValue={
                            '                </div>\n              </div>\n              <div className="col-md-12 text-right">\n                <button type="submit" value="submit" className="primary-btn">\n                  Send Message\n                </button>\n              </div>\n            </form>\n          </div>\n        </div>\n      </div>\n'
                          }
                        />
                      </div>
                    </div>
                  </form>
                </div>
              </i>
            </i>
          </i>
        </div>
      </div>
    </>
  );
}
