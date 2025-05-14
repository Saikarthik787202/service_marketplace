# 🎨 Frontend Documentation

## Overview

The frontend is rendered using **EJS templates** served by Express.  
All styling is in `/public/css/style.css`.  
The UI is responsive and role-based (different navigation and features for admin, provider, client).

---

## Folder Structure

```
/views
  /admin
    dashboard.ejs
    categories.ejs
    new-category.ejs
    revenue.ejs
  /auth
    login.ejs
    register.ejs
  /client
    dashboard.ejs
    services.ejs
    orders.ejs
    wishlist.ejs
    address-prompt.ejs
  /provider
    dashboard.ejs
    new-service.ejs
    orders.ejs
    revenue.ejs
  /partials
    header.ejs
    footer.ejs
/public
  /css
    style.css
```

---

## Navigation

- **Header (`partials/header.ejs`)** is included on every page.
- Navigation links are shown/hidden based on user role.

---

## Pages

### Admin

- **Dashboard:** Quick links to revenue and category management.
- **Categories:** List, add, and delete categories.
- **Revenue:** Shows total and per-provider revenue, and all accepted orders.

### Provider

- **Dashboard:** List of provider’s own services.
- **Orders:** Table of orders for provider’s services (with client info, address, contact, purchased date, and status).
- **Revenue:** List and total of accepted orders.

### Client

- **Dashboard:** Grid layout with "How it works", featured categories, and featured products.
- **Services:** Grid of services; filter by category; purchase and wishlist buttons.
- **Orders:** Card-style list with service image, name, status, address, phone, purchased date, and cancel option (if pending).
- **Wishlist:** List of wishlisted services.

---

## Styling

- **All main styles are in `/public/css/style.css`**
- Responsive grid for dashboard and services.
- Card layout for orders and products.
- Modern, clean, and mobile-friendly.

---

## Customizing

- Edit EJS templates for content and structure.
- Edit `style.css` for colors, spacing, and layout.
- Add new partials or views as needed.

---

## Assets

- Place images, icons, and other static files in `/public`.

---

## Running the Frontend

- The frontend is served by Express; visit [http://localhost:5000](http://localhost:5000) after starting the backend.

---

## Extending

- everything is handled through server-rendered EJS views and standard form submissions (POST/GET), not via AJAX or RESTful API endpoints.
we haven't used any api's for this project