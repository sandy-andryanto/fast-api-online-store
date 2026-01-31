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
from sqlalchemy import func, desc
from sqlalchemy.orm import Session
from sqlalchemy.sql import text
from sqlalchemy import or_, and_
from .database import get_db
from .model import *

import random
import math

view_shop = APIRouter()

@view_shop.get("/api/shop/filter")
def view_shop_filter(db: Session = Depends(get_db)):
    
    getTopSellings = db.query(Product).filter(and_(Product.status == 1, Product.published_date <= func.now())).order_by(desc(Product.total_rating)).limit(3).all()
    topPrice =  db.query(Product).filter(and_(Product.status == 1, Product.published_date <= func.now())).order_by(desc(Product.price)).first()
    minPrice =  db.query(Product).filter(and_(Product.status == 1, Product.published_date <= func.now())).order_by(Product.price).first()
    
    getCategories = (
        db.query(
            Category.id.label("id"),
            Category.name.label("name"),
            func.count(products_categories.c.product_id).label("total")
        )
        .join(products_categories, Category.id == products_categories.c.category_id)
        .group_by(Category.id)
        .all()
    )
    
    getBrands = (
        db.query(
            Brand.id.label("id"),
            Brand.name.label("name"),
            func.count(Product.id).label("total")
        )
        .join(Product, Brand.id == Product.brand_id)
        .group_by(Brand.id)
        .all()
    )

    categories = [{"id": row.id, "name": row.name, "total": row.total} for row in getCategories]
    brands = [{"id": row.id, "name": row.name, "total": row.total} for row in getBrands]
    topProduct =  db.query(Product).filter(and_(Product.status == 1, Product.published_date <= func.now())).order_by(desc(Product.total_rating)).first()
    
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
    }, getTopSellings))
    
    
    payload = {
       "categories": categories,
       "brands":brands,
       "tops": products,
       "maxPrice": topPrice.price,
       "minPrice": minPrice.price
    }
    return JSONResponse(content=jsonable_encoder(payload), status_code=200)

@view_shop.get("/api/shop/list")
def view_shop_list(
        db: Session = Depends(get_db),
        page: int = 1,
        limit: int = 10,
        order: str = "products.id",
        dir: str = "desc",
        search: str | None = None,
        brand: str | None = None,
        category: str | None = None,
        priceMin: str | None = None,
        priceMax: str | None = None
    ):
    
    if order == 'id':
        order = 'products.id'
   
    offset = ((page-1)*limit)
    topProduct =  db.query(Product).filter(and_(Product.status == 1, Product.published_date <= func.now())).order_by(desc(Product.total_rating)).first()
    total = db.query(Product).filter(Product.status == 1).count()
    data = db.query(Product).order_by(text(f"{order} {dir}")).filter(Product.status == 1)
    
    if search != None:
        data = data.filter(or_(Product.name.ilike(f'%{search}%'), Product.sku.ilike(f'%{search}%'), Product.description.ilike(f'%{search}%'), Product.details.ilike(f'%{search}%')))
        
    if category != None:
        category_ids = [int(x) for x in category.split(",")] 
        data = data.join(Product.categories).filter(Category.id.in_(category_ids))
        
    if brand != None:
        brand_ids = [int(x) for x in brand.split(",")] 
        data = data.filter(Product.brand_id.in_(brand_ids))
        
    if priceMin != None and priceMax != None:
        data = data.filter(Product.price >= priceMin).filter(Product.price <= priceMax)
       
        
    total_filtered = data.count()
    data = data.limit(limit).offset(offset)
    
    resultProducts = list(map(lambda row: {
        "id": row.id,
        "name": row.name,
        "image": row.image,
        "category": ", ".join([cat.name for cat in row.categories] ),
        "price": row.price,
        "price_old": Decimal(row.price) + (Decimal(row.price) * Decimal(0.05)),
        "newest": True if random.randint(1,2) == 1 else False,
        "discount": True if random.randint(1,2) == 1 else False,
        "total_rating":math.ceil(((Decimal(row.total_rating) / Decimal(topProduct.total_rating) * 100) / 20))
    }, data))

    payload = {
        "total_filtered": total_filtered,
        "total_all": total,
        "list": resultProducts,
        "limit": limit,
        "order": order,
        "sort": dir
    }
   
    return JSONResponse(content=jsonable_encoder(payload), status_code=200)
