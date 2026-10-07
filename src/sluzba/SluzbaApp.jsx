import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import Offers from "./components/Offers.jsx";
import Steps from "./components/Steps.jsx";
import OrderForm from "./components/OrderForm.jsx";
import Footer from "./components/Footer.jsx";

export default function SluzbaApp() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Offers />
        <Steps />
        <OrderForm />
      </main>
      <Footer />
    </>
  );
}
