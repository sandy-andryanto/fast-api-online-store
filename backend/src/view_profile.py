"""
 * This file is part of the Sandy Andryanto Online Store Website.
 *
 * @author     Sandy Andryanto <sandy.andryanto.official@gmail.com>
 * @copyright  2025
 *
 * For the full copyright and license information,
 * please view the LICENSE.md file that was distributed
 * with this source code.
"""

from fastapi import APIRouter, Depends, Security, File, UploadFile
from fastapi.responses import JSONResponse
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from fastapi.encoders import jsonable_encoder
from typing import Annotated
from sqlalchemy import or_, and_
from sqlalchemy.orm import Session
from password_strength import PasswordPolicy
from passlib.context import CryptContext
from sqlalchemy.sql import text
from .security import JWTBearer
from .auth import auth_user, signJWT
from .database import get_db
from .schema import *
from .model import *

import shutil
import uuid
import pathlib

view_profile = APIRouter()
security = HTTPBearer()

@view_profile.get("/api/profile/detail",  dependencies=[Depends(JWTBearer())])
def view_profile_me(credentials: HTTPAuthorizationCredentials = Security(security)):
    access_token = credentials.credentials
    user = auth_user(access_token)
    return JSONResponse(content=jsonable_encoder(user), status_code=200)


@view_profile.get("/api/profile/activity",  dependencies=[Depends(JWTBearer())])
def view_profile_activity(
        credentials: HTTPAuthorizationCredentials = Security(security),
        db: Session = Depends(get_db),
        page: int = 1,
        limit: int = 10,
        order_dir: str = "activities.id",
        order_desc: str = "desc",
        search: str | None = None
    ):
   
    offset = ((page-1)*limit)
    access_token = credentials.credentials
    session = auth_user(access_token)
    user_id = session["id"]
    total = db.query(Activity).filter(User.id == user_id).count()
    data = db.query(Activity).order_by(text(f"{order_dir} {order_desc}")).filter(User.id == user_id)
    
    if search != None:
        data = data.filter(or_(Activity.event.ilike(f'%{search}%'), Activity.description.ilike(f'%{search}%')))
        
    data = data.limit(limit).offset(offset)

    payload = {
        "total": total,
        "data": data.all()
    }
   
    return JSONResponse(content=jsonable_encoder(payload), status_code=200)


@view_profile.post("/api/profile/update",  dependencies=[Depends(JWTBearer())])
def view_profile_update(form: UserProfileSchema, db: Session = Depends(get_db), credentials: HTTPAuthorizationCredentials = Security(security)):
    
    date_now = datetime.datetime.now()
    access_token = credentials.credentials
    session = auth_user(access_token)
    user_id = session["id"]
    session_user = db.query(User).filter(User.id == user_id).first()
    
    user_email = db.query(User).filter(and_(User.email == form.email, User.id != user_id)).count()
    if user_email > 0:
        return JSONResponse(content="The e-mail address has already been taken.!", status_code=400)
    
    user_phone = db.query(User).filter(and_(User.phone == form.phone, User.id != user_id)).count()
    if user_phone > 0:
        return JSONResponse(content="The phone number has already been taken.!", status_code=400)
    
    update_user = { 
        'email' : form.email, 
        'phone' : form.phone, 
        'first_name' : form.first_name, 
        'last_name' : form.last_name, 
        'gender' : form.gender, 
        'country' : form.country, 
        'city' : form.city, 
        'address' : form.address, 
        'zip_code' : form.zip_code, 
        'updated_at' : date_now                
    }
    db.query(User).filter(User.id == user_id).update(update_user, synchronize_session=False)
    db.commit()
    
    activity = Activity(
        user = session_user,
        subject = "Update Current User Profile",
        event = "Update Profile",
        description = "Edit user profile account",
        created_at = date_now,
        updated_at = date_now,
    )
    db.add(activity)
    db.commit()
    
    payload = signJWT(form.email)
    payload["message"] = "Your profile has been changed"
    
    return JSONResponse(content=jsonable_encoder(payload), status_code=200)

@view_profile.post("/api/profile/upload",  dependencies=[Depends(JWTBearer())])
def view_profile_upload(file_image: UploadFile = File(...), db: Session = Depends(get_db), credentials: HTTPAuthorizationCredentials = Security(security)):
    
    date_now = datetime.datetime.now()
    access_token = credentials.credentials
    session = auth_user(access_token)
    image = session["image"]
    user_id = session["id"]
    session_user = db.query(User).filter(User.id == user_id).first()
    
    ext = file_image.filename.split(".")[-1]
    file_name = str(uuid.uuid4())
    path = f"uploads/{file_name}.{ext}"
    with open(path, 'w+b') as file:
        shutil.copyfileobj(file_image.file, file)
        
        if image != None:
            pathlib.Path(f"./{image}").unlink(missing_ok=True)
        
        image = path
        
    update_user = { 'image': image,  'updated_at' : date_now }
    db.query(User).filter(User.id == user_id).update(update_user, synchronize_session=False)
    db.commit()
    
    activity = Activity(
        user = session_user,
        subject = "Upload Current User Image",
        event = "Upload Profile Image",
        description = "Upload new user profile image",
        created_at = date_now,
        updated_at = date_now,
    )
    db.add(activity)
    db.commit()
    
    payload = {
        "image": image,
        "message": "Your profile image has been changed"
    }
    
    return JSONResponse(content=jsonable_encoder(payload), status_code=200)

@view_profile.post("/api/profile/password", dependencies=[Depends(JWTBearer())])
def view_profile_password(user: UserPasswordSchema, db: Session = Depends(get_db), credentials: HTTPAuthorizationCredentials = Security(security)):
    
    access_token = credentials.credentials
    session = auth_user(access_token)
    user_id = session["id"]
    session_user = db.query(User).filter(User.id == user_id).first()
    
    date_now = datetime.datetime.now()
    user_password = session_user.password
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    verify = pwd_context.verify(user.current_password, user_password)
    hash_password = pwd_context.hash(user.password)
    
    if user.password != user.password_confirm:
        return JSONResponse(content="Please make sure your passwords match.", status_code=400)
    
    # Check password from current user
    if verify == False:
        return JSONResponse(content="Your password was not updated, since the provided current password does not match.!!", status_code=400)
    
    update_user = { 'password' : hash_password, 'updated_at' : date_now }
    db.query(User).filter(User.id == user_id).update(update_user, synchronize_session=False)
    db.commit()
    
    activity = Activity(
        user = session_user,
        subject = "Update Current User Password",
        event = "Change Password",
        description = "Change new password account",
        created_at = date_now,
        updated_at = date_now,
    )
    db.add(activity)
    db.commit()
    
    return JSONResponse(content="Your password has been changed!!", status_code=200)