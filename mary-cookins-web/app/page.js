"use client";

import { useState } from "react";
import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";

const PRODUCTS = [
  { id: 1, name: "Coração Decorado", price: 15.0, image: "/hero_cookie.png", desc: "Biscoito amanteigado com glacê real em formato de coração." },
  { id: 2, name: "Flor de Menta", price: 12.0, image: "/hero_cookie.png", desc: "Biscoito macio com detalhes florais em tons de menta." },
  { id: 3, name: "Kit Clássico (5 un)", price: 60.0, image: "/hero_cookie.png", desc: "Mix com nossos biscoitos mais vendidos em cores pastéis." }
];

export default function Home() {
  const [cart, setCart] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [step, setStep] = useState(1); // 1: Menu, 2: Checkout, 3: Pix, 4: Success
  const [pixPayload, setPixPayload] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const cartTotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  const handleSchedule = async (e) => {
    e.preventDefault();
    if (cart.length === 0 || !selectedDate || !customerName || !customerPhone) {
      alert("Por favor, preencha todos os campos e adicione produtos ao carrinho.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/calendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: customerName,
          phone: customerPhone,
          date: selectedDate,
          items: cart,
          total: cartTotal
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Erro ao agendar pedido");
      }

      // Generate a mock PIX payload for demonstration (in production use a real API)
      const mockPixPayload = `00020126360014br.gov.bcb.pix0114+5511999999999520400005303986540${cartTotal.toFixed(2).replace('.', '')}5802BR5912Mary Cookins6009Sao Paulo62070503***6304`;
      setPixPayload(mockPixPayload);
      setStep(3);
    } catch (err) {
      alert(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const confirmPayment = () => {
    // In a real app, you'd poll a backend to verify PIX payment. Here we mock it.
    setStep(4);
  };

  return (
    <main>
      {/* Hero Section */}
      <section className="section" style={{ background: "var(--color-primary)", color: "var(--color-white)", paddingTop: "100px", paddingBottom: "100px", textAlign: "center" }}>
        <div className="container animate-fade-in">
          <h1 style={{ color: "var(--color-white)", fontSize: "4rem", marginBottom: "20px" }}>Mary Cookins</h1>
          <p style={{ fontSize: "1.2rem", maxWidth: "600px", margin: "0 auto 40px", opacity: 0.9 }}>
            Biscoitos decorados com arte e sabor. Escolha os seus favoritos e agende a data de entrega.
          </p>
          {step === 1 && (
            <a href="#menu" className="btn btn-secondary">Ver Catálogo</a>
          )}
        </div>
      </section>

      <div className="container">
        {step === 1 && (
          <section id="menu" className="section animate-fade-in delay-1">
            <h2 className="section-title">Nosso Menu</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "30px" }}>
              {PRODUCTS.map((prod) => (
                <div key={prod.id} className="glass" style={{ padding: "20px", textAlign: "center", display: "flex", flexDirection: "column" }}>
                  <div style={{ position: "relative", width: "100%", height: "250px", marginBottom: "20px", borderRadius: "10px", overflow: "hidden" }}>
                    <Image src={prod.image} alt={prod.name} fill style={{ objectFit: "cover" }} />
                  </div>
                  <h3>{prod.name}</h3>
                  <p style={{ color: "var(--color-text-light)", flexGrow: 1 }}>{prod.desc}</p>
                  <p style={{ fontSize: "1.2rem", fontWeight: "bold", color: "var(--color-primary)", margin: "15px 0" }}>
                    R$ {prod.price.toFixed(2).replace('.', ',')}
                  </p>
                  <button className="btn" onClick={() => addToCart(prod)}>Adicionar</button>
                </div>
              ))}
            </div>

            {cart.length > 0 && (
              <div style={{ marginTop: "50px", textAlign: "center" }}>
                <button className="btn btn-secondary" onClick={() => setStep(2)}>
                  Ir para Agendamento ({cart.length} itens)
                </button>
              </div>
            )}
          </section>
        )}

        {step === 2 && (
          <section className="section animate-fade-in">
            <h2 className="section-title">Finalizar Pedido</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px" }}>
              <div className="glass" style={{ padding: "30px" }}>
                <h3>Seu Carrinho</h3>
                {cart.map((item) => (
                  <div key={item.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px", borderBottom: "1px solid #eee", paddingBottom: "10px" }}>
                    <div>
                      <strong>{item.name}</strong> x{item.qty}
                    </div>
                    <div>
                      R$ {(item.price * item.qty).toFixed(2).replace('.', ',')}
                      <button onClick={() => removeFromCart(item.id)} style={{ marginLeft: "10px", background: "none", border: "none", color: "red", cursor: "pointer" }}>X</button>
                    </div>
                  </div>
                ))}
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.2rem", fontWeight: "bold", marginTop: "20px", color: "var(--color-primary)" }}>
                  <span>Total:</span>
                  <span>R$ {cartTotal.toFixed(2).replace('.', ',')}</span>
                </div>
                <button className="btn" style={{ marginTop: "20px", width: "100%", background: "#ccc", color: "#333" }} onClick={() => setStep(1)}>Voltar ao Menu</button>
              </div>

              <div className="glass" style={{ padding: "30px" }}>
                <h3>Agendamento</h3>
                <form onSubmit={handleSchedule} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                  <div>
                    <label style={{ display: "block", marginBottom: "5px" }}>Nome Completo</label>
                    <input type="text" required value={customerName} onChange={e => setCustomerName(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }} />
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: "5px" }}>WhatsApp</label>
                    <input type="text" required value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }} />
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: "5px" }}>Data de Entrega</label>
                    <input type="date" required value={selectedDate} onChange={e => setSelectedDate(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }} min={new Date().toISOString().split('T')[0]} />
                    <small style={{ color: "var(--color-text-light)" }}>Sujeito a disponibilidade (Limite de 15 pedidos/semana)</small>
                  </div>
                  <button type="submit" className="btn btn-secondary" disabled={isLoading} style={{ marginTop: "10px" }}>
                    {isLoading ? "Verificando Data..." : "Confirmar e Pagar"}
                  </button>
                </form>
              </div>
            </div>
          </section>
        )}

        {step === 3 && (
          <section className="section animate-fade-in" style={{ textAlign: "center" }}>
            <h2 className="section-title">Pagamento via PIX</h2>
            <div className="glass" style={{ padding: "40px", maxWidth: "500px", margin: "0 auto" }}>
              <p style={{ marginBottom: "20px" }}>Escaneie o QR Code abaixo para pagar o valor de <strong>R$ {cartTotal.toFixed(2).replace('.', ',')}</strong></p>
              <div style={{ background: "#fff", padding: "20px", display: "inline-block", borderRadius: "10px", marginBottom: "20px" }}>
                <QRCodeSVG value={pixPayload} size={200} />
              </div>
              <div>
                <input type="text" readOnly value={pixPayload} style={{ width: "100%", padding: "10px", marginBottom: "20px", borderRadius: "5px", border: "1px solid #ccc", textAlign: "center" }} />
              </div>
              <button className="btn btn-secondary" onClick={confirmPayment} style={{ width: "100%" }}>Já realizei o pagamento</button>
            </div>
          </section>
        )}

        {step === 4 && (
          <section className="section animate-fade-in" style={{ textAlign: "center" }}>
            <h2 className="section-title" style={{ color: "var(--color-secondary)" }}>Pedido Confirmado!</h2>
            <div className="glass" style={{ padding: "40px", maxWidth: "600px", margin: "0 auto" }}>
              <p style={{ fontSize: "1.2rem", marginBottom: "20px" }}>
                Obrigado, <strong>{customerName}</strong>! Seu pagamento foi confirmado e seu pedido foi agendado para o dia <strong>{new Date(selectedDate).toLocaleDateString('pt-BR')}</strong>.
              </p>
              <p style={{ color: "var(--color-text-light)" }}>Entraremos em contato pelo WhatsApp ({customerPhone}) em breve com mais detalhes.</p>
              <button className="btn" onClick={() => { setStep(1); setCart([]); setCustomerName(""); setCustomerPhone(""); setSelectedDate(""); }} style={{ marginTop: "30px" }}>Fazer Novo Pedido</button>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
