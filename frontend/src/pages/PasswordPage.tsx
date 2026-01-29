import { Fragment, useState } from "react";
import { Row, Col, Container, Card, CardBody, CardHeader, CardFooter } from 'react-bootstrap';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import { useForm } from "react-hook-form"
import { Navigate } from "react-router-dom"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import Service from "../Service";

const schema = yup
  .object({
    current_password: yup.string().required('Current Password').min(6),
    password: yup.string().required('New Password').min(6),
    password_confirm: yup.string().required('Confirm New Password').oneOf([yup.ref('password')], 'Passwords must match'),
  })
  .required()

const PasswordPage = () => {

  const logged: boolean = localStorage.getItem('auth_token') !== undefined && localStorage.getItem('auth_token') !== null
  const [showPassword, setShowPassword] = useState(Boolean);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(Boolean);
  const [showPasswordCurrent, setShowPasswordCurrent] = useState(Boolean);
  const [errorReseponse, setErrorResponse] = useState('')
  const [successReseponse, setSuccessResponse] = useState('')
  const [loading, setLoading] = useState(false)
  const nowYear: number = new Date().getFullYear()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      current_password: "",
      password: "",
      password_confirm: ""
    },
    resolver: yupResolver(schema),
  })

  const onSubmit = (data: unknown) => {

    
    setLoading(true)
    setErrorResponse('')
    setSuccessResponse('')
    setTimeout(async () => {
      await Service.profile.changePassword(data)
        .then(async (response) => {
          const message = response.data
          setLoading(false)
          setErrorResponse('')
          setSuccessResponse(message)
          reset({
            current_password: "",
            password: "",
            password_confirm: ""
          })
        })
        .catch((error) => {
          const msg = error.status === 401 ? Service.expiredMessage : (error.response.data || error.response.data?.message || error.message)
          setLoading(false)
          setErrorResponse(msg)
        })
    }, 2000)
  }

  if (!logged) {
    return <Navigate to="/auth/login" />
  } else {
    return (
      <Fragment>
        <main className="flex-shrink-0 p-3 border-bottom bg-gray text-uppercase mb-5" id="breadcrumb">
          <Container>
            <Row>
              <Col md={12}>
                <Breadcrumb className='mt-2'>
                  <Breadcrumb.Item href="#">Home</Breadcrumb.Item>
                  <Breadcrumb.Item href="#">Profile</Breadcrumb.Item>
                  <Breadcrumb.Item active>Change Password</Breadcrumb.Item>
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
                    <h5 className="text-white"><i className="bi-person-lock me-2"></i>Reset Password</h5>
                  </CardHeader>
                  <CardBody className='mb-2 p-4'>
                    <div className="text-center">
                      <img alt="logo" width="85" className="img img-responsive" src={"https://5an9y4lf0n50.github.io/demo-images/demo-commerce/app.png"} />
                      <p className="mt-2">
                        <small>Enter a new password to reset the password on your account.</small>
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
                            <i className="bi-lock"></i>
                          </span>
                          <input type={showPasswordCurrent ? 'text' : 'password'} id="current_password"  {...register("current_password")} className={`form-control ${errors.current_password ? 'is-invalid' : ''}`} placeholder="Current Password" required />
                          <span className="input-group-text input-group-password" onClick={() => setShowPasswordCurrent(!showPasswordCurrent)} >
                            <i className={showPasswordCurrent ? 'bi-eye' : 'bi-eye-slash'}></i>
                          </span>
                          {errors.current_password ? <>
                            <div className="invalid-feedback">
                              <span className="d-block">
                                {errors.current_password?.message}
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
                      <button type="submit" className={`btn btn-primary border w-100 mt-2 ${loading ? 'disabled' : ''}`} title="Click here to reset password">
                        <i className={`${loading ? 'fas fa-circle-notch fa-spin me-2' : 'bi-box-arrow-right me-2'}`}></i>Reset Password
                      </button>
                    </form>
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

export default PasswordPage