import { Route, Routes } from "react-router-dom";
import "./App.css";
import PaymentForm from "./components/PaymentForm";
import Success from "./components/Success";
import Suscription from "./components/suscription";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<PaymentForm />} />
        <Route path="/success" element={<Success />} />
        <Route path="/suscribtion" element={<Suscription />} />
        {/* <Route path="/sub/:id" element={<Suscription />} /> */}
      </Routes>
    </>
  );
}

export default App;
