import { Fragment, useEffect, useState } from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import { Telegram, Facebook, Twitter, Google, Instagram, Star, CurrencyExchange, Heart, Eye, StarFill, CartPlus, BagDash, BagPlus } from 'react-bootstrap-icons';
import Button from 'react-bootstrap/Button';
import Tooltip from 'react-bootstrap/Tooltip';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Nav from 'react-bootstrap/Nav';
import { Rating } from '@smastrom/react-rating'
import ProgressBar from 'react-bootstrap/ProgressBar';
import { NumericFormat } from 'react-number-format';
import Slider from "react-slick";
import RelatedProduct from "../components/RelatedProduct"
import { Shimmer } from 'react-shimmer';
import Swal from 'sweetalert2'
import { useNavigate, useParams } from 'react-router-dom';
import Service from '../Service';

interface Props {
  onloadOrder: () => void
}


const CartPage = ({ onloadOrder }: Props) => {

  const logged: boolean = localStorage.getItem('auth_token') !== undefined && localStorage.getItem('auth_token') !== null
  const auth_user: unknown = JSON.parse(localStorage.getItem('auth_user') ?? 'null')
  const [loadingContent, setLoadingContent] = useState(true);
  const [loadingReview, setLoadingReview] = useState(true);
  const [productName, setProductName] = useState('');
  const [errors, setErrors] = useState(Array<string>);
  const [reviews, setReviews] = useState(Array<unknown>);
  const [product, setProduct] = useState<unknown>(null);
  const [images, setImages] = useState(Array<unknown>);
  const [related, setRelated] = useState(Array<unknown>);
  const [sizes, setSizes] = useState(Array<unknown>);
  const [sizeSelected, setSizeSelected] =  useState(0);
  const [colours, setColours] = useState(Array<unknown>);
  const [colourSelected, setColourSelected] =  useState(0);
  const [stocks, setStocks] = useState(Array<unknown>);
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [tabActive, setTabActive] = useState<string | null>('link-3');
  const { id } = useParams();
  const [qty, setQty] = useState(1);
  const [total, setTotal] = useState(0);
  const [available, setAvailable] = useState(0);
  const [review, setReview] = useState('');
  const [, setDebounced] = useState('');
  const [errorMessage, setErrorMessage] = useState('')
  
  const setting = {
    dots: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    cssEase: "linear"
  }

  const renderTooltip = (word: string, id: string) => {
    return (
      <Tooltip id={id}>
        {word}
      </Tooltip>
    )
  }

  const handleQty = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, type: string) => {
    const price = (product as { price: number }).price
    e.preventDefault()
    if(sizeSelected && colourSelected)
    {
        if (type === 'plus') {
          if(available > 0 && available === qty){
            const _total: number = price * available
            setQty(available)
            setTotal(_total)
          }else{
            const _qty: number = qty + 1
            const _total: number = price * _qty
            setQty(_qty)
            setTotal(_total)
          }
      } else {
        if (qty > 1) {
          const _qty: number = qty - 1
          const _total: number = price * _qty
          setQty(_qty)
          setTotal(_total)
        }
      }
    }
  }

  const handleSelect = (e: string | null) => {
    setTabActive(e)
  }

  const handleRating = (e: number) => {
    setRating(e)
  }

  const loadContent = async () => {
    setLoadingContent(true)
    await Service.order.cartDetail(parseInt(id ?? '0'))
      .then((result) => {
        const data = result.data
        setTimeout(() => { 
          setProduct(data.product)
          setImages(data.images)
          setRelated(data.productRelated)
          setColours(data.colours)
          setStocks(data.inventories)
          setSizes(data.sizes)
          setProductName(data.product.name)
          setTotal((data.product as { price: number }).price)
          setLoadingContent(false)
        }, 1500)
      })
      .catch((error) => {
          const msg = error.status === 401 ? Service.expiredMessage : (error.response.data?.message || error.message)
          setErrorMessage(msg)
      })
  }

  const loadReview = async () => {
    setLoadingReview(true)
    await Service.order.listReview(parseInt(id ?? '0'))
      .then((result) => {
        const data = result.data
        setTimeout(() => { 
          setReviews(data)
          setLoadingReview(false)
        }, 1500)
      })
      .catch((error) => {
          const msg = error.status === 401 ? Service.expiredMessage : (error.response.data?.message || error.message)
          setErrorMessage(msg)
      })
  }

  const onClickReview = (event: React.MouseEvent<HTMLElement>) => {
      const e = event
      e.preventDefault();
      window.scrollTo({ top: window.scrollY + 700, behavior: 'smooth' })
  }

  const onClickCategory = (event: React.MouseEvent<HTMLElement>, category:number) => {
      const e = event
      e.preventDefault();
      navigate(`/store/${category}`)
  }

  const onClickShare = (event: React.MouseEvent<HTMLElement>, url:string) => {
    const e = event
    e.preventDefault();
    window.open(url, '_blank')
  }

  const handleSizeSelected = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSizeSelected(parseInt(e.target.value));
    if(colourSelected){
       const colour_id = colourSelected
       const size_id = parseInt(e.target.value)
       const getStock = (stocks as Array<{ size_id: number, colour_id: number, stock: number }>).filter(row => row.size_id === size_id && row.colour_id === colour_id)
       if(getStock.length > 0){
          const stock = getStock[0].stock
          setAvailable(stock)
       }
    }
  }

  const handleColourSelected = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setColourSelected(parseInt(e.target.value));
    if(sizeSelected){
       const colour_id = parseInt(e.target.value)
       const size_id = sizeSelected
       const getStock = (stocks as Array<{ size_id: number, colour_id: number, stock: number }>).filter(row => row.size_id === size_id && row.colour_id === colour_id)
       if(getStock.length > 0){
          const stock = getStock[0].stock
          setAvailable(stock)
       }
    }
  }

   const onSubmitReview = async(event: React.MouseEvent<HTMLElement>)=> {

      const e = event
      e.preventDefault();

      const productId = parseInt((id ?? '0').toString())
      const result = await Swal.fire({
        title: 'Adding New Review',
        text: 'Are you sure you want to create new review?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, Continue',
        cancelButtonText: 'Cancel',
        showLoaderOnConfirm: true,
        allowOutsideClick: () => !Swal.isLoading(),
        preConfirm: async () => {
          try {
            const formData = { rating: rating, review: review }
            const res = await Service.order.createReview(productId, formData)
            return res;
          } catch (error) {
              const message =
                error instanceof Error
                  ? error.message
                  : typeof error === 'string'
                  ? error
                  : 'An unknown error occurred';
              setErrorMessage(message)
            return;
          }
        }
      });

      if (result.isConfirmed) {
        Swal.fire({
          icon: 'success',
          title: 'Review has been added!',
          text: 'Your review has been successfully added to this product.'
        });
        loadReview()
        setReview('')
      }
      
   }

   const onSubmitCart = async (event: React.MouseEvent<HTMLElement>) => {

      const errs:Array<string> = []
      const e = event
      const productId = parseInt((id ?? '0').toString())
      e.preventDefault();

      if(!sizeSelected){
         errs.push("The field size can not be empty!")
      }

      if(!colourSelected){
         errs.push("The field colour can not be empty!")
      }

      setErrors(errs)

      if(errs.length === 0)
      {
        const result = await Swal.fire({
          title: 'Adding Cart Confirmation',
          text: 'Are you sure you want to place your order?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, Continue',
          cancelButtonText: 'Cancel',
          showLoaderOnConfirm: true,
          allowOutsideClick: () => !Swal.isLoading(),
          preConfirm: async () => {
            try {
               const formData = {
                size_id: sizeSelected,
                colour_id: colourSelected,
                qty: qty,
                total: total
              }
              const res = await Service.order.cartAdd(productId, formData)
              return res;
            } catch (error) {
              const message =
                error instanceof Error
                  ? error.message
                  : typeof error === 'string'
                  ? error
                  : 'An unknown error occurred';
              setErrorMessage(message)
              return;
            }
          }
        });

        if (result.isConfirmed) {
          Swal.fire({
            icon: 'success',
            title: 'Cart has been added!',
            text: 'Your product has been successfully added to cart.'
          });
          onloadOrder()
          setTimeout(() => { 
             navigate(`/order/list`)
          }, 1500)
        }
      }
      
  }

 
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(review), 300);
    return () => clearTimeout(timer);
  }, [review]);
  
  useEffect(() => {

      if(!logged){
        navigate(`/auth/login`)
      }

      loadContent() 
      loadReview()
  }, []);

  return (
    <Fragment>
      <main className="flex-shrink-0 p-3 border-bottom bg-gray text-uppercase mb-5" id="breadcrumb">
        <Container>
          <Row>
            <Col md={12}>
              <Breadcrumb className='mt-2'>
                <Breadcrumb.Item href="#">Home</Breadcrumb.Item>
                <Breadcrumb.Item href="#/shop">Store</Breadcrumb.Item>
                <Breadcrumb.Item active>{productName ? productName : (<><i className='fas fa-circle-notch fa-spin me-2'></i>{'Please Wait...'}</>)}</Breadcrumb.Item>
              </Breadcrumb>
            </Col>
          </Row>
        </Container>
      </main>
      <main className='flex-shrink-0'>
        <Container>
          { errorMessage ? <>
             <div className='alert alert-danger'>
                <p>{errorMessage}</p>
             </div>
          </> : <></> }
          <Row>
            <Col md={6}>
              <div className="slider-container text-center">
                  { loadingContent ? <>
                      <Shimmer width={1} className="w-100 border rounded mb-4" height={725} />
                  </> : <>
                    <Slider {...setting}>
                      {images.map((image, index) => {
                        return (
                          <img key={index} src={(image as { path: string }).path} className='card-img-top' alt='' />
                        )
                      })}
                    </Slider>
                  </> }
              </div>
            </Col>
            <Col md={6} className={loadingContent ? '' : 'p-4'}>
                { loadingContent ? <>
                  <Shimmer width={1} className="w-100 border rounded mb-4" height={350} />
                  <Shimmer width={1} className="w-100 border rounded" height={350} />
                </> : <>
                
                  <h3 className="fw-bolder text-uppercase">{productName}</h3>
                  <div className='clearfix mt-3 mb-1'>
                    <div className="small text-warning mb-2">
                      {Array.from({ length: (product as { total_rating: number }).total_rating }, (_, i) => (
                          <StarFill key={i} size={17} />
                      ))}
                      { (product as { total_rating: number }).total_rating < 5 ? <>
                            {Array.from({ length: 5 - (product as { total_rating: number }).total_rating }, (_, j) => (
                              <Star key={j} size={17} />
                            ))}
                      </> : <></> }
                    </div>
                    <a href='#' onClick={(e) => onClickReview(e)} className='text-decoration-none'><small>{reviews.length} Review(s) | Add your review</small></a>
                  </div>
                  <strong className='text-danger me-2'>${parseFloat((product as { price: string }).price)}</strong><del><strong className='text-muted'>${parseFloat((product as { price_old: string }).price_old)}</strong></del><strong className='text-danger ms-2'>IN STOCK</strong>
                  <p className='mt-2'>
                     {(product as { description: string }).description}
                  </p>
                  <div className='clearfix mt-2'>
                    <OverlayTrigger placement="top" delay={{ show: 250, hide: 400 }} overlay={renderTooltip('Add To Wishlist', 'tooltip1')}>
                      <Button variant="btn btn-light border me-1"><Heart className='mb-1' /></Button>
                    </OverlayTrigger>
                    <OverlayTrigger placement="top" delay={{ show: 250, hide: 400 }} overlay={renderTooltip('Add To Compare', 'tooltip2')}>
                      <Button variant="btn btn-light border me-1"><CurrencyExchange className='mb-1' /></Button>
                    </OverlayTrigger>
                    <OverlayTrigger placement="top" delay={{ show: 250, hide: 400 }} overlay={renderTooltip('Quick View', 'tooltip3')}>
                      <Button variant="btn btn-light border me-1"><Eye className='mb-1' /></Button>
                    </OverlayTrigger>
                  </div>
                  <div className='mt-4 text-uppercase'>
                    <span className='text-muted d-inline'>Category :</span>
                    {(product as { categories: unknown[] }).categories.map((category, index) => (
                       <a key={index} onClick={(e) => onClickCategory(e,(category as { id: number }).id)}  className='d-inline ms-1 text-decoration-none' href="#">{(category as { name: string }).name} </a>
                    ))}
                  </div>
                  <div className='text-uppercase mt-2'>
                    <small className='text-muted d-inline'>Share :</small>
                    <a onClick={(e) => onClickShare(e, "https://www.facebook.com/")} className='d-inline ms-1 text-decoration-none' href="#"><Facebook className='mb-1 ms-1' /></a>
                    <a onClick={(e) => onClickShare(e, "https://www.twitter.com/")} className='d-inline ms-1 text-decoration-none' href="#"><Twitter className='mb-1 ms-1' /></a>
                    <a onClick={(e) => onClickShare(e, "https://www.google.com/")} className='d-inline ms-1 text-decoration-none' href="#"><Google className='mb-1 ms-1' /></a>
                    <a onClick={(e) => onClickShare(e, "https://www.instagram.com/")} className='d-inline ms-1 text-decoration-none' href="#"><Instagram className='mb-1 ms-1' /></a>
                  </div>
                  { available > 0 ? <>
                    <div className='text-uppercase mt-2'>
                      <span className='text-muted d-inline fw-bold text-success'>available : {available} pcs</span>
                    </div>
                  </> : <></> }
                  { errors.length > 0 ? <>
                      <div className='alert alert-danger mt-3'>
                          { errors.map((error, index) => {
                              return (<li key={index}>{error}</li>)
                          }) }
                      </div>
                  </> : <></> }
                  <Form className='mt-3'>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3" controlId="formSize">
                          <Form.Label className='fw-bold'>Size <span className='text-danger'>*</span></Form.Label>
                          <Form.Select value={sizeSelected} onChange={handleSizeSelected}>
                            <option value={0} disabled>Please Select Size</option>
                            { sizes.map((obj, index) => {
                               return (
                                  <option key={index} value={(obj as { id: number }).id}>{(obj as { name: string }).name}</option>
                               )
                            }) }
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3" controlId="formQty">
                          <Form.Label className='fw-bold'>Qty <span className='text-danger'>*</span></Form.Label>
                          <InputGroup className="mb-3">
                            <Button variant="bg-danger btn-danger" id="button-addon2" onClick={(e) => handleQty(e, 'minus')}>
                              <BagDash />
                            </Button>
                            <Form.Control
                              readOnly={true}
                              type='text'
                              className='text-center'
                              value={qty}
                            />
                            <Button variant="bg-success btn-success" id="button-addon1" onClick={(e) => handleQty(e, 'plus')}>
                              <BagPlus />
                            </Button>
                          </InputGroup>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3" controlId="formColor">
                          <Form.Label className='fw-bold'>Colour <span className='text-danger'>*</span></Form.Label>
                          <Form.Select value={colourSelected} onChange={handleColourSelected}>
                            <option value={0} disabled>Please Select Colour</option>
                            { colours.map((obj, index) => {
                               return (
                                  <option key={index} value={(obj as { id: number }).id}>{(obj as { name: string }).name}</option>
                               )
                            }) }
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3" controlId="formColor">
                          <Form.Label className='fw-bold text-danger'>$ Total</Form.Label>
                          <NumericFormat value={total} decimalScale={2} readOnly={true} className='form-control text-end fw-bold' thousandSeparator="," />
                        </Form.Group>
                      </Col>
                    </Row>
                    <a onClick={(e) => onSubmitCart(e)} className="btn btn-primary text-white w-100 mt-4" href="#"><CartPlus className='mb-1 me-1' />Add To Cart</a>
                  </Form>
                
                </> }
            </Col>
          </Row>
        </Container>
      </main>
      <main className='flex-shrink-0 mt-5 mb-5'>
        <Container>
          <Row className='mb-2'>
            <Col md={12}>
              <Nav variant="underline" activeKey={tabActive === null ? 'link-3' : tabActive} onSelect={(e) => handleSelect(e)}>
                <Nav.Item className='me-4'>
                  <Nav.Link eventKey="link-1">Description</Nav.Link>
                </Nav.Item>
                <Nav.Item className='me-4'>
                  <Nav.Link eventKey="link-2">Details</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="link-3">Reviews ({reviews.length})</Nav.Link>
                </Nav.Item>
              </Nav>
              <div className='tab-content'>
                <div className={tabActive === 'link-1' ? 'tab-pane container active p-0' : 'tab-pane container'}>
                    { loadingContent ? <>
                       <Shimmer width={1} className="w-100 border rounded mt-3" height={150} />
                    </> : <>
                      <p className='mt-3'>{(product as { description: string }).description}</p>
                    </> }
                </div>
                <div className={tabActive === 'link-2' ? 'tab-pane container active p-0' : 'tab-pane container'}>
                     { loadingContent ? <>
                        <Shimmer width={1} className="w-100 border rounded mt-3" height={150} />
                     </> : <>
                        <p className='mt-3'>{(product as { details: string }).details}</p>
                     </> }
                </div>
                <div className={tabActive === 'link-3' ? 'tab-pane container active p-0' : 'tab-pane container'}>
                  <Row className='mt-3'>
                    <Col md={3}>
                        { loadingReview ? <>
                          <Shimmer width={1} className="w-100 border rounded" height={150} />
                          <Shimmer width={1} className="w-100 border rounded mt-3" height={150} />
                        </> : <>
                        
                          <div className='clearfix'>
                             <h4 className='d-inline me-3'>{(product as { total_rating: number })?.total_rating.toFixed(2)}</h4>
                            <div className="d-inline text-warning">
                               {Array.from({ length: (product as { total_rating: number })?.total_rating }, (_, i) => (
                                  <StarFill key={i} size={25} />
                              ))}
                              { (product as { total_rating: number })?.total_rating < 5 ? <>
                                    {Array.from({ length: 5 - (product as { total_rating: number })?.total_rating }, (_, j) => (
                                      <Star key={j} size={25} />
                                    ))}
                              </> : <></> }
                            </div>
                          </div>
                          <div className='clearfix mt-2'>
                              { reviews.map((row, index) => {
                                  return (
                                    <Row key={index}>
                                        <Col xs={6}>
                                          <div className='text-warning mb-3'>
                                            {Array.from({ length: (row as { rating_index: number }).rating_index }, (_, i) => (
                                                <StarFill key={i} size={15} />
                                            ))}
                                            { (row as { rating_index: number }).rating_index < 5 ? <>
                                              {Array.from({ length: 5 - (row as { rating_index: number }).rating_index }, (_, j) => (
                                                <Star key={j} size={15} />
                                              ))}
                                            </> : <></> }
                                          </div>
                                        </Col>
                                        <Col xs={6}>
                                          <ProgressBar variant="warning" label={`${(row as { percentage: number }).percentage} %`} now={(row as { percentage: number }).percentage} />
                                        </Col>
                                    </Row>
                                  )
                              }) }      
                          </div>
                        </> }
                    </Col>
                    <Col md={6}>
                        { loadingReview ? <>
                           <Shimmer width={1} className="w-100 border rounded" height={150} />
                           <Shimmer width={1} className="w-100 border rounded mt-3" height={150} />
                        </> : <>
                             {reviews.map((row, index) => {
                                return (
                                  <Row key={index}>
                                    <Col xs={4}>
                                      <strong className='d-block'>{(row as { reviewer: string }).reviewer}</strong>
                                      <small className='small'>{(row as { created_at: string }).created_at}</small>
                                      <div className='text-warning mt-2'>
                                          {Array.from({ length: (row as { rating_index: number }).rating_index }, (_, i) => (
                                              <StarFill key={i} size={15} />
                                          ))}
                                          { (row as { rating_index: number }).rating_index < 5 ? <>
                                            {Array.from({ length: 5 - (row as { rating_index: number }).rating_index }, (_, j) => (
                                              <Star key={j} size={15} />
                                            ))}
                                          </> : <></> }
                                      </div>
                                    </Col>
                                    <Col xs={8}>
                                      <p>{(row as { review: string }).review}</p>
                                    </Col>
                                </Row>
                                )
                             })}
                        </> }
                    </Col>
                    <Col md={3}>
                      <Form>
                        <Form.Control type='text' className='mb-2' placeholder='Your Name' readOnly={true} defaultValue={`${(auth_user as { first_name: string }).first_name} ${(auth_user as { last_name: string }).last_name}`} />
                        <Form.Control type='email' className='mb-2' placeholder='Your E-Mail Address' readOnly={true} defaultValue={`${(auth_user as { email: string }).email}`} />
                        <Form.Control as="textarea" className='mb-2' placeholder='Your Review' value={review} onChange={(e) => setReview(e.target.value)} rows={3} />
                        <label className='mt-1'>Your Rating : </label>
                        <Rating style={{ maxWidth: 120 }} value={rating} onChange={handleRating} />
                        <button onClick={(e) => onSubmitReview(e)} className={rating === 0 || review === '' ? `btn btn-primary text-white w-100 mt-2 disabled` : `btn btn-primary text-white w-100 mt-2`}>
                         <Telegram className='mb-1 me-1' />Submit
                        </button>
                      </Form>
                    </Col>
                  </Row>
                </div>
              </div>
            </Col>
          </Row>
          <Row className='mt-4'>
            <Col md={12}>
              <div className="section-title text-center">
                <h3 className="title">Related Products</h3>
              </div>
              <div className="slider-container text-center">
                  { loadingContent ? <>
                      <Row>
                        <Col xs={4}>
                          <Shimmer width={1} className="w-100 border rounded" height={600} />
                        </Col>
                        <Col xs={4}>
                          <Shimmer width={1} className="w-100 border rounded" height={600} />
                        </Col>
                        <Col xs={4}>
                          <Shimmer width={1} className="w-100 border rounded" height={600} />
                        </Col>
                      </Row>
                  </> : <>
                     <RelatedProduct products={related} />
                  </> }
              </div>
            </Col>
          </Row>
        </Container>
      </main>
    </Fragment>
  )
}

export default CartPage