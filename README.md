# Online Store Website

<p>
   An online store is a website or digital platform where businesses sell products or services to customers over the internet. It allows users to browse items, 
   add them to a virtual shopping cart, make secure payments, 
   and receive the goods or services through delivery or online access.
</p>

<p>
	The primary goal of an online store is to facilitate commercial transactions online. It bridges the gap between businesses 
	and customers by offering an 
	interactive platform where users can explore offerings, make purchases, and provide feedback.
</p> 

<p>
	It’s essentially a digital version of a physical shop, accessible 24/7, designed for convenience and a wide reach.
</p>

<p>For Online Demo : <a target="_blank" href="https://sandy-online-store.vercel.app/">https://sandy-online-store.vercel.app</a></p>

# Preview

<img src="https://5an9y4lf0n50.github.io/demo-images/online-store/home.png" alt="home" />


# Features

<ol type="1">
	<li>
		Authentication
		<ol type="1">
			<li>Login</li>
			<li>Register</li>
			<li>Account Confirmation</li>
			<li>Forgot Password</li>
			<li>Reset Password</li>
		</ol>
	</li>
	<li>
		User Account
		<ol type="1">
			<li>Change Password</li>
			<li>Manage Profile</li>
		</ol>
	</li>
	<li>
		General Page
		<ol type="1">
			<li>Home</li>
			<li>Product Catalog</li>
			<li>Product Detail Page</li>
			<li>Shopping Cart</li>
			<li>Checkout Process</li>
			<li>Newslettter</li>
		</ol>
	</li>
</ol>

# Technologies Used

<ol type="1">
	<li>Visual Studio Code</li>
	<li>Modern Web Browser</li>
	<li>Git 2.4</li>
	<li>
		Backend Technologies
		<ol type="1">
			<li>MySQL 5.7 / Maria DB 11.3</li>
			<li>Python 3.x</li>
			<li>Pip 20.x </li>
			<li>Fast API</li>
		</ol>
	</li>
	<li>
		Frontend Technologies
		<ol type="1">
			<li>CSS3</li>
			<li>HTML5</li>
			<li>Bootstrap 5</li>
			<li>Node JS LTS</li>
			<li>React JS</li>
		</ol>
	</li>
</ol>

## Getting Started
#### 1. Clone the repository and navigate to the directory
```shell
git clone https://github.com/sandy-andryanto/fast-api-online-store.git
cd fast-api-online-store
```

#### 2. Install backend dependencies, please move to directory fast-api-online-store/backend
```shell
pip install "fastapi[standard]" or pip3 install "fastapi[standard]"
pip install -r requirements.txt or pip3 install -r requirements.txt
# For Linux Based Only
sudo apt-get install pkg-config python3-dev default-libmysqlclient-dev build-essential 
```

#### 3. Make a .env in fast-api-online-store/backend file and customize its settings 
```shell
APP_ENV=
DB_HOST=
DB_PORT=
DB_NAME=
DB_USERNAME=
DB_PASSWORD=
ALGORITHM=HS256
JWT_SECRET_KEY= # openssl rand -hex 32 in console
JWT_REFRESH_SECRET_KEY= 
```

#### 4. Start MySQL / Maria DB Service , Seed data and Running REST API
```shell
sudo service mysqld start / sudo systemctl start mariadb
CREATE DATABASE {database-name}
fastapi dev main.py
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

#### 5. Install frontend dependencies, please move to directory fast-api-online-store/frontend
```shell
npm install
```

#### 6. Make a .env.local file and customize its settings 
```shell
REACT_APP_TITLE="My Website"
REACT_APP_BACKEND_URL=http://localhost:8000
```

#### 7. Run Application 
```shell
cd frontend
npm run dev
```

#### 8. Access application by entering [https://localhost:5173](https://localhost:5173) in the browser.

<br/>
<img src="https://5an9y4lf0n50.github.io/demo-images/online-store/store.png" alt="store" />
</br>
<img src="https://5an9y4lf0n50.github.io/demo-images/online-store/product.png" alt="product" />
</br>
<img src="https://5an9y4lf0n50.github.io/demo-images/online-store/checkout.png" alt="checkout" />
</br>
<img src="https://5an9y4lf0n50.github.io/demo-images/online-store/login.png" alt="login"/>
</br>
<img src="https://5an9y4lf0n50.github.io/demo-images/online-store/register.png" alt="register" />


#### 9. Developer Contact
<ul>
	<li>
		<strong>Telegram</strong> <a target="_blank" href="https://t.me/sandy_andryanto">https://t.me/sandy_andryanto</a>
	</li>
	<li>
		<strong>Gmail</strong> <a  href="mailto:sandy.andryanto.official@gmail.com">sandy.andryanto.official@gmail.com</a>
	</li>
</ul>
