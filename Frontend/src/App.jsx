// import { Routes, Route } from "react-router-dom";
// import ProtectedRoute from "./Components/ProtectedRoute";
// import FarmerLayout from "./Pages/Farmer/FarmerLayout";
// import BuyerLayout from "./Pages/Buyer/BuyerLayout";
// import Dashboard from "./Pages/Farmer/Dashboard";
// import MarketPrices from "./Pages/Farmer/MarketPrices";
// import Inquires from "./Pages/Farmer/Inquires";
// import BrowseProducts from "./Pages/Buyer/BrowseProducts";
// import ProductDetails from "./Pages/Buyer/ProductDetails";
// import SendInquiries from "./Pages/Buyer/SendInquiries";
// import MyInquiries from "./Pages/Buyer/MyInquiries";
// import LandingPage from "./Pages/LandingPage.jsx";
// import Login from "./Pages/Login.jsx";
// import NavBar from "./Components/NavBar/index.jsx";
// import { HeroSection } from "./Components/HeroSection/index.jsx";
// import LandingPageNavBar from "./Components/LandingPageNavBar/index.jsx";
// import { ProblemSolution } from "./Components/ProblemAndSolutionSection/index.jsx";
// import { Features } from "./Components/Features/index.jsx";
// import { HowItWorks } from "./Components/HowItWorks/index.jsx";

// function App() {
//   return (
//     //   <Routes>
//     //     {/* Public Pages */}
//     //     <Route path="/" element={<LandingPage />} />
//     //     <Route path="/login" element={<Login />} />

//     //     {/* Farmer Pages */}
//     //     <Route
//     //       path="/farmer"
//     //       element={
//     //         <ProtectedRoute>
//     //           <FarmerLayout />
//     //         </ProtectedRoute>
//     //       }
//     //     >
//     //       <Route path="dashboard" element={<Dashboard />} />
//     //       <Route path="market-prices" element={<MarketPrices />} />
//     //       <Route path="inquiries" element={<Inquires />} />
//     //     </Route>

//     //     {/* Buyer Pages */}
//     //     <Route
//     //       path="/buyer"
//     //       element={
//     //         <ProtectedRoute>
//     //           <BuyerLayout />
//     //         </ProtectedRoute>
//     //       }
//     //     >
//     //       <Route path="browse" element={<BrowseProducts />} />
//     // <Route path="details/:productId" element={<ProductDetails />} />
//     //       <Route path="send-inquiry" element={<SendInquiries />} />
//     //       <Route path="my-inquiries" element={<MyInquiries />} />
//     //     </Route>
//     //   </Routes>
//     <>
//       <LandingPage />
//     </>
//   );
// }

// export default App;
import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./Components/ProtectedRoute";
import FarmerLayout from "./Pages/Farmer/FarmerLayout";
import BuyerLayout from "./Pages/Buyer/BuyerLayout";
import Dashboard from "./Pages/Farmer/Dashboard";
import MarketPrices from "./Pages/Farmer/MarketPrices";
import Inquires from "./Pages/Farmer/Inquires";
import BrowseProducts from "./Pages/Buyer/BrowseProducts";
import ProductDetails from "./Pages/Buyer/ProductDetails";
import SendInquiries from "./Pages/Buyer/SendInquiries";
import MyInquiries from "./Pages/Buyer/MyInquiries";
import LandingPage from "./Pages/LandingPage";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Cart from "./Pages/Buyer/Cart";
import BlockchainExplorer from "./Pages/BlockChainExplorer";
import PaymentsHome from "./Pages/paymentsHome";
import TransactionDetail from "./Pages/TransactionDetails";
import UserDashboard from "./Pages/Buyer/Dashboard";
import OrdersPage from "./Pages/Farmer/Orders";
import BlockchainPageFarmer from "./Pages/Farmer/Blockchain";
import ProductsPage from "./Pages/Farmer/ProductsPage";
import WalletPage from "./Pages/Buyer/WalletPage";
import AnalyticsPage from "./Pages/Farmer/Analytics";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/market-prices" element={<MarketPrices />} />
      <Route path="/browse" element={<BrowseProducts />} />
      {/* <Route path="/dashboard" element={<FarmerDashboard />} /> */}
      {/* <Route path="/browse" element={<BrowseProducts />} /> */}

      {/* Farmer Pages */}
      <Route
        path="/farmer"
        element={
          <ProtectedRoute>
            <FarmerLayout />
          </ProtectedRoute>
        }
      >
        <Route path="market-prices" element={<MarketPrices />} />
        <Route path="inquiries" element={<Inquires />} />
      </Route>
      <Route path="/browse" element={<BrowseProducts />} />
      <Route path="/details/:productId" element={<ProductDetails />} />
      <Route path="/cart" element={<Cart />} />

      <Route path="/farmer/dashboard" element={<Dashboard />} />
      <Route path="/farmer/orders" element={<OrdersPage />} />
      <Route path="/farmer/products" element={<ProductsPage />} />
      <Route path="/farmer/blockchain" element={<BlockchainPageFarmer />} />
      <Route path="/farmer/analytics" element={<AnalyticsPage />} />

      {/* Buyer Pages */}
      <Route
        path="*"
        element={
          <div className="flex h-screen w-full items-center justify-center">
            404 Page Not Found
          </div>
        }
      >
        <Route path="send-inquiry" element={<SendInquiries />} />
        <Route path="my-inquiries" element={<MyInquiries />} />
      </Route>
      <Route path="/buyer-dashboard" element={<UserDashboard />} />
      <Route path="/blockchain-explorer" element={<BlockchainExplorer />} />
      <Route path="/buyer/wallet" element={<WalletPage />} />
      <Route path="/paymenthome" element={<PaymentsHome />} />
      <Route path="/transaction/:hash" element={<TransactionDetail />} />
    </Routes>
  );
}

export default App;

// import React from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// // Import your existing Layouts/Components
// import NavBar from "./Components/NavBar/index.jsx"; // Assuming you have a Navbar
// import Footer from "./Components/Footer/index.jsx";

// // Import the Pages you just built
// import LandingPage from "./Pages/LandingPage.jsx";
// import Login from "./Pages/Login.jsx";
// import Register from "./Pages/Public/Register.jsx"; // The updated Farmer Register
// import AdminDashboard from "./Pages/Admin/AdminDashboard.jsx"; // The new Admin Dashboard

// // Import Farmer Dashboard (Assuming you have this from previous tasks)
// import FarmerDashboard from "./Pages/Farmer/Dashboard.jsx";

// function App() {
//   return (
//     <Router>
//       <div className="bg-dark min-h-screen text-white font-sans">
//         <NavBar />

//         <Routes>
//           {/* Public Routes */}
//           <Route path="/" element={<LandingPage />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/register" element={<Register />} />

//           {/* Protected Routes (In real app, wrap these in authentication checks) */}
//           <Route path="/admin" element={<AdminDashboard />} />
//           <Route path="/dashboard" element={<FarmerDashboard />} />
//         </Routes>

//         <Footer />
//       </div>
//     </Router>
//   );
// }

// export default App;
