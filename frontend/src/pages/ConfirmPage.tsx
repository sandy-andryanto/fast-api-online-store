import { Fragment, useState, useEffect } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import { Row, Col, Container, Card, CardBody, CardHeader, CardFooter } from 'react-bootstrap';
import { NavLink, useParams, Navigate } from "react-router-dom"
import Service from "../Service";

const ConfirmPage = () => {

  const logged: boolean = localStorage.getItem('auth_token') !== undefined && localStorage.getItem('auth_token') !== null
  const nowYear: number = new Date().getFullYear()
  const [loading, setLoading] = useState(true);
  const [errorReseponse, setErrorResponse] = useState('')
  const { token } = useParams();

  const loadContent = async () => {
    await Service.auth.confirm(token!)
      .then(() => {
        setTimeout(() => {
          setLoading(false)
          setErrorResponse('')
        }, 3000)
      })
      .catch((error) => {
        setLoading(false)
        setErrorResponse(error.response.data || error.response.data?.message)
      })
  }


  useEffect(() => {
    loadContent()
  }, [])

  if (logged) {
    return <Navigate to="/" />
  } else {
    return (
      <Fragment>
        <main className="flex-shrink-0 p-3 border-bottom bg-gray text-uppercase mb-5" id="breadcrumb">
          <Container>
            <Row>
              <Col md={12}>
                <Breadcrumb className='mt-2'>
                  <Breadcrumb.Item href="#">Home</Breadcrumb.Item>
                  <Breadcrumb.Item href="#">Authentication</Breadcrumb.Item>
                  <Breadcrumb.Item active>Account Verification</Breadcrumb.Item>
                </Breadcrumb>
              </Col>
            </Row>
          </Container>
        </main>
        <main className="flex-shrink-0 mb-5">
          <Container>
            <Row>
              <Col md={4} className='mx-auto'>
                <Card>
                  <CardHeader className='text-center bg-primary p-2'>
                    <h5 className="text-white"><i className="bi-person-check me-2"></i>Account Verification</h5>
                  </CardHeader>
                  <CardBody className='mb-2  text-center'>
                    {loading ? <>
                      <DotLottieReact src="/animations/checking.json" loop autoplay />
                    </> : <>
                      {errorReseponse ? <>
                       <DotLottieReact src="/animations/checking.json" loop autoplay />
                        <div className="alert alert-danger">
                          <span>{errorReseponse}</span>
                        </div>
                      </> : <>
                        <DotLottieReact src="/animations/confirmed.json" loop autoplay />
                        <div className="alert alert-success">
                          <small>Your registration is complete. Now you can login</small>
                        </div>
                        <NavLink className="btn btn-primary mt-2 w-100" to="/auth/login">
                          <i className="bi-box-arrow-right me-2"></i>Please login here.
                        </NavLink>
                      </>}
                    </>}
                  </CardBody>
                  <CardFooter className='p-3 text-center bg-primary'>
                    <span className="text-white">
                      <small>Copyright {nowYear} - Elector Store</small>
                    </span>
                  </CardFooter>
                </Card>
              </Col>
            </Row>
          </Container>
        </main>
      </Fragment>
    )
  }
}

export default ConfirmPage