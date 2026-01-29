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

import random
import os

from faker import Faker
from .database import get_db
from dotenv import load_dotenv
from random import randint
from passlib.context import CryptContext
from datetime import datetime, timedelta
from sqlalchemy.sql.expression import func
from .model import * 

load_dotenv()

class Seed:
    
    def run(self):
        APP_ENV = os.getenv("APP_ENV")
        if(APP_ENV == 'development'):
            self.seed_user()
            self.seed_setting()
            self.seed_category()
            self.seed_brand()
            self.seed_size()
            self.seed_colour()
            self.seed_payment()
            self.seed_product()
            
    def hash_pass(self, password:str):
        pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
        return pwd_context.hash(password)
    
    def seed_category(self):
        
        db = next(get_db())
        total = db.query(Category).count()
        
        if(total == 0):
            
            items = {
                "Laptop":      "https://5an9y4lf0n50.github.io/demo-images/demo-commerce/product01.png",
                "Smartphone":  "https://5an9y4lf0n50.github.io/demo-images/demo-commerce/product02.png",
                "Camera":      "https://5an9y4lf0n50.github.io/demo-images/demo-commerce/product03.png",
                "Accessories": "https://5an9y4lf0n50.github.io/demo-images/demo-commerce/product04.png",
                "Others":      "https://5an9y4lf0n50.github.io/demo-images/demo-commerce/product05.png"
            }
            
            for index, (name, url) in enumerate(items.items()):
                fake = Faker()
                displayed = 1 if index < 3 else 0
                category = Category(
                    displayed = displayed,
                    name = name,
                    image = url,
                    description=  fake.paragraph(),
                    status = 1
                )
                db.add(category)
            db.commit()
            
        
    
    def seed_setting(self):
        
        db = next(get_db())
        total = db.query(Category).count()
        current = datetime.datetime.now()
        
        if(total == 0):
            
            settings = {
                "about_section": "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut.",
                "com_location": "West Java, Indonesia",
                "com_phone": "+62-898-921-8470",
                "com_email": "sandy.andryanto.blade@gmail.com",
                "com_currency": "USD",
                "installed": 1,
                "discount_active": 1,
                "discount_value": 5,
                "discount_start": current.strftime("%Y-%m-%d %H:%M:%S"),
                "discount_end": (current + timedelta(days=7)).strftime("%Y-%m-%d %H:%M:%S"),
                "taxes_value": 10,
                "total_shipment": 50
            }
            
            for key, value in settings.items():
                setting = Setting(
                    key_name = key,
                    key_value = value,
                    status = 1
                )
                db.add(setting)
            db.commit()
            
    
    def seed_brand(self):
        
        db = next(get_db())
        total = db.query(Brand).count()
        
        if(total == 0):
            items = ["Samsung", "LG", "Sony", "Apple", "Microsoft"]
            for item in items:
                fake = Faker()
                brand = Brand(
                    name = item,
                    description=  fake.paragraph(),
                    status = 1
                )
                db.add(brand)
            db.commit()
    
    def seed_colour(self):
        
        db = next(get_db())
        total = db.query(Colour).count()
        
        if(total == 0):
            
            items = {
                "#FF0000": "Red",
                "#0000FF": "Blue",
                "#FFFF00": "Yellow",
                "#000000": "Black",
                "#FFFFFF": "White",
                "#666":    "Dark Gray",
                "#AAA":    "Light Gray"
            }
            
            for key, value in items.items():
                setting = Colour(
                    code = key,
                    name = value,
                    status = 1
                )
                db.add(setting)
            db.commit()
            
    
    def seed_size(self):
        
        db = next(get_db())
        total = db.query(Size).count()
        
        if(total == 0):
            items = ["11 to 12 Inches", "13 to 14 Inches", "15 to 16 Inches", "17 to 18 Inches"]
            for item in items:
                fake = Faker()
                brand = Size(
                    name = item,
                    description=  fake.paragraph(),
                    status = 1
                )
                db.add(brand)
            db.commit()
            
    
    def seed_payment(self):
        
        db = next(get_db())
        total = db.query(Payment).count()
        
        if(total == 0):
            items = ["Direct Bank Transfer", "Cheque Payment", "Paypal System"]
            for item in items:
                fake = Faker()
                brand = Payment(
                    name = item,
                    description=  fake.paragraph(),
                    status = 1
                )
                db.add(brand)
            db.commit()
    
    def seed_product(self):
        
        db = next(get_db())
        total = db.query(Product).count()
        
        if(total == 0):
            
            images = [
                "https://5an9y4lf0n50.github.io/demo-images/demo-commerce/product01.png",
                "https://5an9y4lf0n50.github.io/demo-images/demo-commerce/product02.png",
                "https://5an9y4lf0n50.github.io/demo-images/demo-commerce/product03.png",
                "https://5an9y4lf0n50.github.io/demo-images/demo-commerce/product04.png",
                "https://5an9y4lf0n50.github.io/demo-images/demo-commerce/product05.png",
                "https://5an9y4lf0n50.github.io/demo-images/demo-commerce/product06.png",
                "https://5an9y4lf0n50.github.io/demo-images/demo-commerce/product07.png",
                "https://5an9y4lf0n50.github.io/demo-images/demo-commerce/product08.png",
                "https://5an9y4lf0n50.github.io/demo-images/demo-commerce/product09.png"
            ]
            
            colours = db.query(Colour).all()
            sizes = db.query(Size).all()
            now = datetime.datetime.utcnow()
            
            for index in range(9):
                
                number = index + 1
                sku = "P00"+str(number)
                product_name = "Product "+str(number)
                brand = db.query(Brand).order_by(func.rand()).first()
                categories = db.query(Category).order_by(func.rand()).limit(3).all()
                reviewers = db.query(User).order_by(func.rand()).limit(5).all()
                fake = Faker()
                image = random.choice(images)
                
                pr = Product(
                    brand = brand,
                    image = image,
                    sku = sku,
                    name = product_name,
                    price = random.randint(100, 999),
                    total_order = random.randint(100, 1000),
                    total_rating = random.randint(100, 1000),
                    published_date = now,
                    details = fake.paragraph(),
                    description = fake.paragraph(),
                    status = 1,
                )
                
                pr.categories.extend(categories)
                db.add(pr)
                
                for i in range(1, 4):
                    img = random.choice(images)
                    pi = ProductImage(
                        product = pr,
                        path = img,
                        sort = i,
                        status = 1
                    )
                    db.add(pi)
                
                
                for reviewer in reviewers:
                    rr = ProductReview(
                        product = pr,
                        user = reviewer,
                        rating = random.randint(0, 100),
                        review = fake.paragraph(),
                        status = 1
                    )
                    db.add(rr)
                    
                for colour in colours:
                    for size in sizes:
                        inv = ProductInventory(
                            product = pr,
                            colour = colour,
                            size = size,
                            status = 1,
                            stock = random.randint(1, 100),
                        )
                        db.add(inv)
                
            db.commit()
                
                
    def seed_user(self):
        now = datetime.datetime.utcnow()
        db = next(get_db())
        total_user = db.query(User).count()
        _max = 10
        if total_user == 0:
            
            for _ in range(_max):
                
                fake = Faker()
                gender = random.randint(1,2)
                gender_char = "M" if gender == 1 else "F"
                first_name = fake.first_name_male() if gender == 1 else fake.first_name_female()
                last_name = fake.last_name()
                email = fake.ascii_safe_email()
                password = self.hash_pass("Qwerty123!")
                
                user = User(
                    email = email,
                    phone = fake.phone_number(),
                    password = password,
                    first_name = first_name,
                    last_name = last_name,
                    gender = gender_char,
                    country =  fake.country(),
                    city = fake.city(),
                    zip_code = fake.zipcode(),
                    address = fake.street_address()
                )
                db.add(user)
                
                auth = Authentication(
                    user = user,
                    type = 'email-confirm',
                    credential = email,
                    expired_at = now,
                    token = fake.uuid4()
                )
                db.add(auth)
                
            db.commit()
        