import { ThemeProvider } from "./context/ThemeContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import Header from "./components/Header.jsx";
import AuthModal from "./components/AuthModal.jsx";
import CartModal from "./components/CartModal.jsx";
import Hero from "./components/Hero.jsx";
import SectionBreak from "./components/SectionBreak.jsx";
import Booking from "./components/Booking.jsx";
import Merch from "./components/Merch.jsx";
import Footer from "./components/Footer.jsx";

export default function TrackWiseApp() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <Header />
          <AuthModal />
          <CartModal />

          <Hero />
          <SectionBreak />
          <Booking />
          <Merch />
          <Footer />
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
