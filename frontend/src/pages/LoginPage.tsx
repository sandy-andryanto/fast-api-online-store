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
    email: yup.string().email().required(),
    password: yup.string().required().min(6),
    remember: yup.string()
  })
  .required()

const LoginPage = () => {

  const [showPassword, setShowPassword] = useState(false);
  const [errorReseponse, setErrorResponse] = useState('')
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
      remember: ""
    },
    resolver: yupResolver(schema),
  })

  const onSubmit = (data: unknown) => {
    setLoading(true)
    setErrorResponse('')
    setTimeout(async () => {
      await Service.auth.login(data)
        .then(async (response) => {

          setLoading(false)
          setErrorResponse('')

          const token = response.data.access_token
          if (!localStorage.getItem('auth_token')) {
            localStorage.setItem('auth_token', token)
          }

          const profile = await Service.profile.detail()
          if (!localStorage.getItem('auth_user')) {
            localStorage.setItem('auth_user', JSON.stringify(profile.data))
          }

        })
        .catch((error) => {
          setLoading(false)
          setErrorResponse(error.response.data || error.response.data?.message)
        })
    }, 2000)
  }

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
                  <Breadcrumb.Item active>Login</Breadcrumb.Item>
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
                    <h5 className="text-white"><i className="bi-person-lock me-2"></i>Login to your account</h5>
                  </CardHeader>
                  <CardBody className='mb-2 p-4'>
                    <div className="text-center">
                      <img alt="logo" width="85" className="img img-responsive" src={"https://5an9y4lf0n50.github.io/demo-images/demo-commerce/app.png"} />
                      <p className="mt-2">
                        <small>Please sign in with your e-mail address and correct password.</small>
                      </p>
                    </div>
                    {errorReseponse !== '' ? <>
                      <div className="alert alert-danger">
                        <span>{errorReseponse}</span>
                      </div>
                    </> : <></>}
                    <form onSubmit={handleSubmit(onSubmit)} noValidate={true}>
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
                          <input type={showPassword ? 'text' : 'password'} id="password" {...register("password")} className={`form-control ${errors.password ? 'is-invalid' : ''}`} disabled={loading} placeholder="Credential Password" required />
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
                      <div className="clearfix mb-3">
                        <div className="form-check float-start">
                          <label className="form-check-label">
                            <input className="form-check-input" type="checkbox" {...register("remember")} /> Remember Me
                          </label>
                        </div>
                        <div className="float-end">
                          <NavLink to="/auth/email/forgot">
                            <small className="fw-bold">Forgot Password ?</small>
                          </NavLink>
                        </div>
                      </div>
                      <button type="submit" className={`btn btn-primary border w-100 mt-2 ${loading ? 'disabled' : ''}`} title="Click here to sign in">
                        <i className={`${loading ? 'fas fa-circle-notch fa-spin me-2' : 'bi-box-arrow-right me-2'}`}></i>Sign In Now
                      </button>
                    </form>
                    <div className="text-center mt-3">
                      <small>Don't have an account ? <NavLink to="/auth/register">Sign Up Now</NavLink></small>
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

export default LoginPage