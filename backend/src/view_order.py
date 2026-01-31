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

from fastapi import APIRouter, Depends, Request, Security
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session, aliased
from sqlalchemy import or_, and_, desc, func, select
from sqlalchemy.sql import text
from random import randint
from .security import JWTBearer
from .database import get_db
from .auth import auth_user
from .model import *
from .schema import *

import math
import random

view_order = APIRouter()
security = HTTPBearer()

@view_order.get("/api/order/wishlist/{id}", dependencies=[Depends(JWTBearer())])
def view_order_wishlist(id: str, db: Session = Depends(get_db), credentials: HTTPAuthorizationCredentials = Security(security)):
   
   now = datetime.datetime.utcnow()
   access_token = credentials.credentials
   auth = auth_user(access_token)
   user = db.query(User).filter(User.id == auth['id']).first()
   product_id = int(id)
   product =  db.query(Product).filter(Product.id == product_id).first()
   product.users = [user] 
   
   activity = Activity(
      user = user,
      subject = "Add Wishlist",
      event = "Add Product To Wishlist",
      description = "Your has been added product to your wishlist.",
      created_at = now,
      updated_at = now,
   )
   db.add(activity) 
   
   db.commit()
   db.refresh(product)
   return JSONResponse(content=jsonable_encoder(product), status_code=200)

@view_order.get("/api/order/session", dependencies=[Depends(JWTBearer())])
def view_order_session(db: Session = Depends(get_db), credentials: HTTPAuthorizationCredentials = Security(security)):
       
   access_token = credentials.credentials
   auth = auth_user(access_token)  
   order =  db.query(Order).filter(and_(Order.status == 0, Order.user_id == auth['id'])).order_by(desc(Order.id)).first()
   carts = []
   user = db.query(User).filter(User.id == auth['id']).first()
   whislists = user.products
       
   if order != None:
      
      getcarts = (
          db.query(
            OrderDetail, 
            Product.name.label("product_name"),
            Product.image.label("product_image")
          )
         .join(ProductInventory, OrderDetail.inventory_id == ProductInventory.id)
         .join(Product, ProductInventory.product_id == Product.id)
         .filter(OrderDetail.order_id == order.id)
         .all()
      )
      
      for index, row in enumerate(getcarts):
         cart = row[0]
         name = row[1]
         image = row[2]
         carts.insert(index, {
            'name': name,
            'image': image,
            'price': cart.price,
            'qty': cart.qty,
            'total': cart.total
         })
      
   payload = {
      "carts": carts,
      "order": order,
      "whislists": whislists
   }
   
   return JSONResponse(content=jsonable_encoder(payload), status_code=200)

@view_order.get("/api/order/cart/{id}", dependencies=[Depends(JWTBearer())])
def view_order_list_cart(id: str,  db: Session = Depends(get_db)):   
   
   product_id = int(id)
   getProduct =  db.query(Product).filter(Product.id == product_id).all()
   images = db.query(ProductImage).filter(ProductImage.product_id == product_id).all()
   topProduct =  db.query(Product).filter(and_(Product.status == 1, Product.published_date <= func.now())).order_by(desc(Product.total_rating)).first()
   getBestSellers = db.query(Product).filter(and_(Product.status == 1, Product.id != product_id,  Product.published_date <= func.now())).order_by(desc(Product.total_order)).limit(3).all()
   inventories = db.query(ProductInventory).filter(and_(ProductInventory.product_id == id)).all()
   sizes = db.query(Size).filter(and_(Size.status == 1)).order_by(Size.name.asc()).all()
   colours = db.query(Colour).filter(and_(Size.status == 1)).order_by(Size.name.asc()).all()
   
   product = list(map(lambda row: {
        "id": row.id,
        "name": row.name,
        "image": row.image,
        "categories": row.categories,
        "price": row.price,
        "price_old": Decimal(row.price) + (Decimal(row.price) * Decimal(0.05)),
        "newest": True if random.randint(1,2) == 1 else False,
        "discount": True if random.randint(1,2) == 1 else False,
        "total_rating":math.ceil(((Decimal(row.total_rating) / Decimal(topProduct.total_rating) * 100) / 20)),
        "description": row.description,
        "details": row.details
    }, getProduct))
   
   productRelated = list(map(lambda row: {
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
      "images": images,
      "product": product[0],
      "productRelated": productRelated,
      "sizes": sizes,
      "colours": colours,
      "inventories":inventories
   }
   
   return JSONResponse(content=jsonable_encoder(payload), status_code=200)

@view_order.post("/api/order/cart/{id}", dependencies=[Depends(JWTBearer())])
def view_order_create_cart(id: str, form: CreateCartSchema, db: Session = Depends(get_db), credentials: HTTPAuthorizationCredentials = Security(security)):
    
   access_token = credentials.credentials
   auth = auth_user(access_token)  
   user = db.query(User).filter(User.id == auth['id']).first()
   now = datetime.datetime.utcnow()
   ticks = (now - datetime.datetime(1, 1, 1)).total_seconds() * 10_000_000
   ticks = int(ticks)
   product =  db.query(Product).filter(Product.id == id).first()
   order =  db.query(Order).filter(and_(Order.status == 0, Order.user_id == auth['id'])).order_by(desc(Order.id)).first()
   total = form.qty * product.price
   
   if order == None:
      order = Order(
         user_id = auth['id'],
         invoice_number = str(ticks),
         total_item = form.qty,
         subtotal = total,
         total_paid = total,
         status = 0,
         created_at = now,
         updated_at = now
      )
      db.add(order)
      db.commit()
      db.refresh(order)
      
   
   inventory = db.query(ProductInventory).filter(and_(ProductInventory.product_id == id, ProductInventory.size_id == form.size_id , ProductInventory.colour_id == form.colour_id)).first()
   
   if inventory != None:
          
      cart = db.query(OrderDetail).filter(and_(OrderDetail.inventory_id == inventory.id, OrderDetail.order_id == order.id)).first()
      
      if(cart != None):
         
         update_cart = {
            'price': product.price,
            'qty': cart.qty + form.qty,
            'total': cart.total + total,
            'updated_at': now
         }
         db.query(OrderDetail).filter(OrderDetail.id == cart.id).update(update_cart, synchronize_session=False)
         
      else:
         cart = OrderDetail(
            order_id = order.id,
            inventory_id = inventory.id,
            price = product.price,
            qty = form.qty,
            total = total,
            created_at = now,
            updated_at = now
         )
         db.add(cart)
         db.commit()
      
      update_order = {
         'total_item': order.total_item + form.qty,
         'subtotal': order.subtotal + total,
         'total_paid': order.total_paid + total
      }
      db.query(Order).filter(Order.id == order.id).update(update_order, synchronize_session=False)
       
   
   activity = Activity(
      user = user,
      subject = "Add Cart",
      event = "Add Product To Cart",
      description = "Your has been added product to cart.",
      created_at = now,
      updated_at = now,
   )
   db.add(activity)
   db.commit()
   db.refresh(order)
   
   return JSONResponse(content=jsonable_encoder(order), status_code=200)

@view_order.get("/api/order/review/{id}", dependencies=[Depends(JWTBearer())])
def view_order_review(id: str, db: Session = Depends(get_db)):
   
   product_id = int(id)
   getreviews = db.query(ProductReview).filter(ProductReview.product_id == product_id).order_by(desc(ProductReview.id)).all()
   toprating = db.query(ProductReview).filter(ProductReview.product_id == product_id).order_by(desc(ProductReview.rating)).first()
   
   reviews = list(map(lambda row: {
        "id": row.id,
        "created_at": row.created_at,
        "review": row.review,
        "rating_index": ((Decimal(row.rating) / Decimal(toprating.rating) * 100) / 20),
        "percentage": math.ceil((Decimal(row.rating) / Decimal(toprating.rating) * 100))
    }, getreviews))
   
   return JSONResponse(content=jsonable_encoder(reviews), status_code=200)

@view_order.post("/api/order/review/{id}")
def view_order_create_review(id: str, form: CreateReviewSchema, db: Session = Depends(get_db), credentials: HTTPAuthorizationCredentials = Security(security)):
       
   access_token = credentials.credentials
   auth = auth_user(access_token)
   product_id = int(id)
   user_id = int(auth['id'])
   now = datetime.datetime.utcnow()
   product =  db.query(Product).filter(Product.id == id).first()
   
   review = ProductReview(
      product_id = product_id,
      user_id = user_id,
      rating = form.rating,
      review = form.review
   )
   db.add(review)
    
   activity = Activity(
      user_id = user_id,
      subject = "Create new review",
      event = "Add review to "+product.name,
      description = "Your has been added new review to "+product.name,
      created_at = now,
      updated_at = now,
   )
   db.add(activity)
    
   db.commit()
   db.refresh(review) 
   
   return JSONResponse(content=jsonable_encoder(review), status_code=200)

@view_order.get("/api/order/initial", dependencies=[Depends(JWTBearer())])
def view_order_initial(db: Session = Depends(get_db), credentials: HTTPAuthorizationCredentials = Security(security)):
       
   access_token = credentials.credentials
   auth = auth_user(access_token)  
   order =  db.query(Order).filter(and_(Order.status == 0, Order.user_id == auth['id'])).order_by(desc(Order.id)).first()
   carts = []
   user = db.query(User).filter(User.id == auth['id']).first()
   payments = db.query(Payment).filter(and_(Payment.status == 1)).order_by(Payment.name.asc()).all()
   getDiscount =  db.query(Setting).filter(Setting.key_name == 'discount_value').first()
   getTaxes =  db.query(Setting).filter(Setting.key_name == 'taxes_value').first()
   getShipment =  db.query(Setting).filter(Setting.key_name == 'total_shipment').first()
   iDiscount = Decimal(getDiscount.key_value) if getDiscount != None else Decimal(0)
   iTaxes = Decimal(getTaxes.key_value) if getTaxes != None else Decimal(0)
   iShipment =  Decimal(getShipment.key_value) if getShipment != None else Decimal(0)
   
   
   if order != None:
      
      getcarts = (
          db.query(
            OrderDetail, 
            Product.name.label("product_name"),
            Product.image.label("product_image")
          )
         .join(ProductInventory, OrderDetail.inventory_id == ProductInventory.id)
         .join(Product, ProductInventory.product_id == Product.id)
         .filter(OrderDetail.order_id == order.id)
         .all()
      )
      
      for index, row in enumerate(getcarts):
         cart = row[0]
         name = row[1]
         image = row[2]
         carts.insert(index, {
            'name': name,
            'image': image,
            'price': cart.price,
            'qty': cart.qty,
            'total': cart.total
         })
         
   user_result = {
      'email': user.email,
      'phone': user.phone,
      'first_name': user.first_name,
      'last_name': user.last_name,
      'gender': user.gender,
      'country': user.country,
      'city': user.city,
      'zip_code': user.zip_code,
      'address': user.address,
      'notes': ''
   }
   
   subtotal = Decimal(order.subtotal)
   total_discount = Decimal(subtotal) * (iDiscount / 100)
   total_taxes = Decimal(subtotal) * (iTaxes / 100)
   total_paid = (subtotal + total_taxes + iShipment) - total_discount
   total_item = db.query(func.sum(OrderDetail.qty)).filter(OrderDetail.order_id == order.id).scalar()
   
   order_result = {
      'id': order.id,
      'invoice_number': order.invoice_number,
      'total_item': total_item,
      'subtotal': subtotal,
      'total_discount': total_discount,
      'total_taxes': total_taxes,
      'total_shipment': iShipment,
      'total_paid': total_paid
   }
   
   payload = {
       "order": order_result,
       "carts": carts,
       "user": user_result,
       "payments": payments,
       "discount": iDiscount,
       "taxes": iTaxes,
       "shipment": iShipment
   }
   
   return JSONResponse(content=jsonable_encoder(payload), status_code=200)

@view_order.post("/api/order/checkout", dependencies=[Depends(JWTBearer())])
def view_order_checkout_submit(form: CheckoutSchema, db: Session = Depends(get_db), credentials: HTTPAuthorizationCredentials = Security(security)):
   
   now = datetime.datetime.utcnow()
   access_token = credentials.credentials
   auth = auth_user(access_token)  
   user = db.query(User).filter(User.id == auth['id']).first()
   order =  db.query(Order).filter(and_(Order.status == 0, Order.user_id == auth['id'])).order_by(desc(Order.id)).first()
   getDiscount =  db.query(Setting).filter(Setting.key_name == 'discount_value').first()
   getTaxes =  db.query(Setting).filter(Setting.key_name == 'taxes_value').first()
   getShipment =  db.query(Setting).filter(Setting.key_name == 'total_shipment').first()
   iDiscount = Decimal(getDiscount.key_value) if getDiscount != None else Decimal(0)
   iTaxes = Decimal(getTaxes.key_value) if getTaxes != None else Decimal(0)
   iShipment =  Decimal(getShipment.key_value) if getShipment != None else Decimal(0)
   
   details =  db.query(OrderDetail).filter(OrderDetail.order_id == order.id).all()
   
   # Update Details
   for detail in details:
      
      inventory = db.query(ProductInventory).filter(ProductInventory.id == detail.inventory_id).first()
      inventory.stock = inventory.stock - detail.qty
      
      product = db.query(Product).filter(Product.id == inventory.product_id).first()
      product.total_order = product.total_order + detail.qty      
      
      user.products = []
      
   # Update Orders
   order.subtotal = Decimal(order.subtotal)
   order.total_shipment = iShipment
   order.total_discount = Decimal(order.subtotal) * (iDiscount / 100)
   order.total_taxes = Decimal(order.subtotal) * (iTaxes / 100)
   order.total_paid = (order.subtotal + order.total_taxes + iShipment) - order.total_discount
   order.total_item = db.query(func.sum(OrderDetail.qty)).filter(OrderDetail.order_id == order.id).scalar()
   order.payment_id = form.payment_id
   order.status = 1
   
   # Update Billings
   db.add(OrderBilling( order_id = order.id, name = "first_name", description = form.first_name ))
   db.add(OrderBilling( order_id = order.id, name = "last_name", description = form.last_name ))
   db.add(OrderBilling( order_id = order.id, name = "gender", description = form.gender ))
   db.add(OrderBilling( order_id = order.id, name = "email", description = form.email ))
   db.add(OrderBilling( order_id = order.id, name = "phone", description = form.phone ))
   db.add(OrderBilling( order_id = order.id, name = "address", description = form.address ))
   db.add(OrderBilling( order_id = order.id, name = "country", description = form.country ))
   db.add(OrderBilling( order_id = order.id, name = "city", description = form.city ))
   db.add(OrderBilling( order_id = order.id, name = "zip_code", description = form.zip_code ))
   db.add(OrderBilling( order_id = order.id, name = "notes", description = form.notes ))
   
   # Activities
   activity = Activity(
      user = user,
      subject = "Checkout Order",
      event = "Completed Checkout Current Order",
      description = "Your order has been finished.",
      created_at = now,
      updated_at = now,
   )
   db.add(activity) 
   
   #Update All
   db.commit()
   db.refresh(order)
   
   return JSONResponse(content=jsonable_encoder(order), status_code=200)

@view_order.get("/api/order/list", dependencies=[Depends(JWTBearer())])
def view_order_list(
      db: Session = Depends(get_db), 
      credentials: HTTPAuthorizationCredentials = Security(security),
      page: int = 1,
      limit: int = 10,
      order: str = "orders.id",
      dir: str = "desc",
      search: str | None = None
   ):
   
   access_token = credentials.credentials
   auth = auth_user(access_token)
   user_id = int(auth['id'])
   offset = ((page-1)*limit)
   total = db.query(Order).filter(Order.user_id == user_id).count()
   data = db.query(Order).order_by(text(f"{order} {dir}")).filter(Order.user_id == user_id)
   
   if search != None:
      data = data.filter(Order.invoice_number.ilike(f'%{search}%'))
      
   total_filtered = data.count()
   data = data.limit(limit).offset(offset)
   
   payload = {
      "list": data.all(),
      "total_all":total,
      "total_filtered": total_filtered,
      "limit": limit
   }
   
   return JSONResponse(content=jsonable_encoder(payload), status_code=200)

@view_order.get("/api/order/detail/{id}", dependencies=[Depends(JWTBearer())])
def view_order_detail(id: str, db: Session = Depends(get_db), credentials: HTTPAuthorizationCredentials = Security(security)):
       
   order =  db.query(Order).filter(Order.id == id).first()
   
   if order == None:
      return JSONResponse(content="We can't find a record with id is invalid", status_code=400)
   
   getcarts = (
      db.query(
         OrderDetail, 
         Product.name.label("product_name"),
         Product.image.label("product_image")
      )
      .join(ProductInventory, OrderDetail.inventory_id == ProductInventory.id)
      .join(Product, ProductInventory.product_id == Product.id)
      .filter(OrderDetail.order_id == order.id)
      .all()
   )
   
   carts = []
   for index, row in enumerate(getcarts):
      cart = row[0]
      name = row[1]
      image = row[2]
      carts.insert(index, {
         'name': name,
         'image': image,
         'price': cart.price,
         'qty': cart.qty,
         'total': cart.total
      })
      
   discount = (Decimal(order.total_discount) /  Decimal(order.subtotal)) * 100
   taxes = (Decimal(order.total_taxes) /  Decimal(order.subtotal)) * 100
   payment = db.query(Payment).filter(Payment.id == order.payment_id).first()
   getBilling =  db.query(OrderBilling).filter(OrderBilling.order_id == id).all()
   
   billing = {}
   for row in enumerate(getBilling):
      model = row[1]
      billing[model.name] = model.description
       
   payload = {
      "discount": discount,
      "taxes": taxes,
      "shipment": order.total_shipment,
      "carts": carts,
      "order": order,
      "payment": payment,
      "billing": billing
   }
   
   return JSONResponse(content=jsonable_encoder(payload), status_code=200)

@view_order.get("/api/order/cancel/{id}", dependencies=[Depends(JWTBearer())])
def view_order_cancel(id: str, db: Session = Depends(get_db), credentials: HTTPAuthorizationCredentials = Security(security)):    
   
   now = datetime.datetime.utcnow()
   order =  db.query(Order).filter(Order.id == id).first()
   access_token = credentials.credentials
   auth = auth_user(access_token)
   user = db.query(User).filter(User.id == auth['id']).first()
   
   if order == None:
      return JSONResponse(content="We can't find a record with id is invalid", status_code=400)
   
   db.query(OrderDetail).filter(OrderDetail.order_id == id).delete()
   db.query(OrderBilling).filter(OrderBilling.order_id == id).delete()
   order.products = []
   db.query(Order).filter(Order.id == id).delete()
   
   activity = Activity(
      user = user,
      subject = "Cancel Order",
      event = "Canceling Current Order",
      description = "Your has been canceling current order.",
      created_at = now,
      updated_at = now,
   )
   db.add(activity)   
   
   db.commit()
   payload = { "status": True }
   return JSONResponse(content=jsonable_encoder(payload), status_code=200)