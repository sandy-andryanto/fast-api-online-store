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


from sqlalchemy import Column, String, ForeignKey, DateTime, Integer, Table, Text, Numeric
from sqlalchemy.dialects.mysql import  BIGINT, TINYINT, LONGTEXT, INTEGER
from sqlalchemy.orm import relationship
from decimal import Decimal
from .database import Base

import datetime

products_categories = Table(
    'products_categories',
    Base.metadata,
    Column('product_id', BIGINT(unsigned=True), ForeignKey('products.id'), primary_key=True),
    Column('category_id', BIGINT(unsigned=True), ForeignKey('categories.id'), primary_key=True)
)

products_wishlists = Table(
    'products_wishlists',
    Base.metadata,
    Column('product_id', BIGINT(unsigned=True), ForeignKey('products.id'), primary_key=True),
    Column('user_id', BIGINT(unsigned=True), ForeignKey('users.id'), primary_key=True)
)

orders_carts = Table(
    'orders_carts',
    Base.metadata,
    Column('order_id', BIGINT(unsigned=True), ForeignKey('orders.id'), primary_key=True),
    Column('product_id', BIGINT(unsigned=True), ForeignKey('products.id'), primary_key=True)
)

class User(Base):
    __tablename__ = 'users'
    __table_args__ = {'mysql_engine': 'InnoDB', 'mariadb_engine': 'InnoDB'}

    id = Column(BIGINT(unsigned=True), primary_key=True, index=True)
    email = Column(String(180), index=True, nullable=False, unique=True)
    phone = Column(String(64), index=True, nullable=True, unique=True)
    password = Column(String(255), index=True, nullable=False, unique=False)
    image = Column(String(255), index=True, nullable=True, unique=False)
    first_name = Column(String(191), index=True, nullable=True, unique=False)
    last_name = Column(String(191), index=True, nullable=True, unique=False)
    gender = Column(String(2), index=True, nullable=True, unique=False)
    city = Column(String(255), index=True, nullable=True, unique=False)
    zip_code = Column(String(64), index=True, nullable=True, unique=False)
    country = Column(String(255), index=True, nullable=True, unique=False)
    address = Column(Text(), nullable=True)
    # Base Entity
    status = Column(TINYINT(unsigned=True), index=True, default=1)
    created_at = Column(DateTime, index=True, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, index=True, default=datetime.datetime.utcnow)
    # Relations
    authentications = relationship('Authentication', back_populates='user')
    activities = relationship('Activity', back_populates='user')
    products_reviews = relationship('ProductReview', back_populates='user')
    orders = relationship('Order', back_populates='user')
    products = relationship('Product', secondary=products_wishlists, back_populates='users')
    
class Authentication(Base):
    __tablename__ = 'authentications'
    __table_args__ = {'mysql_engine': 'InnoDB', 'mariadb_engine': 'InnoDB'}

    id = Column(BIGINT(unsigned=True), primary_key=True, index=True)
    user_id = Column(BIGINT(unsigned=True), ForeignKey('users.id'))
    type = Column(String(180), index=True, nullable=False, unique=False)
    credential = Column(String(180), index=True, nullable=False, unique=False)
    token = Column(String(180), index=True, nullable=False, unique=False)
    # Base Entity
    status = Column(TINYINT(unsigned=True), index=True, default=1)
    expired_at = Column(DateTime, index=True, nullable=True)
    created_at = Column(DateTime, index=True, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, index=True, default=datetime.datetime.utcnow)
    # Relations
    user = relationship('User', back_populates='authentications')
    
class Activity(Base):
    __tablename__ = 'activities'
    __table_args__ = {'mysql_engine': 'InnoDB', 'mariadb_engine': 'InnoDB'}

    id = Column(BIGINT(unsigned=True), primary_key=True, index=True)
    user_id = Column(BIGINT(unsigned=True), ForeignKey('users.id'))
    event = Column(String(255), index=True, nullable=False, unique=False)
    subject = Column(String(255), index=True, nullable=False, unique=False)
    description = Column(Text(), nullable=True)
    # Base Entity
    status = Column(TINYINT(unsigned=True), index=True, default=1)
    created_at = Column(DateTime, index=True, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, index=True, default=datetime.datetime.utcnow)
    # Relations
    user = relationship('User', back_populates='activities')
    
class Brand(Base):
    __tablename__ = 'brands'
    __table_args__ = {'mysql_engine': 'InnoDB', 'mariadb_engine': 'InnoDB'}

    id = Column(BIGINT(unsigned=True), primary_key=True, index=True)
    image = Column(String(255), index=True, nullable=True, unique=False)
    name = Column(String(255), index=True, nullable=False, unique=False)
    description = Column(Text(), nullable=True)
    # Base Entity
    status = Column(TINYINT(unsigned=True), index=True, default=1)
    created_at = Column(DateTime, index=True, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, index=True, default=datetime.datetime.utcnow)
    # Relations
    products = relationship('Product', back_populates='brand')
    
class Category(Base):
    __tablename__ = 'categories'
    __table_args__ = {'mysql_engine': 'InnoDB', 'mariadb_engine': 'InnoDB'}

    id = Column(BIGINT(unsigned=True), primary_key=True, index=True)
    image = Column(String(255), index=True, nullable=True, unique=False)
    name = Column(String(255), index=True, nullable=False, unique=False)
    description = Column(Text(), nullable=True)
    displayed = Column(TINYINT(unsigned=True), index=True, default=0)
    # Base Entity
    status = Column(TINYINT(unsigned=True), index=True, default=1)
    created_at = Column(DateTime, index=True, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, index=True, default=datetime.datetime.utcnow)
    # Relations
    products = relationship('Product', secondary=products_categories, back_populates='categories')
    
class Colour(Base):
    __tablename__ = 'colours'
    __table_args__ = {'mysql_engine': 'InnoDB', 'mariadb_engine': 'InnoDB'}

    id = Column(BIGINT(unsigned=True), primary_key=True, index=True)
    code = Column(String(255), index=True, nullable=False, unique=False)
    name = Column(String(255), index=True, nullable=False, unique=False)
    description = Column(Text(), nullable=True)
    # Base Entity
    status = Column(TINYINT(unsigned=True), index=True, default=1)
    created_at = Column(DateTime, index=True, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, index=True, default=datetime.datetime.utcnow)
    # Relations
    products_inventories = relationship('ProductInventory', back_populates='colour')
    
class NewsLetter(Base):
    __tablename__ = 'newsLetters'
    __table_args__ = {'mysql_engine': 'InnoDB', 'mariadb_engine': 'InnoDB'}

    id = Column(BIGINT(unsigned=True), primary_key=True, index=True)
    ip_address = Column(String(45), index=True, nullable=False, unique=False)
    email = Column(String(180), index=True, nullable=False, unique=False)
    # Base Entity
    status = Column(TINYINT(unsigned=True), index=True, default=1)
    created_at = Column(DateTime, index=True, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, index=True, default=datetime.datetime.utcnow)
    
class Payment(Base):
    __tablename__ = 'payments'
    __table_args__ = {'mysql_engine': 'InnoDB', 'mariadb_engine': 'InnoDB'}

    id = Column(BIGINT(unsigned=True), primary_key=True, index=True)
    name = Column(String(255), index=True, nullable=False, unique=False)
    description = Column(Text(), nullable=True)
    # Base Entity
    status = Column(TINYINT(unsigned=True), index=True, default=1)
    created_at = Column(DateTime, index=True, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, index=True, default=datetime.datetime.utcnow)
    # Relations
    orders = relationship('Order', back_populates='payment')
    
class Setting(Base):
    __tablename__ = 'settings'
    __table_args__ = {'mysql_engine': 'InnoDB', 'mariadb_engine': 'InnoDB'}

    id = Column(BIGINT(unsigned=True), primary_key=True, index=True)
    key_name = Column(String(255), index=True, nullable=False, unique=False)
    key_value = Column(LONGTEXT(), nullable=False)
    # Base Entity
    status = Column(TINYINT(unsigned=True), index=True, default=1)
    created_at = Column(DateTime, index=True, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, index=True, default=datetime.datetime.utcnow)
    
class Size(Base):
    __tablename__ = 'sizes'
    __table_args__ = {'mysql_engine': 'InnoDB', 'mariadb_engine': 'InnoDB'}

    id = Column(BIGINT(unsigned=True), primary_key=True, index=True)
    name = Column(String(255), index=True, nullable=False, unique=False)
    description = Column(Text(), nullable=True)
    # Base Entity
    status = Column(TINYINT(unsigned=True), index=True, default=1)
    created_at = Column(DateTime, index=True, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, index=True, default=datetime.datetime.utcnow)
    # Relations
    products_inventories = relationship('ProductInventory', back_populates='size')
    
class Product(Base):
    __tablename__ = 'products'
    __table_args__ = {'mysql_engine': 'InnoDB', 'mariadb_engine': 'InnoDB'}

    id = Column(BIGINT(unsigned=True), primary_key=True, index=True)
    brand_id = Column(BIGINT(unsigned=True), ForeignKey('brands.id'))
    image = Column(String(255), index=True, nullable=True, unique=False)
    sku = Column(String(20), index=True, nullable=False, unique=True)
    name = Column(String(255), index=True, nullable=False, unique=False)
    price = Column(Numeric(18, 4), default=Decimal('0.0000'), index=True, nullable=False)
    total_order = Column(INTEGER(unsigned=True), index=True, default=0)
    total_rating = Column(INTEGER(unsigned=True), index=True, default=0)
    published_date = Column(DateTime, index=True, nullable=True)
    details = Column(LONGTEXT(), nullable=False)
    description = Column(LONGTEXT(), nullable=False)
    # Base Entity
    status = Column(TINYINT(unsigned=True), index=True, default=1)
    created_at = Column(DateTime, index=True, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, index=True, default=datetime.datetime.utcnow)
    # Relations
    brand = relationship('Brand', back_populates='products')
    products_images = relationship('ProductImage', back_populates='product')
    products_inventories = relationship('ProductInventory', back_populates='product')
    products_reviews = relationship('ProductReview', back_populates='product')
    categories = relationship('Category', secondary=products_categories, back_populates='products')
    users = relationship('User', secondary=products_wishlists, back_populates='products')
    orders = relationship('Order', secondary=orders_carts, back_populates='products')
    
class ProductImage(Base):
    __tablename__ = 'products_images'
    __table_args__ = {'mysql_engine': 'InnoDB', 'mariadb_engine': 'InnoDB'}

    id = Column(BIGINT(unsigned=True), primary_key=True, index=True)
    product_id = Column(BIGINT(unsigned=True), ForeignKey('products.id'))
    path = Column(String(255), index=True, nullable=False, unique=False)
    sort = Column(INTEGER(unsigned=True), index=True, default=0)
    # Base Entity
    status = Column(TINYINT(unsigned=True), index=True, default=1)
    created_at = Column(DateTime, index=True, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, index=True, default=datetime.datetime.utcnow)
    # Relations
    product = relationship('Product', back_populates='products_images')
    
class ProductInventory(Base):
    __tablename__ = 'products_inventories'
    __table_args__ = {'mysql_engine': 'InnoDB', 'mariadb_engine': 'InnoDB'}

    id = Column(BIGINT(unsigned=True), primary_key=True, index=True)
    product_id = Column(BIGINT(unsigned=True), ForeignKey('products.id'))
    size_id = Column(BIGINT(unsigned=True), ForeignKey('sizes.id'))
    colour_id = Column(BIGINT(unsigned=True), ForeignKey('colours.id'))
    stock = Column(INTEGER(unsigned=True), index=True, default=0)
    # Base Entity
    status = Column(TINYINT(unsigned=True), index=True, default=1)
    created_at = Column(DateTime, index=True, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, index=True, default=datetime.datetime.utcnow)
    # Relations
    product = relationship('Product', back_populates='products_inventories')
    size = relationship('Size', back_populates='products_inventories')
    colour = relationship('Colour', back_populates='products_inventories')
    orders_details = relationship('OrderDetail', back_populates='inventory')
    
class ProductReview(Base):
    __tablename__ = 'products_reviews'
    __table_args__ = {'mysql_engine': 'InnoDB', 'mariadb_engine': 'InnoDB'}

    id = Column(BIGINT(unsigned=True), primary_key=True, index=True)
    product_id = Column(BIGINT(unsigned=True), ForeignKey('products.id'))
    user_id = Column(BIGINT(unsigned=True), ForeignKey('users.id'))
    rating = Column(INTEGER(unsigned=True), index=True, default=0)
    review = Column(LONGTEXT(), nullable=False)
    # Base Entity
    status = Column(TINYINT(unsigned=True), index=True, default=1)
    created_at = Column(DateTime, index=True, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, index=True, default=datetime.datetime.utcnow)
    # Relations
    product = relationship('Product', back_populates='products_reviews')
    user = relationship('User', back_populates='products_reviews')
    
class Order(Base):
    __tablename__ = 'orders'
    __table_args__ = {'mysql_engine': 'InnoDB', 'mariadb_engine': 'InnoDB'}

    id = Column(BIGINT(unsigned=True), primary_key=True, index=True)
    user_id = Column(BIGINT(unsigned=True), ForeignKey('users.id'))
    payment_id = Column(BIGINT(unsigned=True), ForeignKey('payments.id'))
    invoice_number = Column(String(180), index=True, nullable=False, unique=False)
    total_item = Column(INTEGER(unsigned=True), index=True, default=0)
    subtotal = Column(Numeric(18, 4), default=Decimal('0.0000'), index=True, nullable=False)
    total_discount = Column(Numeric(18, 4), default=Decimal('0.0000'), index=True, nullable=False)
    total_taxes = Column(Numeric(18, 4), default=Decimal('0.0000'), index=True, nullable=False)
    total_shipment = Column(Numeric(18, 4), default=Decimal('0.0000'), index=True, nullable=False)
    total_paid = Column(Numeric(18, 4), default=Decimal('0.0000'), index=True, nullable=False)
  
    # Base Entity
    status = Column(TINYINT(unsigned=True), index=True, default=1)
    created_at = Column(DateTime, index=True, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, index=True, default=datetime.datetime.utcnow)
    # Relations
    user = relationship('User', back_populates='orders')
    payment = relationship('Payment', back_populates='orders')
    orders_billings = relationship('OrderBilling', back_populates='order')
    orders_details = relationship('OrderDetail', back_populates='order')
    products = relationship('Product', secondary=orders_carts, back_populates='orders')
    
class OrderBilling(Base):
    __tablename__ = 'orders_billings'
    __table_args__ = {'mysql_engine': 'InnoDB', 'mariadb_engine': 'InnoDB'}

    id = Column(BIGINT(unsigned=True), primary_key=True, index=True)
    order_id = Column(BIGINT(unsigned=True), ForeignKey('orders.id'))
    name = Column(String(255), index=True, nullable=False, unique=False)
    description = Column(LONGTEXT(), nullable=False)
  
    # Base Entity
    status = Column(TINYINT(unsigned=True), index=True, default=1)
    created_at = Column(DateTime, index=True, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, index=True, default=datetime.datetime.utcnow)
    # Relations
    order = relationship('Order', back_populates='orders_billings')
   
    
class OrderDetail(Base):
    __tablename__ = 'orders_details'
    __table_args__ = {'mysql_engine': 'InnoDB', 'mariadb_engine': 'InnoDB'}

    id = Column(BIGINT(unsigned=True), primary_key=True, index=True)
    order_id = Column(BIGINT(unsigned=True), ForeignKey('orders.id'))
    inventory_id = Column(BIGINT(unsigned=True), ForeignKey('products_inventories.id'))
    price = Column(Numeric(18, 4), default=Decimal('0.0000'), index=True, nullable=False)
    qty = Column(INTEGER(unsigned=True), index=True, default=0)
    total = Column(Numeric(18, 4), default=Decimal('0.0000'), index=True, nullable=False)
  
    # Base Entity
    status = Column(TINYINT(unsigned=True), index=True, default=1)
    created_at = Column(DateTime, index=True, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, index=True, default=datetime.datetime.utcnow)
    # Relations
    order = relationship('Order', back_populates='orders_details')
    inventory = relationship('ProductInventory', back_populates='orders_details')
