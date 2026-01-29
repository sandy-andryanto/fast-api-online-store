import { Fragment, useEffect, useState } from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import Form from 'react-bootstrap/Form';
import { CartCheck } from 'react-bootstrap-icons';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import Service from '../Service';
import { Shimmer } from 'react-shimmer';
import { yupResolver } from "@hookform/resolvers/yup"
import { useForm } from "react-hook-form"
import * as yup from "yup"
import Swal from 'sweetalert2';

interface Props {
  onloadOrder: () => void
}

interface IUser {
  id: number,
  email: string,
  phone: string,
  image: string,
  first_name: string,
  last_name: string,
  country: string,
  city: string,
  zip_code: string,
  address: string,
  notes:string
}

const schema = yup
  .object({
    email: yup.string().email().required('E-Mail Address is a required field'),
    first_name: yup.string().required('First Name is a required field'),
    last_name: yup.string(),
    phone: yup.string().required('Phone Number is a required field'),
    city: yup.string().required('City is a required field'),
    country: yup.string().required('Country is a required field'),
    zip_code: yup.string().required('Zip Code is a required field'),
    address: yup.string().required('Address is a required field'),
    notes: yup.string(),
  })
  .required()

const CheckoutPage =({ onloadOrder }: Props) => {

  const logged: boolean = localStorage.getItem('auth_token') !== undefined && localStorage.getItem('auth_token') !== null
  const [payment, setPayment] = useState(0);
  const [agreement, setAgreement] = useState(false);
  const navigate = useNavigate();
  const [loadingContent, setLoadingContent] = useState(true);
  const [carts, setCarts] = useState(Array<unknown>);
  const [order, setOrder] = useState<unknown>(null);
  const [payments, setPayments] = useState(Array<unknown>);
  const [user, setUser] = useState<IUser>()
  const [errorMessage, setErrorMessage] = useState('')
 
   
  const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm({
      resolver: yupResolver(schema),
      values: user
    })
  
  const onSubmit = async (data: unknown) => {

    const orderId = (order as { id: number }).id

    const result = await Swal.fire({
      title: 'Confirm Checkout ?',
      text: 'Are you sure you want to place your order?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Checkout',
      cancelButtonText: 'Cancel',
      showLoaderOnConfirm: true,
      allowOutsideClick: () => !Swal.isLoading(),
      preConfirm: async () => {
        try {
         
          let formData = {
             payment_id: payment
          }

          formData = {
             ...formData,
             ...(data as object)
          }

          const res = await Service.order.checkout(formData)
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
        title: 'Checkout Success',
        text: 'Your order been successfully checkout.'
      });
      onloadOrder()
      setTimeout(() => { 
          navigate(`/order/detail/${orderId}`)
      }, 1500)
    }

  }

  const loadContent = async () => {
      setLoadingContent(true)
      await Service.order.billing()
        .then((result) => {
          const data = result.data
          setTimeout(() => { 
            setCarts(data.carts)
            setOrder(data.order)
            setPayments(data.payments)
            setUser(data.user)
            setLoadingContent(false)
          }, 1500)
        })
        .catch((error) => {
          const message =
                error instanceof Error
                  ? error.message
                  : typeof error === 'string'
                  ? error
                  : 'An unknown error occurred';
              setErrorMessage(message)
        })
    }
   
  useEffect(() => {
  
        if(!logged){
          navigate(`/auth/login`)
        }
  
        loadContent() 
    }, []);

  return (
    <Fragment>
      <main className="flex-shrink-0 p-3 border-bottom bg-gray text-uppercase mb-5" id="breadcrumb">
        <Container>
          <Row>
            <Col md={12}>
              <Breadcrumb className='mt-2'>
                <Breadcrumb.Item href="#">Home</Breadcrumb.Item>
                <Breadcrumb.Item href="#">Order</Breadcrumb.Item>
                <Breadcrumb.Item active>Checkout</Breadcrumb.Item>
              </Breadcrumb>
            </Col>
          </Row>
        </Container>
      </main>
      <main className="flex-shrink-0 mb-4">
        <Container>
            { errorMessage ? <>
              <div className='alert alert-danger'>
                  <p>{errorMessage}</p>
              </div>
            </> : <></> }
            { loadingContent ? <>
                 <Row>
                   <Col md={5}>
                      <Shimmer width={1} className="w-100 border rounded mb-3" height={350} />
                   </Col>
                   <Col md={7}>
                      <Shimmer width={1} className="w-100 border rounded mb-3" height={350} />
                   </Col>
                 </Row>
            </> : <>
               <form onSubmit={handleSubmit(onSubmit)} noValidate={true}>
                  <Row>
                    <Col md={5}>
                        <h3 className='text-uppercase mb-3'>Billing address</h3>
                        <Form.Group className='mb-3'>
                          <Form.Label>First Name <span className='text-danger'>*</span></Form.Label>
                          <input type="text" {...register("first_name")} className={`form-control ${errors.first_name ? 'is-invalid' : ''}`}  placeholder="Enter Your First Name" required />
                            {errors.first_name ? <>
                              <div className="invalid-feedback">
                                <span className="d-block">
                                  {errors.first_name?.message}
                                </span>
                              </div>
                            </> : <></>}
                        </Form.Group>
                        <Form.Group className='mb-3'>
                          <Form.Label>Last Name <span className='text-danger'>*</span></Form.Label>
                          <input type="text"  {...register("last_name")} className={`form-control ${errors.last_name ? 'is-invalid' : ''}`}  placeholder="Enter Your Last Name" required />
                          {errors.last_name ? <>
                            <div className="invalid-feedback">
                              <span className="d-block">
                                {errors.last_name?.message}
                              </span>
                            </div>
                          </> : <></>}
                        </Form.Group>
                        <Form.Group className='mb-3'>
                          <Form.Label>E-Mail Address <span className='text-danger'>*</span></Form.Label>
                            <input type="email"  {...register("email")} className={`form-control ${errors.email ? 'is-invalid' : ''}`}  placeholder="Enter Your E-Mail Address" required />
                            {errors.email ? <>
                              <div className="invalid-feedback">
                                <span className="d-block">
                                  {errors.email?.message}
                                </span>
                              </div>
                            </> : <></>}
                        </Form.Group>
                        <Form.Group className='mb-3'>
                          <Form.Label>Phone Number <span className='text-danger'>*</span></Form.Label>
                          <input type="text"  {...register("phone")} className={`form-control ${errors.phone ? 'is-invalid' : ''}`} placeholder="Enter Your Phone Number" required />
                          {errors.phone ? <>
                            <div className="invalid-feedback">
                              <span className="d-block">
                                {errors.phone?.message}
                              </span>
                            </div>
                          </> : <></>}
                        </Form.Group>
                        <Form.Group className='mb-3'>
                          <Form.Label>City <span className='text-danger'>*</span></Form.Label>
                          <input type="text"  {...register("city")} className={`form-control ${errors.city ? 'is-invalid' : ''}`}  placeholder="Enter Your City" required />
                          {errors.city ? <>
                            <div className="invalid-feedback">
                              <span className="d-block">
                                {errors.city?.message}
                              </span>
                            </div>
                          </> : <></>}
                        </Form.Group>
                        <Form.Group className='mb-3'>
                          <Form.Label>Country <span className='text-danger'>*</span></Form.Label>
                          <input type="text"  {...register("country")} className={`form-control ${errors.country ? 'is-invalid' : ''}`}  placeholder="Enter Your Country" required />
                          {errors.country ? <>
                            <div className="invalid-feedback">
                              <span className="d-block">
                                {errors.country?.message}
                              </span>
                            </div>
                          </> : <></>}
                        </Form.Group>
                        <Form.Group className='mb-3'>
                          <Form.Label>Zip Code <span className='text-danger'>*</span></Form.Label>
                          <input type="text"  {...register("zip_code")} className={`form-control ${errors.zip_code ? 'is-invalid' : ''}`} placeholder="Enter Your Zip Code" required />
                          {errors.zip_code ? <>
                            <div className="invalid-feedback">
                              <span className="d-block">
                                {errors.zip_code?.message}
                              </span>
                            </div>
                          </> : <></>}
                        </Form.Group>
                        <Form.Group className='mb-3'>
                          <Form.Label>Street Address <span className='text-danger'>*</span></Form.Label>
                          <textarea rows={3} placeholder='Enter Your Street Address'  {...register("address")} className={`form-control ${errors.address ? 'is-invalid' : ''}`} ></textarea>
                          {errors.address ? <>
                            <div className="invalid-feedback">
                              <span className="d-block">
                                {errors.address?.message}
                              </span>
                            </div>
                          </> : <></>}
                        </Form.Group>
                        <Form.Group className='mb-3'>
                          <Form.Label>Notes </Form.Label>
                        <textarea rows={3} placeholder='Enter Your Notes'  {...register("notes")} className={`form-control ${errors.notes ? 'is-invalid' : ''}`} ></textarea>
                        </Form.Group>
                    </Col>
                    <Col md={7}>
                      <h3 className='text-uppercase mb-3'>details order</h3>
                        <div className='card'>
                        <div className='card-body'>
                          { carts.map((cart, index) => {
                              return (
                                 <Row className='mb-2' key={index}>
                                    <Col md={3} className='text-center'>
                                      <img src={(cart as { image: string }).image} className='img-responsive' width={120} alt="" />
                                    </Col>
                                    <Col md={7} className='text-start p-3'>
                                      <a href='#' className='text-decoration-none text-uppercase text-muted d-block mt-3'>
                                        <strong>{(cart as { name: string }).name}</strong>
                                      </a>
                                      <span className='d-block mb-2 text-danger fw-bold'>
                                        {(cart as { qty: number }).qty} x <strong>${(cart as { price: number }).price.toFixed(2)}</strong>
                                      </span>
                                    </Col>
                                    <Col md={2} className='text-end p-3'>
                                      <h6 className='text-danger fw-bold mt-4'>${(cart as { total: number }).total.toFixed(2)}</h6>
                                    </Col>
                                </Row>
                              )
                          }) }
                          <div className='border-top'></div>
                          <Row className='mb-1 p-2 mt-2'>
                            <Col md={3}>
                              <h6 className='text-start text-muted fw-bold text-uppercase'>subtotal</h6>
                            </Col>
                            <Col className='text-end'>
                              <h6 className='text-danger fw-bold'>${(order as { subtotal: number }).subtotal.toFixed(2)}</h6>
                            </Col>
                          </Row>
                          <Row className='mb-1 p-2'>
                            <Col md={3}>
                              <h6 className='text-start text-muted fw-bold text-uppercase'>Shiping</h6>
                            </Col>
                            <Col className='text-end'>
                              <h6 className='text-danger fw-bold'>${(order as { total_shipment: number }).total_shipment.toFixed(2)}</h6>
                            </Col>
                          </Row>
                          <Row className='mb-1 p-2'>
                            <Col md={3}>
                              <h6 className='text-start text-muted fw-bold text-uppercase'>Taxes (5%)</h6>
                            </Col>
                            <Col className='text-end'>
                              <h6 className='text-danger fw-bold'>${(order as { total_taxes: number }).total_taxes.toFixed(2)}</h6>
                            </Col>
                          </Row>
                          <Row className='mb-1 p-2'>
                            <Col md={3}>
                              <h6 className='text-start text-muted fw-bold text-uppercase'>Discount (5%)</h6>
                            </Col>
                            <Col className='text-end'>
                              <h6 className='text-success fw-bold'>${(order as { total_discount: number }).total_discount.toFixed(2)}</h6>
                            </Col>
                          </Row>
                          <Row className='mb-1 p-2'>
                            <Col md={3}>
                              <h3 className='text-start text-muted fw-bold text-uppercase'>TOTAL</h3>
                            </Col>
                            <Col className='text-end'>
                              <h3 className='text-danger fw-bold'>${(order as { total_paid: number }).total_paid.toFixed(2)}</h3>
                            </Col>
                          </Row>
                          <Row className='mb-1 p-2'>
                            <Col md={12}>
                              { payments.map((row, index) => {
                                  return (
                                    <Fragment key={index}>
                                      <Form.Check className='mb-1' name='payment' id='payment1' value={(row as { id: number }).id} type={'radio'} onChange={(e) => setPayment(e.target.checked ? (row as { id: number }).id : 0)} label={(row as { name: string }).name} />
                                      <p className={payment === (row as { id: number }).id ? 'd-block p-1' : 'd-none'}>
                                        <small>
                                          {(row as { description: string }).description}
                                        </small>
                                      </p>
                                    </Fragment>
                                  )
                              }) }
                              <Form.Check className='mt-3' type={'checkbox'} onChange={(e) => { setAgreement(e.target.checked) }} label={"I've read and accept the terms & conditions"} />
                              <Button type='submit' variant="bg-dark btn-primary btn-lg w-100 mt-4" disabled={!agreement || payment === 0}>
                                <CartCheck className='mb-1 me-1' />Place order
                              </Button>
                            </Col>
                          </Row>
                        </div>
                      </div>
                    </Col>
                  </Row>
               </form>
            </> }
        </Container>
      </main>
    </Fragment>
  )
}

export default CheckoutPage