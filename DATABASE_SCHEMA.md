# Database Schema for Footenix Store

This document outlines the Supabase PostgreSQL database schema used for the Footenix Store backend. It serves as a reference for the tables, their columns, and the data types expected by the frontend application.

## 1. `products` Table
Stores the catalog of all items available in the store (cards, packs, stickers, posters).

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `TEXT` (Primary Key) | Unique identifier for the product (e.g., 'CAR-12345'). |
| `name` | `TEXT` | Full name/title of the product. |
| `category` | `TEXT` | Category of the product (`packs`, `cards`, `stickers`, `posters`). |
| `price` | `NUMERIC` | Current selling price of the product. |
| `originalPrice` | `NUMERIC` (Nullable) | Original price (used for strikethrough/discounts). |
| `imageType` | `TEXT` | Fallback icon identifier if image fails to load. |
| `imageUrl` | `TEXT` | URL pointing to the product image (usually Shopify CDN). |
| `description` | `TEXT` | Detailed product description. |
| `badge` | `TEXT` (Nullable) | Highlight badge text (e.g., "100 Club", "Bestseller"). |
| `rating` | `NUMERIC` | Star rating out of 5 (e.g., 5.0). |
| `reviewsCount` | `INTEGER` | Number of reviews. |
| `stock` | `INTEGER` | Available quantity of the product in inventory. |
| `specs` | `JSONB` | JSON object containing `dimensions`, `condition`, `finish`, `series`, `authenticity`. |

---

## 2. `orders` Table
Stores all customer orders placed through the checkout.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `TEXT` (Primary Key) | Unique order identifier (e.g., 'FTX-123456'). |
| `customerName` | `TEXT` | Full name of the customer. |
| `customerEmail` | `TEXT` | Email address of the customer. |
| `customerPhone` | `TEXT` | Phone number provided for delivery updates. |
| `shippingAddress` | `TEXT` | Primary street address. |
| `city` | `TEXT` | City for delivery. |
| `pincode` | `TEXT` | Postal PIN code. |
| `items` | `JSONB` | Array of objects representing the cart items purchased. |
| `subtotal` | `NUMERIC` | Order total before shipping & discounts. |
| `shipping` | `NUMERIC` | Shipping fee applied (e.g., 49 or 0). |
| `total` | `NUMERIC` | Final amount payable. |
| `paymentMethod` | `TEXT` | Selected payment method (`cod`, `upi`, `card`). |
| `status` | `TEXT` | Order fulfillment status (`pending`, `processing`, `shipped`, `delivered`, `cancelled`). |
| `trackingNumber` | `TEXT` (Nullable) | Courier tracking number once shipped. |
| `createdAt` | `TIMESTAMP` | Timestamp of when the order was placed. |

---

## 3. `store_config` Table
Stores global settings, banners, thresholds, branding, and active promotions. This table is expected to only have a **single row** (usually `id = 1`).

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `INTEGER` (Primary Key) | Identifier (usually 1). |
| `heroBannerUrl` | `TEXT` | URL for the main homepage hero banner. |
| `paniniBannerUrl` | `TEXT` | URL for the Panini/Cards section banner. |
| `stickersBannerUrl` | `TEXT` | URL for the Stickers section banner. |
| `postersBannerUrl` | `TEXT` | URL for the Posters section banner. |
| `showPaniniBanner` | `BOOLEAN` | Toggle visibility of the Panini banner. |
| `showStickersBanner` | `BOOLEAN` | Toggle visibility of the Stickers banner. |
| `showPostersBanner` | `BOOLEAN` | Toggle visibility of the Posters banner. |
| `announcementText` | `TEXT` | Text displayed in the very top dark nav bar. |
| `freeShippingThreshold` | `NUMERIC` | Minimum order value to waive the shipping fee. |
| `freeGiftThreshold` | `NUMERIC` | Threshold for a free gift promotion. |
| `codEnabled` | `BOOLEAN` | Whether Cash on Delivery is allowed at checkout. |
| `supportPhone` | `TEXT` | WhatsApp/Phone number for support. |
| `supportEmail` | `TEXT` | Email address for customer support. |
| `storeName` | `TEXT` | Dynamic name of the store (Header & Footer). |
| `storeDescription` | `TEXT` | Short store description for the footer. |
| `instagramUrl` | `TEXT` | Link to store's Instagram (Footer). |
| `facebookUrl` | `TEXT` | Link to store's Facebook (Footer). |
| `twitterUrl` | `TEXT` | Link to store's Twitter (Footer). |
| `activePromoCode` | `TEXT` | The active coupon code users can apply at checkout. |
| `activePromoDiscountType` | `TEXT` | Discount type (`percentage` or `fixed`). |
| `activePromoDiscountValue` | `NUMERIC` | The value of the discount (e.g., 5 for 5%, 100 for Rs.100). |

---

## 4. `admin_users` Table
Stores the credentials for the store owner/admin to access the restricted control panel.

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | `INTEGER` (Primary Key) | Auto-incrementing identifier. |
| `username` | `TEXT` | The login username for the admin. |
| `password` | `TEXT` | The login password. |
| `sessionToken` | `TEXT` (Nullable) | Randomly generated token used to authenticate API requests after login. |
