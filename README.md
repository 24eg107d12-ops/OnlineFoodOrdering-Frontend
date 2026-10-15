# 🍕 FoodExpress — Frontend (React & Vite)

A modern, responsive online food ordering single-page application built with **React**, **Vite**, and custom responsive CSS.

---

## ✨ Key Features

- **Instant Demo Login**: One-click quick login for testing (Customer, Delivery Driver, Admin).
- **Interactive Restaurant Discovery**: Filter by culinary categories (Burgers, Pizza, Asian, Desserts, Healthy, Beverages).
- **Search & Sort**: Real-time restaurant name search and sorting by rating or name.
- **Cart & Checkout**: Interactive slide-out drawer with quantity controls, tax calculation, delivery address, and payment method selection (Cash on Delivery, Credit/Debit Card, UPI).
- **Live Order Tracking**: Multi-step order tracking stepper modal with live progress.
- **Order History**: View past orders and status.
- **Resilient Fallback Mode**: If the Spring Boot backend server is not running, the application gracefully switches to embedded mock demo data so all features work seamlessly.

---

## 🛠️ Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Icons**: Lucide React
- **Styling**: Vanilla CSS (Responsive Flexbox & Grid, CSS variables, glassmorphism)

---

## 🚀 How to Run the Frontend

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18 or higher recommended)

### Steps:
1. **Clone the repository**:
   ```bash
   git clone https://github.com/24eg107d12-ops/OnlineFoodOrdering-Frontend.git
   cd OnlineFoodOrdering-Frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Navigate to `http://localhost:5173`

---

## 🔗 Connected Backend

- By default, Vite proxies backend requests to the Spring Boot REST API running at:
  ```text
  http://localhost:8081
  ```
- Backend repository: [OnlineFoodOrdering-Backend](https://github.com/24eg107d12-ops/OnlineFoodOrdering-Backend)
