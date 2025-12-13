import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./Context/AuthContext.jsx";
import { CartProvider } from "./Context/CartContext.jsx"; // ✅ fixed
import { Web3Provider } from "./Context/Web3Context.jsx";
import { EscrowProvider } from "./Context/EscrowContext.jsx";
import "./index.css";
import App from "./App.jsx";
import "./i18n.js";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Web3Provider>       {/* ✅ ADD THIS */}
            <EscrowProvider>  {/* ✅ ADD THIS (optional but needed if you're using escrow) */}
              <App />
            </EscrowProvider>
          </Web3Provider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);

