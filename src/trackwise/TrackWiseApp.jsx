import { LazyMotion } from "motion/react";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import Header from "./components/Header.jsx";
import AuthModal from "./components/AuthModal.jsx";
import CartModal from "./components/CartModal.jsx";
import CartToast from "./components/CartToast.jsx";
import Hero from "./components/Hero.jsx";
import SectionBreak from "./components/SectionBreak.jsx";
import Booking from "./components/Booking.jsx";
import Merch from "./components/Merch.jsx";
import Footer from "./components/Footer.jsx";

const loadMotionFeatures = () => import("../motionFeatures.js").then((mod) => mod.default);

export default function TrackWiseApp() {
  return (
    <LazyMotion features={loadMotionFeatures} strict>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <Header />
            <AuthModal />
            <CartModal />
            <CartToast />

            <main>
              <Hero />
              <SectionBreak />
              <Booking />
              <Merch />
            </main>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </LazyMotion>
  );
}
