import { Fragment } from "react/jsx-runtime"
import { CurrencyExchange, Heart, Eye, StarFill, CartPlus, Star } from 'react-bootstrap-icons';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Slider from "react-slick";
import Tooltip from 'react-bootstrap/Tooltip';
import { NavLink } from "react-router-dom";
import { useState } from "react";
import Service from "../Service";

interface Props {
  products?: Array<unknown>,
  loadOrder: () => void
}

const SliderComponent = ({ products, loadOrder }: Props) => {

    const logged = localStorage.getItem('auth_token') !== null && localStorage.getItem('auth_user') !== null
    const [loading, setLoading] = useState(false)
    const [productId, setProductId] = useState(0)

    const setting = {
      dots: true,
      infinite: true,
      slidesToShow: 3,
      slidesToScroll: 1,
      autoplay: true,
      speed: 2000,
      autoplaySpeed: 2000,
      cssEase: "linear"
    }

    const renderTooltip = (word:string, id:string) => {
      return (
        <Tooltip id={id}>
          {word}
        </Tooltip>
      )
    }

    const addWhisList = async (event: React.MouseEvent<HTMLElement>, id:number) => {
        const e = event
        e.preventDefault();
        e.nativeEvent.stopImmediatePropagation();
        setProductId(id)
        setLoading(true)
        Service.order.wishlist(id)
          .then(() => {
             setTimeout(() => {
                setProductId(0)
                setLoading(false)
                loadOrder()
             }, 1500)
          })
    }

   return (
     <Fragment>
        <div className="slider-container text-center">
             <Slider {...setting}>
                 { products?.map((product, index) => {
                    return (
                      <div className='me-2' key={index}>
                        <div className='card me-2'>
                            <img src={(product as { image: string }).image} className='card-img-top' alt='' />
                            <div className='card-body p-4'>
                              <h5 className='text-primary'>{(product as { category: string }).category}</h5>  
                              <h6 className="fw-bolder">{(product as { name: string }).name}</h6>
                              <strong className='text-danger me-2'>${parseFloat((product as { price: string }).price)}</strong><del><strong className='text-muted'>${parseFloat((product as { price_old: string }).price_old)}</strong></del>
                              <div className="d-flex justify-content-center small text-warning">
                                  {Array.from({ length: (product as { total_rating: number }).total_rating }, (_, i) => (
                                     <StarFill key={i} size={17} />
                                  ))}
                                  { (product as { total_rating: number }).total_rating < 5 ? <>
                                        {Array.from({ length: 5 - (product as { total_rating: number }).total_rating }, (_, j) => (
                                          <Star key={j} size={17} />
                                        ))}
                                  </> : <></> }
                              </div>
                              <div className='clearfix text-center mt-2'>
                                 { logged ? <>
                                    <OverlayTrigger placement="top" delay={{ show: 250, hide: 400 }} overlay={renderTooltip('Add To Wishlist', 'tooltip1')}>
                                      <Button className={loading && productId === (product as { id: number }).id ? 'disabled' : ''} onClick={(e) => addWhisList(e, (product as { id: number }).id)} variant="btn btn-light border me-1">
                                         { loading && productId === (product as { id: number }).id ? <>
                                             <i className="fas fa-circle-notch fa-spin"></i>
                                         </> : <>
                                             <Heart className='mb-1' />
                                         </> }
                                      </Button>
                                  </OverlayTrigger>
                                 </> : <></> }
                                <OverlayTrigger placement="top" delay={{ show: 250, hide: 400 }} overlay={renderTooltip('Add To Compare', 'tooltip2')}>
                                  <Button variant="btn btn-light border me-1"><CurrencyExchange className='mb-1' /></Button>
                                </OverlayTrigger>
                                <OverlayTrigger placement="top" delay={{ show: 250, hide: 400 }} overlay={renderTooltip('Quick View', 'tooltip3')}>
                                  <Button variant="btn btn-light border me-1"><Eye className='mb-1' /></Button>
                                </OverlayTrigger>
                              </div>
                            </div>
                            { logged ? <>
                              <div className="card-footer bg-transparent text-center border-top-0">
                                 <NavLink className="btn btn-primary text-white w-100" to={`/cart/${(product as { id: number }).id}`}>
                                    <CartPlus className='mb-1 me-1' />Add To Cart
                                </NavLink>
                              </div>
                            </> : <></> }
                        </div>
                      </div>
                   )
                 }) }
             </Slider>
        </div>
     </Fragment>
   )
}

export default SliderComponent