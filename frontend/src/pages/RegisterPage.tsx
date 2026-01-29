import { Fragment, useState } from "react";
import { Row, Col, Container, Card, CardBody, CardHeader, CardFooter } from 'react-bootstrap';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import { NavLink, Navigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import Service from "../Service";

const schema = yup
  .object({
    name: yup.string().required('Person name is a required').min(3),
    email: yup.string().email().required(),
    password: yup.string().required().min(6),
    password_confirm: yup.string().required().oneOf([yup.ref('password')], 'Passwords must match'),
  })
  .required()

const RegisterPage = () => {

  const [showPassword, setShowPassword] = useState(Boolean);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(Boolean);
  const [errorReseponse, setErrorResponse] = useState('')
  const [successReseponse, setSuccessResponse] = useState('')
  const [redirect, setRedirect] = useState('')
  const [loading, setLoading] = useState(false)
  const nowYear: number = new Date().getFullYear()
  const logged: boolean = localStorage.getItem('auth_token') !== undefined && localStorage.getItem('auth_token') !== null

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
      password_confirm: "",
      name: ""
    },
    resolver: yupResolver(schema),
  })

  const onSubmit = (data: unknown) => {
    setLoading(true)
    setErrorResponse('')
    setSuccessResponse('')
    setTimeout(async () => {
      await Service.auth.register(data)
        .then(async (response) => {
          const message = response.data.message
          const token = response.data.token
          setLoading(false)
          setErrorResponse('')
          setSuccessResponse(message)
          setTimeout(() => {
            setRedirect(`/auth/register/confirm/${token}`)
          }, 2000)
        })
        .catch((error) => {
          setLoading(false)
          setErrorResponse(error.response.data?.message || error.response.data)
        })
    }, 2000)
  }

  if (logged) {
    return <Navigate to="/" />
  } else if (redirect) {
    return <Navigate to={redirect} />
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
                  <Breadcrumb.Item active>Register</Breadcrumb.Item>
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
                    <h5 className="text-white"><i className="bi-person-plus me-2"></i>Sign Up New Account</h5>
                  </CardHeader>
                  <CardBody className='mb-2 p-4'>
                    <div className="text-center">
                      <img alt="logo" width="85" className="img img-responsive" src={"https://5an9y4lf0n50.github.io/demo-images/demo-commerce/app.png"} />
                      <p className="mt-2">
                        <small>Please fill in form to create new account.</small>
                      </p>
                    </div>
                    {errorReseponse !== '' ? <>
                      <div className="alert alert-danger">
                        <span>{errorReseponse}</span>
                      </div>
                    </> : <></>}
                    {successReseponse !== '' ? <>
                      <div className="alert alert-success">
                        <span>{successReseponse}</span>
                      </div>
                    </> : <></>}
                    <form onSubmit={handleSubmit(onSubmit)} noValidate={true}>
                      <div className="mb-3 mt-2">
                        <div className="input-group mb-3">
                          <span className="input-group-text">
                            <i className="bi-person-circle"></i>
                          </span>
                          <input type="text" id="name" {...register("name")} className={`form-control ${errors.name ? 'is-invalid' : ''}`} disabled={loading} placeholder="Full Name" required />
                          {errors.name ? <>
                            <div className="invalid-feedback">
                              <span className="d-block">
                                {errors.name?.message}
                              </span>
                            </div>
                          </> : <></>}
                        </div>
                      </div>
                      <div className="mb-3 mt-2">
                        <div className="input-group mb-3">
                          <span className="input-group-text">
                            <i className="bi-envelope"></i>
                          </span>
                          <input type="email" id="email" {...register("email")} className={`form-control ${errors.email ? 'is-invalid' : ''}`} disabled={loading} placeholder="Email Address" required />
                          {errors.email ? <>
                            <div className="invalid-feedback">
                              <span className="d-block">
                                {errors.email?.message}
                              </span>
                            </div>
                          </> : <></>}
                        </div>
                      </div>
                      <div className="mb-3 mt-2">
                        <div className="input-group mb-3">
                          <span className="input-group-text">
                            <i className="bi-lock"></i>
                          </span>
                          <input type={showPassword ? 'text' : 'password'} id="password" {...register("password")} className={`form-control ${errors.password ? 'is-invalid' : ''}`} disabled={loading} placeholder="Account Password" required />
                          <span className="input-group-text input-group-password" onClick={() => setShowPassword(!showPassword)} >
                            <i className={showPassword ? 'bi-eye' : 'bi-eye-slash'}></i>
                          </span>
                          {errors.password ? <>
                            <div className="invalid-feedback">
                              <span className="d-block">
                                {errors.password?.message}
                              </span>
                            </div>
                          </> : <></>}
                        </div>
                      </div>
                      <div className="mb-3 mt-2">
                        <div className="input-group mb-3">
                          <span className="input-group-text">
                            <i className="bi-lock"></i>
                          </span>
                          <input type={showPasswordConfirm ? 'text' : 'password'} id="password_confirm" {...register("password_confirm")} className={`form-control ${errors.password_confirm ? 'is-invalid' : ''}`} disabled={loading} placeholder="Confirm Account Password" required />
                          <span className="input-group-text input-group-password" onClick={() => setShowPasswordConfirm(!showPasswordConfirm)} >
                            <i className={showPasswordConfirm ? 'bi-eye' : 'bi-eye-slash'}></i>
                          </span>
                          {errors.password_confirm ? <>
                            <div className="invalid-feedback">
                              <span className="d-block">
                                {errors.password_confirm?.message}
                              </span>
                            </div>
                          </> : <></>}
                        </div>
                      </div>
                      <button type="submit" className={`btn btn-primary border w-100 mt-2 ${loading ? 'disabled' : ''}`} title="Click here to registration">
                        <i className={`${loading ? 'fas fa-circle-notch fa-spin me-2' : 'bi-box-arrow-right me-2'}`}></i>Sign Up Now
                      </button>
                    </form>
                    <div className="text-center mt-3">
                      <small>Already have an account ? <NavLink to="/auth/login">Back To Sign In</NavLink></small>
                    </div>
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

export default RegisterPage