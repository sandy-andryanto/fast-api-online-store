import { Fragment } from "react/jsx-runtime"
import { NavLink, useNavigate, useParams } from "react-router-dom"
import { useEffect, useState } from "react";
import Service from "../Service";
import { Col, Container, Row } from "react-bootstrap";
import { Shimmer } from "react-shimmer";

const OrderDetailPage = () => {

    const logged: boolean = localStorage.getItem('auth_token') !== undefined && localStorage.getItem('auth_token') !== null
    const navigate = useNavigate();
    const [loadingContent, setLoadingContent] = useState(true);
    const [carts, setCarts] = useState(Array<unknown>);
    const [order, setOrder] = useState<unknown>(null);
    const [payment, setPayment] = useState<unknown>(null);
    const [billing, setBilling] = useState<unknown>(null);
    const [errorMessage, setErrorMessage] = useState('')
    const { id } = useParams();

    const loadContent = async () => {
        setLoadingContent(true)
        await Service.order.detail(parseInt((id ?? '0').toString()))
        .then((result) => {
            const data = result.data
            setTimeout(() => { 
                setCarts(data.carts)
                setOrder(data.order)
                setBilling(data.billing)
                setPayment(data.payment)
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
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb mt-2">
                                <li className="breadcrumb-item"><a href="#">Home</a></li>
                                <li className="breadcrumb-item"><a href="#/order">Order</a></li>
                                <li className="breadcrumb-item active" aria-current="page">Detail</li>
                            </ol>
                        </nav>
                    </div>
                </div>
            </div>
        </main>
        <main className="flex-shrink-0 p-3 mb-5">
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
                    <Row>
                        <Col md={5}>
                            <h3 className='text-uppercase mb-3 text-center'>Details Invoice</h3>
                             <table className="table mt-2 mb-4 border">
                                <tbody>
                                    <tr>
                                        <td>Invoice Number</td>
                                        <td>:</td>
                                        <td width="350">{(order as { invoice_number: string }).invoice_number}</td>
                                    </tr>
                                    <tr>
                                        <td>Invoice Date</td>
                                        <td>:</td>
                                        <td>{(order as { created_at: string }).created_at}</td>
                                    </tr>
                                    <tr>
                                        <td>Payment</td>
                                        <td>:</td>
                                        <td>{(payment as { name: string })?.name}</td>
                                    </tr>
                                    <tr>
                                        <td>Status</td>
                                        <td>:</td>
                                        <td>
                                            { (order as { status: number }).status === 1 ? <>
                                                <span className="badge bg-success">Completed</span>
                                            </> : <>
                                                <span className="badge bg-danger">Draft</span>
                                            </> }
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <h3 className='text-uppercase mb-3 text-center'>Billing address</h3>
                            <table className="table mt-2 border">
                                <tbody>
                                    <tr>
                                        <td>First Name</td>
                                        <td>:</td>
                                        <td width="350">{(billing as { first_name: string })?.first_name}</td>
                                    </tr>
                                    <tr>
                                        <td>Last Name</td>
                                        <td>:</td>
                                        <td>{(billing as { last_name: string })?.last_name}</td>
                                    </tr>
                                    <tr>
                                        <td>E-Mail Address</td>
                                        <td>:</td>
                                        <td>{(billing as { email: string })?.email}</td>
                                    </tr>
                                    <tr>
                                        <td>Phone Number</td>
                                        <td>:</td>
                                        <td>{(billing as { phone: string })?.phone}</td>
                                    </tr>
                                    <tr>
                                        <td>City</td>
                                        <td>:</td>
                                        <td>{(billing as { city: string })?.city}</td>
                                    </tr>
                                    <tr>
                                        <td>Country</td>
                                        <td>:</td>
                                        <td>{(billing as { country: string })?.country}</td>
                                    </tr>
                                    <tr>
                                        <td>Zip Code</td>
                                        <td>:</td>
                                        <td>{(billing as { zip_code: string })?.zip_code}</td>
                                    </tr>
                                    <tr>
                                        <td>Street Address</td>
                                        <td>:</td>
                                        <td>{(billing as { address: string })?.address}</td>
                                    </tr>
                                    <tr>
                                        <td>Notes</td>
                                        <td>:</td>
                                        <td>{(billing as { notes: string })?.notes}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </Col>
                        <Col md={7}>
                          <h3 className='text-uppercase mb-3 text-center'>Details Order</h3>
                          <div className="card">
                              <div className="card-body">
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
                              </div>
                          </div>
                        </Col>
                    </Row>
                    <NavLink to={'/order/list'} className="btn btn-primary mt-2">
                       <i className="fa fa-arrow-left me-2"></i>Back To List Order
                    </NavLink>
                </> }
            </Container>
        </main>
     </Fragment>
   )
}

export default OrderDetailPage