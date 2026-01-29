"""
 * This file is part of the Sandy Andryanto Online Store Website.
 *
 * @author     Sandy Andryanto <sandy.andryanto.blade@gmail.com>
 * @copyright  2025
 *
 * For the full copyright and license information,
 * please view the LICENSE.md file that was distributed
 * with this source code.
"""

from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from fastapi.templating import Jinja2Templates
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from password_strength import PasswordPolicy
from passlib.context import CryptContext
from faker import Faker
from random import randint
from .model import *
from .auth import signJWT
from .database import get_db
from .schema import * 
from datetime import datetime, timedelta


view_auth = APIRouter()

@view_auth.post("/api/auth/login")
def view_auth_login(user: UserLoginSchema, db: Session = Depends(get_db)):
    
    auth_user =  db.query(User).filter(User.email == user.email).first()
    
    if auth_user != None:
        
        date_now = datetime.now()
        user_password = auth_user.password
        pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
        verify = pwd_context.verify(user.password, user_password)
        
        # Check password from current user
        if verify == False:
            return JSONResponse(content="The password your entered is incorrect. Please try again.", status_code=401)
        
        # Check Confirmation
        verification = db.query(Authentication).filter(and_(Authentication.user == auth_user, Authentication.status == 1, Authentication.type == 'email-confirm')).count()
        if verification == 0:
            return JSONResponse(content="We have sent you an email confirmation. Please confirm your email and then we will active your account.", status_code=401)
        
        activity = Activity(
            user = auth_user,
            subject = "Sign In To Application",
            event = "Sign In",
            description = "Sign in to application",
            created_at = date_now,
            updated_at = date_now,
        )
        db.add(activity)
        db.commit()
        
        return signJWT(auth_user.email)
        
    # Account was not founded
    return JSONResponse(content="You have entered an invalid credential and password. Please try again.", status_code=401)


@view_auth.post("/api/auth/register")
def view_auth_register(form: UserRegisterSchema, db: Session = Depends(get_db)):
    
    now = datetime.now()
    expired_date = now + timedelta(minutes=30)
    user_email = db.query(User).filter(User.email == form.email).first()
    
    if user_email != None:
        return JSONResponse(content="User with e-mail address `"+form.email+"` already exists. Please try with another one.", status_code=400)
    
    if form.password != form.password_confirm:
        return JSONResponse(content="Please make sure your passwords match.", status_code=400)
        
    fake = Faker()
    policy = PasswordPolicy.from_names(length=8, uppercase=1, numbers=1,  special=1, nonletters=1)
    check_policy = policy.test(form.password)
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    hash_password = pwd_context.hash(form.password)
    
    if len(check_policy) > 0:
        return JSONResponse(content="Password is weak. Recommended passwords contain at least 8 characters, one uppercase, one lowercase, one number, and one special character.", status_code=400)
    
    
    first_name = None
    last_name = None
    names = form.name.split(" ")
    length = len(names)
    token = fake.uuid4()
    
    if length > 1:
        sliced = names[1:]
        first_name = names[0]
        last_name = " ".join(sliced)
    else:
        first_name = names[0]
    
    new_user = User(
        first_name = first_name,
        last_name = last_name,
        email = form.email,
        password = hash_password,
        updated_at = now,
        status = 0
    )
    
    authentication = Authentication(
        user = new_user,
        type = 'email-confirm',
        credential = form.email,
        expired_at = expired_date,
        status = 0,
        token = token
    )
    
    activity = Activity(
        user = new_user,
        subject = "Sign Up To Application",
        event = "Sign Up",
        description = "Register new user account",
        created_at = now,
        updated_at = now,
    )
    
    db.add(activity)   
    db.add(authentication)
    db.add(new_user)
    db.commit()
    
    payload = {
        'message': 'Your account has been created. Please check your email for the confirmation message we just sent you',
        'token': token
    }
    
    return JSONResponse(content=jsonable_encoder(payload), status_code=200)

@view_auth.get("/api/auth/confirm/{token}")
def view_auth_confirm(token: str, db: Session = Depends(get_db)):
    
    now = datetime.now()
    confirmation = db.query(Authentication).filter(and_(Authentication.token == token, Authentication.status == 0)).first()
   
    if not confirmation:
        return JSONResponse(content="This e-mail confirmation token is invalid.", status_code=400)
    
    
    update_user = {
        'status' : 1,
        'updated_at' : now
    }
    db.query(User).filter(User.id == confirmation.user_id).update(update_user, synchronize_session=False)
    
    update_confirm = {
        'status': 2,
        'expired_at': now
    }
    db.query(Authentication).filter(Authentication.token == token).update(update_confirm, synchronize_session=False)
    
    activity = Activity(
        user = confirmation.user,
        subject = "Confirmation",
        event = "E-mail Confirmation",
        description = "Your has been confirmed a registration account.",
        created_at = now,
        updated_at = now,
    )
    db.add(activity)
    db.commit()
    
    
    return JSONResponse(content="Your e-mail is verified. You can now login.", status_code=200)

@view_auth.post("/api/auth/email/forgot")
def view_auth_email_forgot(form: UserForgotSchema, db: Session = Depends(get_db)):
    
    fake = Faker()
    date_now = datetime.now()
    expired_date = date_now + timedelta(minutes=30)
    auth_user = db.query(User).filter(User.email == form.email).first()
    token = fake.uuid4()
    
    if auth_user == None:
        return JSONResponse(content="We can't find a user with that e-mail address.", status_code=400)
    
    authentication = Authentication(
        user = auth_user,
        type = 'reset-password',
        credential = form.email,
        expired_at = expired_date,
        status = 0,
        token = token
    )
    
    activity = Activity(
        user = auth_user,
        subject = "Confirmation",
        event = "E-mail Confirmation",
        description = "Your has been confirmed a registration account.",
        created_at = date_now,
        updated_at = date_now,
    )
    
    db.add(authentication)
    db.add(activity)
    db.commit()
    
    payload = {
        'message': "An email has been sent to "+auth_user.email+" with further password reset information. Thank you.",
        'token': token
    }
    
    return JSONResponse(content=jsonable_encoder(payload), status_code=200)

@view_auth.post("/api/auth/email/reset/{token}")
def view_auth_email_reset(token: str, form: UserResetSchema, db: Session = Depends(get_db)):
    
    date_now = datetime.now()
    password_reset = db.query(Authentication).filter(and_(Authentication.token == token, Authentication.credential == form.email, Authentication.status == 0)).first()
   
    if not password_reset:
        return JSONResponse(content="We can't find a user with that e-mail address or password reset token is invalid.", status_code=400)
    
    if form.password != form.password_confirm:
        return JSONResponse(content="Please make sure your passwords match.", status_code=400)
        
    policy = PasswordPolicy.from_names(length=8, uppercase=1, numbers=1,  special=1, nonletters=1)
    check_policy = policy.test(form.password)
        
    if len(check_policy) > 0:
        return JSONResponse(content="This password reset token is invalid.", status_code=400)
            
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    hash_password = pwd_context.hash(form.password)
    
    update_user = {
        'status' : 1,
        'password': hash_password,
        'password': None,
        'updated_at' : date_now
    }
    db.query(User).filter(User == password_reset.user).update(update_user, synchronize_session=False)
    
    update_password = {
        'status': 2,
        'expired_at': date_now
    }
    db.query(Authentication).filter(Authentication.token == token).update(update_password, synchronize_session=False)
    
    activity = Activity(
        user = password_reset.user,
        subject = "Update Current Password",
        event = "Reset Password",
        description = "Your has been changed a current password.",
        created_at = date_now,
        updated_at = date_now,
    )
    db.add(activity)
    db.commit()
    
    return JSONResponse(content="You have successfully updated your password.", status_code=200)