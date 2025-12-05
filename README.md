# Xeno Analytics
### Multi-Tenant Shopify Data Ingestion & Business Intelligence Platform

<div align="center">

<img src="./assets/cross.gif" alt="x" width="80"/> 

[![Live Demo](https://img.shields.io/badge/Live-Demo-success?style=for-the-badge&logo=vercel)](https://xeno-savyagupta.vercel.app/login)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-black?style=for-the-badge&logo=github)](https://github.com/savyagupta-2004/xeno-savyagupta)

*Enterprise-grade analytics platform enabling retailers to seamlessly integrate, analyze, and visualize their Shopify store data in real-time.*

</div>

---
# Shopify Development Store Setup Guide

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **PostgreSQL** database

---

## Step 1: Create Shopify Partner Account

1. Navigate to [partners.shopify.com](https://partners.shopify.com)
2. Click **"Join Shopify Partners"**
3. Fill in your details and complete the registration process
4. Create your account
> **Note:** A Shopify Partner account gives you access to development stores and app development tools.

---

## Step 2: Create Development Store

1. In your Partners dashboard, navigate to **"Stores"**
2. Click **"Add store"** → **"Development store"**
3. Select **"Create a new development store"**
4. Fill in the required store details
5. Click **"Save"**

---

## Step 3: Configure Store Settings

When setting up your development store, configure the following:

- **Store name:** Choose a descriptive name (e.g., "Xeno Analytics Test Store")
- **Country/Region:** Select your primary location
- **Store purpose:** Select **"To test and develop apps"**

Once configured, click **"Create development store"**

---

## Step 4: Access Your Store

After creation, you can access your store in multiple ways:

1. **View Store:** Click on your store name in the Partners dashboard
2. **Store URL:** Note your store URL (format: `your-store.myshopify.com`)
3. **Frontend Access:** Click **"Open store"** to view the customer-facing storefront
4. **Admin Access:** Click **"Admin"** to access the Shopify admin dashboard

---

## Step 5: Navigate Shopify Admin Panel

The Shopify Admin panel is your main interface for managing:

- Products and inventory
- Orders and customers
- Store settings and apps
- Analytics and reports
- Theme customization

You can access the admin panel directly using:
```
https://your-store.myshopify.com/admin
```

---

## Next Steps

With your development store set up, you're ready to:

- Install and configure your app
- Test webhooks and API integrations
- Add sample products and customers
- Configure payment and shipping settings

---

## Additional Resources
<img src="./assets/s1.png"></img>
<img src="./assets/s3.png"></img>
<img src="./assets/s4.png"></img>
<img src="./assets/s5.png"></img>

- [Shopify Partner Documentation](https://shopify.dev/docs)
- [Shopify API Reference](https://shopify.dev/api)
- [Development Store Limitations](https://help.shopify.com/en/partners/dashboard/managing-stores/development-stores)

---

**Need Help?** Visit the [Shopify Community Forums](https://community.shopify.com) or contact Shopify Partner Support.
---

##  Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)  
- [Live Deployment](#-live-deployment)
- [Architecture](#-system-architecture)
- [Technology Stack](#-technology-stack)
- [Visual Showcase](#-visual-showcase)
- [Database Design](#-database-schema)
- [API Documentation](#-api-endpoints)
- [Getting Started](#-getting-started)
- [Connect](#-connect-with-me)

---

##  Overview

Xeno Analytics is a sophisticated multi-tenant SaaS platform designed to bridge the gap between Shopify's e-commerce capabilities and enterprise-level business intelligence. Built with modern web technologies and cloud-native architecture, it provides retailers with actionable insights through seamless data synchronization and advanced analytics.

### What It Solves

**Enterprise retailers struggle with:**
- Data fragmentation across systems
- Limited native Shopify analytics
- Multi-store management complexity
- Lack of real-time business visibility

**Xeno Analytics provides:**
- Real-time data synchronization via webhooks
- Multi-tenant architecture with complete data isolation
- Advanced analytics dashboard with customizable metrics
- Enterprise security with JWT authentication
- Scalable cloud-native infrastructure

---

##  Key Features

###  Authentication & Security
- JWT-based session management
- Multi-tenant data isolation
- bcrypt password encryption
- Role-based access control

### Analytics Dashboard
- Real-time metrics (customers, orders, revenue)
- Interactive charts and visualizations
- Date range filtering
- Top customer analysis
- Inventory management insights
- Cart abandonment tracking

### Data Synchronization
- Shopify webhook integration
- Automated data ingestion
- Manual sync capability
- Robust error handling

### Multi-Tenant Architecture
- Streamlined tenant onboarding
- Complete data isolation per tenant
- Custom store configurations
- Unlimited scalability

---

## Live Deployment

| Service | Platform | URL |
|---------|----------|-----|
| **Frontend** | Vercel | [https://xeno-savyagupta.vercel.app](https://xeno-savyagupta.vercel.app/login) |
| **Backend** | Render | [Production API](https://xeno-savyagupta-backend.onrender.com/) |
| **Database** | Railway | PostgreSQL |

---

## System Architecture

```
┌──────────────────────────────────────────────────────┐
│                   CLIENT LAYER                        │
│  ┌────────────────────────────────────────────────┐  │
│  │         React.js Frontend Application           │  │
│  │  • Authentication  • Dashboard  • Analytics     │  │
│  └────────────────────────────────────────────────┘  │
└─────────────────────┬────────────────────────────────┘
                      │ HTTPS/REST
┌─────────────────────▼────────────────────────────────┐
│                APPLICATION LAYER                      │
│  ┌────────────────────────────────────────────────┐  │
│  │           Express.js API Gateway                │  │
│  │  ┌──────────┐ ┌───────────┐ ┌──────────────┐  │  │
│  │  │   Auth   │ │ Analytics │ │   Shopify    │  │  │
│  │  │   API    │ │    API    │ │ Integration  │  │  │
│  │  └──────────┘ └───────────┘ └──────────────┘  │  │
│  └────────────────────────────────────────────────┘  │
└─────────────────────┬────────────────────────────────┘
                      │ Prisma ORM
┌─────────────────────▼────────────────────────────────┐
│                   DATA LAYER                          │
│  ┌────────────────────────────────────────────────┐  │
│  │      PostgreSQL Database (Railway)             │  │
│  │  • Tenants  • Customers  • Orders  • Products  │  │
│  └────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────┘
```

### Architecture Principles

- **Separation of Concerns**: Clean layer separation
- **Multi-Tenancy**: Shared database with tenant isolation
- **Security-First**: JWT validation on all protected routes
- **Scalability**: Cloud-native design supporting thousands of tenants

---

## Technology Stack

### Frontend
- **React.js 18.x** - UI framework
- **React Router 6.x** - Navigation
- **Axios** - HTTP client  
- **Recharts** - Data visualization
- **CSS3** - Responsive styling

### Backend
- **Node.js 18.x** - Runtime
- **Express.js 4.x** - Web framework
- **Prisma 5.x** - ORM
- **JWT** - Authentication
- **bcryptjs** - Password security

### Infrastructure
- **PostgreSQL** - Database
- **Railway** - DB hosting
- **Vercel** - App deployment
- **Ngrok** - Webhook testing

---

## Visual Showcase

### Landing Page & Authentication
<div align="center">
<img src="./assets/image.png" alt="Landing Page" width="800"/>
</div>

---

### Analytics Dashboard Overview
<div align="center">
<img src="./assets/analytics" alt="Analytics Dashboard" width="800"/>
</div>

---

### pgAdmin
<div align="center">
<img src="./assets/pgadmin" alt="Business Intelligence Charts" width="800"/>
</div>

---

### Webhook Integration & Real-Time Sync
<div align="center">
<img src="./assets/ngrok" alt="Shopify Webhook Integration" width="800"/>
</div>

---

## Database Schema

```sql
-- Tenants Table (Multi-tenant isolation)
CREATE TABLE tenants (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    firstName VARCHAR(100),
    lastName VARCHAR(100),
    tenantId VARCHAR(100) UNIQUE NOT NULL,
    shopDomain VARCHAR(255),
    accessToken TEXT,
    role VARCHAR(50) DEFAULT 'tenant',
    isActive BOOLEAN DEFAULT true,
    createdAt TIMESTAMP DEFAULT NOW(),
    updatedAt TIMESTAMP DEFAULT NOW()
);

-- Customers Table
CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    tenantId INTEGER NOT NULL REFERENCES tenants(id),
    shopifyCustomerId BIGINT,
    firstName VARCHAR(255),
    lastName VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    totalSpent DECIMAL(12,2) DEFAULT 0.00,
    ordersCount INTEGER DEFAULT 0,
    createdAt TIMESTAMP DEFAULT NOW(),
    UNIQUE(tenantId, shopifyCustomerId)
);

-- Products Table
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    tenantId INTEGER NOT NULL REFERENCES tenants(id),
    shopifyProductId BIGINT,
    title VARCHAR(500) NOT NULL,
    vendor VARCHAR(255),
    productType VARCHAR(255),
    price DECIMAL(12,2),
    inventory INTEGER DEFAULT 0,
    createdAt TIMESTAMP DEFAULT NOW(),
    UNIQUE(tenantId, shopifyProductId)
);

-- Orders Table
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    tenantId INTEGER NOT NULL REFERENCES tenants(id),
    customerId INTEGER REFERENCES customers(id),
    shopifyOrderId BIGINT,
    orderNumber VARCHAR(100),
    totalPrice DECIMAL(12,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    financialStatus VARCHAR(50),
    orderStatus VARCHAR(50),
    createdAt TIMESTAMP DEFAULT NOW(),
    UNIQUE(tenantId, shopifyOrderId)
);

-- Indexes for Performance
CREATE INDEX idx_customers_tenant ON customers(tenantId);
CREATE INDEX idx_orders_tenant ON orders(tenantId);
CREATE INDEX idx_products_tenant ON products(tenantId);
```

---

## API Endpoints

### Authentication
```http
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/profile
```

### Analytics
```http
GET /api/analytics/overview
GET /api/analytics/customers
GET /api/analytics/orders
GET /api/analytics/revenue
```

### Data Management
```http
GET    /api/customers
GET    /api/customers/:id
GET    /api/orders
GET    /api/orders/:id
GET    /api/products
```

### Shopify Integration
```http
POST /api/shopify/sync
POST /api/webhooks/shopify
GET  /api/shopify/status
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm/yarn
- Shopify Partner Account

### Installation

**1. Clone Repository**
```bash
git clone https://github.com/savyagupta-2004/xeno-savyagupta.git
cd xeno-savyagupta
```

**2. Backend Setup**
```bash
cd xeno-backend
npm install
cp .env.example .env

# Configure .env
DATABASE_URL="postgresql://user:pass@localhost:5432/xeno"
JWT_SECRET="your-secret-key"

# Run migrations
npx prisma migrate dev
npx prisma generate

# Start server
npm run dev
```

**3. Frontend Setup**
```bash
cd xeno-dashboard
npm install

# Configure environment
REACT_APP_API_URL=http://localhost:5000

# Start application
npm start
```

### Shopify Integration

1. Create Shopify Partner account at [partners.shopify.com](https://partners.shopify.com)
2. Create development store
3. Generate API credentials
4. Configure webhooks using ngrok:
```bash
ngrok http 5000
```

### Deployment

**Vercel Deployment**
```bash
npm install -g vercel
cd xeno-dashboard && vercel --prod
cd xeno-backend && vercel --prod
```

**Railway Database**
1. Sign up at railway.app
2. Provision PostgreSQL
3. Copy connection string
4. Run: `npx prisma migrate deploy`

---

## Implementation Highlights

### Multi-Tenant Data Isolation
Every database query is automatically scoped to the authenticated tenant using middleware:

```javascript
// Automatic tenant context injection
app.use(tenantContextMiddleware);

// All queries filtered by tenant
const customers = await prisma.customer.findMany({
  where: { tenantId: req.tenant.id }
});
```

### Real-Time Webhook Processing
Shopify webhooks are processed asynchronously with retry logic:

```javascript
// Webhook handler with signature verification
app.post('/api/webhooks/shopify', verifyWebhook, async (req, res) => {
  const event = req.headers['x-shopify-topic'];
  await processWebhookEvent(event, req.body);
  res.status(200).send('OK');
});
```

### Secure Authentication Flow
JWT-based authentication with HTTP-only cookies and token refresh:

```javascript
// Protected route middleware
const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.tenant = await getTenant(decoded.id);
  next();
};
```

---

## Future Roadmap

### Phase 1: Enhanced Analytics
- Customer segmentation
- Predictive analytics
- Custom report builder
- CSV/PDF exports

### Phase 2: Performance Optimization
- Redis caching layer
- Database query optimization
- CDN integration
- Rate limiting

### Phase 3: Enterprise Features
- Multi-user accounts
- Advanced RBAC
- Custom branding
- API rate limits per tenant
- GDPR compliance tools

### Phase 4: Scalability
- Database sharding
- Microservices architecture
- Message queue (RabbitMQ)
- Horizontal scaling

---

## Assumptions & Design Decisions

**Multi-Tenancy Model**
- Chose shared database with tenant_id isolation over separate databases
- Trade-off: Simpler deployment vs. absolute data separation
- Suitable for up to 10,000 tenants per instance

**Authentication**
- Implemented JWT instead of OAuth for development simplicity
- Production would use Shopify OAuth flow
- Session duration: 24 hours with refresh tokens

**Data Synchronization**
- Manual sync implemented for MVP
- Webhooks configured for real-time updates
- Batch processing for initial data import

**Scalability**
- Current architecture supports 100 concurrent users
- Database indexed for common queries
- Ready for caching layer integration

---



<div align="center">

### Built with ❤️ for the Xeno FDE Internship Assignment 2025

<!-- <img src="./assets/passport_savya.png" alt="Savya Gupta" width="200" style="border-radius: 10px; margin: 20px 0;"/>

**Savya Gupta**  
*Full Stack Developer & Computer Science Student* -->

[![Portfolio](https://img.shields.io/badge/Portfolio-000000?style=for-the-badge&logo=About.me&logoColor=white)](https://savyagupta.netlify.app)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/-savyagupta/)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/savyagupta-2004)


</div>

---

<div align="center">

*Thank you!*

</div>
