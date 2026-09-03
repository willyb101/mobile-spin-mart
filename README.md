# Spark Mobile

Use the following detailed prompt with an AI website builder or coding AI:

Prompt:

Build a complete, production-ready e-commerce website for selling smartphones and mobile accessories. The website must be modern, responsive, secure, and include an administrative dashboard.

Project Requirements

Website Name

"SmartPhone Hub"

Frontend Features

Homepage

Professional and modern design.

Featured smartphones section.

Latest arrivals section.

Best-selling phones section.

Promotional banners.

Customer testimonials.

Newsletter subscription.

Product Catalog

Display phones with images, specifications, prices, and availability.

Search functionality.

Filter by:

Brand

Price range

RAM

Storage

Operating System

Product sorting options.

Product Details Page

Multiple product images.

Full specifications.

Customer reviews and ratings.

Add to Cart button.

Add to Wishlist button.

Related products section.

Shopping Cart

Update quantity.

Remove items.

Calculate subtotal, taxes, and total price.

Checkout System

Secure checkout process.

Guest checkout and registered user checkout.

Order summary.

Payment integration structure (Stripe/PayPal ready).

User Accounts

Registration.

Login.

Password reset.

Order history.

Wishlist management.

Profile management.

Spin Wheel Discount System

Create a "Spin & Win" feature with the following:

Users can spin once every 24 hours.

Require login before spinning.

Discounts:

5% Off

10% Off

15% Off

20% Off

Free Shipping

No Prize

Generate unique coupon codes.

Store coupon history in database.

Prevent users from exploiting the wheel.

Animated wheel with sound effects.

Mobile-friendly design.

Dashboard analytics showing:

Number of spins

Coupons issued

Coupons redeemed

Admin Dashboard

Create a secure admin panel with:

Dashboard Overview

Total sales

Revenue

Orders

Registered users

Inventory status

Spin wheel statistics

Product Management

Add products

Edit products

Delete products

Upload multiple images

Manage stock levels

Order Management

View orders

Update order status

Generate invoices

Export orders

Customer Management

View customers

Suspend accounts

View purchase history

Coupon Management

View all coupons

Disable coupons

Create promotional coupons

Security Monitoring

Login activity logs

Failed login attempts

Suspicious activity alerts

User audit logs

Security Requirements

Implement enterprise-level security:

Authentication

Secure password hashing using bcrypt or Argon2.

Multi-Factor Authentication (MFA) for administrators.

Role-Based Access Control (RBAC).

Session timeout.

Secure JWT authentication.

Protection Against Attacks

SQL Injection protection using parameterized queries.

Cross-Site Scripting (XSS) protection.

Cross-Site Request Forgery (CSRF) protection.

Clickjacking protection.

Rate limiting.

Brute-force login protection.

File upload validation.

Secure HTTP headers.

Content Security Policy (CSP).

Data Security

Encrypt sensitive user data.

HTTPS enforcement.

Secure cookie settings.

Input validation and sanitization.

Monitoring

Security event logging.

Error logging.

Audit trails.

Admin notifications for suspicious activity.

Database Design

Create database tables for:

Users

Roles

Products

Categories

Orders

Order Items

Coupons

Spin Wheel History

Reviews

Wishlist

Shopping Cart

Login Logs

Audit Logs

Include foreign keys and proper indexing.

Technology Stack

Use:

Frontend: React.js + Tailwind CSS

Backend: Node.js + Express.js

Database: PostgreSQL

Authentication: JWT + bcrypt

State Management: Redux Toolkit

API: REST API

Dashboard Charts: Chart.js

Deployment Ready: Docker

Additional Requirements

Mobile-first responsive design.

Dark mode support.

SEO optimization.

Fast loading pages.

Accessibility compliance.

Professional UI/UX.

Clean architecture.

Well-documented code.

Unit and integration tests.

Docker configuration.

Production deployment guide.

Generate the complete source code, database schema, API endpoints, security implementation, dashboard, and deployment instructions.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/91101db3-2d29-4b0a-b1ce-4eb00a0104e3).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
