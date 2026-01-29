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

from pydantic import BaseModel, EmailStr, Field
from typing import List

class UserLoginSchema(BaseModel):
    email: EmailStr
    password: str
    
class UserForgotSchema(BaseModel):
    email: EmailStr
    
class UserResetSchema(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)
    password_confirm: str = Field(..., min_length=8)
    
class UserRegisterSchema(BaseModel):
    name: str = Field(..., min_length=8)
    email: EmailStr
    password: str = Field(..., min_length=8)
    password_confirm: str = Field(..., min_length=8)
    
class UserProfileSchema(BaseModel):
    email: EmailStr
    phone: str = Field(..., min_length=7)
    first_name: str = Field(..., min_length=3)
    last_name: str = Field(..., min_length=3)
    gender: str = Field(..., min_length=1)
    address: str | None = None
    country: str | None = None
    city: str | None = None
    zip_code: str | None = None
    
class UserPasswordSchema(BaseModel):
    current_password: str = Field(..., min_length=8)
    password: str = Field(..., min_length=8)
    password_confirm: str = Field(..., min_length=8)
    
class NewsLetterSchema(BaseModel):
    email: EmailStr    

class CreateCartSchema(BaseModel):
    size_id: int
    colour_id: int
    qty: int
    
class CreateReviewSchema(BaseModel):
    rating: int
    review: str = Field(..., min_length=2)
    
class CheckoutSchema(BaseModel):
    payment_id: int
    email: EmailStr
    phone: str = Field(..., min_length=7)
    first_name: str = Field(..., min_length=3)
    last_name: str = Field(..., min_length=3)
    gender: str = Field(..., min_length=1)
    address: str | None = None
    country: str | None = None
    city: str | None = None
    zip_code: str | None = None
    notes: str | None = None