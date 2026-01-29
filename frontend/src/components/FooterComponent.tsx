import { Fragment } from 'react';
import { Row, Col } from 'react-bootstrap';
import { TelephoneOutbound, Envelope, PinMap, Heart } from 'react-bootstrap-icons';
import { BiLogoMastercard, BiLogoVisa, BiCreditCard, BiLogoPaypal } from 'react-icons/bi';
import { FaCcDiscover, FaCcAmex  } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

interface Props {
  categories?: Array<unknown>,
  setting: unknown
}

const FooterComponent = ({ categories, setting }: Props) => {

   const nowYear = new Date().getFullYear()
   const author = 'Sandy Andryanto'
   const navigate = useNavigate();

   const redirectTo = (event: React.MouseEvent<HTMLElement>, url: string) => {
      const e = event
      e.preventDefault()
      setTimeout(() => { navigate(url); })
  }

   return (
     <Fragment>
         <footer className="footer text-light" id="footer">
          <div className="section bg-black">
            <div className="container mt-2 ">
                <Row>
                    <Col md={3}>
                      <div className="footer">
                        <h3 className="footer-title">About Us</h3>
                        <p>{(setting as { about_section: string }).about_section}</p>
                        <ul className="footer-links">
                          <li><a href="#"><PinMap className='me-2' />{(setting as { com_location: string }).com_location}</a></li>
                          <li><a href="https://wa.me/628989218470"><TelephoneOutbound className='me-2' />{(setting as { com_phone: string }).com_phone}</a></li>
                          <li><a href="#"><Envelope className='me-2' />{(setting as { com_email: string }).com_email}</a></li>
                        </ul>
                      </div>
                    </Col> 
                    <Col md={3}>
                      <div className="footer">
                        <h3 className="footer-title">Categories</h3>
                        <ul className="footer-links">
                          <li><a href="#" onClick={(e) => redirectTo(e, "/store")} >Hot deals</a></li>
                          { categories?.map((row, index) => {
                             return (
                               <li key={index}><a href="#" onClick={(e) => redirectTo(e, `store?category=${(row as { id: number }).id}`)}>{(row as { name: string }).name}</a></li>
                             )
                          }) }
                        </ul>
                      </div>
                    </Col> 
                    <Col md={3}>
                      <div className="footer">
                        <h3 className="footer-title">Information</h3>
                        <ul className="footer-links">
                          <li><a href="#">About Us</a></li>
                          <li><a href="#">Contact Us</a></li>
                          <li><a href="#">Privacy Policy</a></li>
                          <li><a href="#">Orders and Returns</a></li>
                          <li><a href="#">Terms & Conditions</a></li>
                        </ul>
                      </div>
                    </Col> 
                    <Col md={3}>
                      <div className="footer">
                        <h3 className="footer-title">Service</h3>
                        <ul className="footer-links">
                          <li><a href="#">My Account</a></li>
                          <li><a href="#">View Cart</a></li>
                          <li><a href="#">Wishlist</a></li>
                          <li><a href="#">Track My Order</a></li>
                          <li><a href="#">Help</a></li>
                        </ul>
                      </div>
                    </Col> 
                </Row>
            </div>
          </div>
          <div id="bottom-footer" className="section bg-dark p-5">
            <div className="container mt-3">
              <div className="row">
                <div className="col-md-12 text-center">
                  <ul className="footer-payments">
                    <li><a href="#"><BiLogoVisa className='me-3 text-light' size={85} /></a></li>
                    <li><a href="#"><BiCreditCard className='me-3 text-light' size={50} /></a></li>
                    <li><a href="#"><BiLogoPaypal className='me-3 text-light' size={45} /></a></li>
                    <li><a href="#"><BiLogoMastercard className='me-3 text-light' size={45} /></a></li>
                    <li><a href="#"><FaCcDiscover className='me-3 text-light' size={45} /></a></li>
                    <li><a href="#"><FaCcAmex  className='me-3 text-light' size={45} /></a></li>
                  </ul>
                  <span className="copyright">
                    Copyright {nowYear} All rights reserved | This template is made with <Heart className='mx-1 text-light' /> by <a className='text-white' href="https://github.com/sandyblade" target="_blank">{author}</a>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </footer>
     </Fragment>
   )
}

export default FooterComponent