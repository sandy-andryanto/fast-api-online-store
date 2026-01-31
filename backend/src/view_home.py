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

from fastapi import APIRouter, Depends, Request
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session
from random import randint
from sqlalchemy import or_, and_, desc, func
from .database import get_db
from .schema import *
from .model import *

import math
import random

view_home = APIRouter()

@view_home.get("/api/ping")
def ping():
    payload = {
        "status": True,
        "message": 'Connected Established !!'
    }
    return JSONResponse(content=jsonable_encoder(payload), status_code=200)

@view_home.get("/api/home/component")
def view_home_component(db: Session = Depends(get_db)):
    
    settings = db.query(Setting).all()
    categories = db.query(Category).filter(and_(Category.status == 1, Category.displayed == 1)).order_by(Category.name).all()
    
    setting = {}
    for row in enumerate(settings):
        model = row[1]
        setting[model.key_name] = model.key_value
    
    payload = {
        "setting": setting,
        "categories": categories
    }
    
    return JSONResponse(content=jsonable_encoder(payload), status_code=200)

@view_home.get("/api/home/page")
def view_home_page(db: Session = Depends(get_db)):
    
    categories = db.query(Category).filter(and_(Category.status == 1, Category.displayed == 1)).order_by(Category.name).limit(3).all()
    topProduct =  db.query(Product).filter(and_(Product.status == 1, Product.published_date <= func.now())).order_by(desc(Product.total_rating)).first()
    getProducts = db.query(Product).filter(and_(Product.status == 1, Product.published_date <= func.now())).order_by(desc(Product.id)).limit(4).all()
    getBestSellers = db.query(Product).filter(and_(Product.status == 1, Product.published_date <= func.now())).order_by(desc(Product.total_order)).limit(3).all()
    getTopSellings = db.query(Product).filter(and_(Product.status == 1, Product.published_date <= func.now())).order_by(desc(Product.total_rating)).limit(6).all()
    
    products = list(map(lambda row: {
        "id": row.id,
        "name": row.name,
        "image": row.image,
        "category": [cat.name for cat in row.categories][0],
        "price": row.price,
        "price_old": Decimal(row.price) + (Decimal(row.price) * Decimal(0.05)),
        "newest": True if random.randint(1,2) == 1 else False,
        "discount": True if random.randint(1,2) == 1 else False,
        "total_rating":math.ceil(((Decimal(row.total_rating) / Decimal(topProduct.total_rating) * 100) / 20))
    }, getProducts))
    
    topSellings = list(map(lambda row: {
        "id": row.id,
        "name": row.name,
        "image": row.image,
        "category": [cat.name for cat in row.categories][0],
        "price": row.price,
        "price_old": Decimal(row.price) + (Decimal(row.price) * Decimal(0.05)),
        "newest": True if random.randint(1,2) == 1 else False,
        "discount": True if random.randint(1,2) == 1 else False,
        "total_rating":math.ceil(((Decimal(row.total_rating) / Decimal(topProduct.total_rating) * 100) / 20))
    }, getTopSellings))
    
    bestSellers = list(map(lambda row: {
        "id": row.id,
        "name": row.name,
        "image": row.image,
        "category": [cat.name for cat in row.categories][0],
        "price": row.price,
        "price_old": Decimal(row.price) + (Decimal(row.price) * Decimal(0.05)),
        "newest": True if random.randint(1,2) == 1 else False,
        "discount": True if random.randint(1,2) == 1 else False,
        "total_rating":math.ceil(((Decimal(row.total_rating) / Decimal(topProduct.total_rating) * 100) / 20))
    }, getBestSellers))
    
    payload = {
        "categories":categories,
        "products":products,
        "topSellings":topSellings,
        "bestSellers":bestSellers
    }
    return JSONResponse(content=jsonable_encoder(payload), status_code=200)

@view_home.post("/api/newsletter/send")
def view_newsletter(request: Request, form: NewsLetterSchema, db: Session = Depends(get_db)):
    
    client_host = request.client.host
    date_now = datetime.datetime.now()
    model = NewsLetter(
        ip_address = client_host,
        email = form.email,
        status = 1,
        created_at = date_now,
        updated_at = date_now
    )
    db.add(model)
    db.commit()
    db.refresh(model)
    
    payload = {
        "status": True,
        "data": model,
        "message": 'Your subscription request has been sent. Thank you!'
    }
    return JSONResponse(content=jsonable_encoder(payload), status_code=200)


