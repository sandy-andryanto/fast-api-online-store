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

from src.model import *
from src.database import engine, Base
from src import database
from src.seed import Seed
from src.view_auth import view_auth
from src.view_home import view_home
from src.view_profile import view_profile
from src.view_order import view_order
from src.view_shop import view_shop
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path

Base.metadata.create_all(bind=engine)

seed = Seed()
seed.run()

Path("uploads").mkdir(parents=True, exist_ok=True)

app = FastAPI()
app.include_router(view_auth)
app.include_router(view_home)
app.include_router(view_profile)
app.include_router(view_order)
app.include_router(view_shop)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_FOLDER = Path("uploads")
app.mount("/uploads", StaticFiles(directory=UPLOAD_FOLDER), name="uploads")