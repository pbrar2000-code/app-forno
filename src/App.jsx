import React, { useState } from "react";

const today = new Date().toISOString().slice(0, 10);

const masterProducts = [
  "Cazzoti",
  "Lingue",
  "Basi rosse",
  "Basi bianche",
  "Panini all'olio",
  "Panini dolci",
  "Crostatine alle visciole",
];

const customerTemplates = {
  PON001: {
    code: "PON001",
    customerName: "Forno di Pontinia",
    favoriteProducts: ["Basi bianche", "Basi rosse", "Panini dolci"],
  },
  LAT002: {
    code: "LAT002",
    customerName: "Forno di Latina",
    favoriteProducts: ["Crostatine alle visciole", "Panini all'olio", "Lingue", "Cazzoti"],
  },
};

export default function App() {
  const [screen, setScreen] = useState("home");
  const [code, setCode] = useState("");
  const [customer, setCustomer] = useState(null);
  const [items, setItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [searchDate, setSearchDate] = useState(today);

  const login = () => {
    const c = customerTemplates[code.toUpperCase()];
    if (!c) return alert("Codice sbagliato");

    setCustomer(c);
    setItems(c.favoriteProducts.map((p) => ({ product: p, quantity: 0 })));
    setScreen("order");
  };

  const updateQty = (i, val) => {
    const copy = [...items];
    copy[i].quantity = val;
    setItems(copy);
  };

  const addProduct = () => {
    const name = prompt("Nome prodotto");
    if (!name) return;
    setItems([...items, { product: name, quantity: 0 }]);
  };

  const sendOrder = () => {
    const clean = items
      .filter((i) => Number(i.quantity) > 0)
      .map((i) => ({ ...i, quantity: Number(i.quantity) }));

    if (clean.length === 0) return alert("Metti almeno una quantità");

    setOrders([
      ...orders,
      {
        date: today,
        name: customer.customerName,
        items: clean,
      },
    ]);

    alert("Ordine inviato!");
    setScreen("home");
    setCode("");
  };

  const filteredOrders = orders.filter((o) => o.date === searchDate);

  return (
    <div style={{ padding: 20, fontFamily: "Arial, sans-serif", maxWidth: 700, margin: "0 auto" }}>
      <h1>Antico Forno Setino</h1>
      <p>App ordini semplice da usare anche da telefono</p>

      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
        <button onClick={() => setScreen("home")}>Accesso cliente</button>
        <button onClick={() => setScreen("admin")}>Pannello forno</button>
      </div>

      {screen === "home" && (
        <div>
          <h2>Accesso cliente</h2>
          <input
            placeholder="Codice cliente"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            style={{ padding: 10, width: "100%", maxWidth: 300 }}
          />
          <br /><br />
          <button onClick={login}>Entra</button>

          <h3 style={{ marginTop: 30 }}>Codici</h3>
          <p>PON001 - Forno di Pontinia</p>
          <p>LAT002 - Forno di Latina</p>
        </div>
      )}

      {screen === "order" && customer && (
        <div>
          <h2>{customer.customerName}</h2>
          <p>Data: {today}</p>

          {items.map((item, i) => (
            <div key={i} style={{ marginBottom: 10, display: "flex", justifyContent: "space-between", gap: 10 }}>
              <span>{item.product}</span>
              <input
                type="number"
                value={item.quantity}
                onChange={(e) => updateQty(i, e.target.value)}
                style={{ width: 90, padding: 8 }}
              />
            </div>
          ))}

          <br />
          <button onClick={addProduct}>+ Aggiungi prodotto</button>
          <br /><br />
          <button onClick={sendOrder}>Invia ordine</button>
        </div>
      )}

      {screen === "admin" && (
        <div>
          <h2>Ordini ricevuti</h2>
          <input
            type="date"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
            style={{ padding: 10, marginBottom: 20 }}
          />

          {filteredOrders.length === 0 && <p>Nessun ordine per questa data.</p>}

          {filteredOrders.map((o, i) => (
            <div key={i} style={{ border: "1px solid #ccc", padding: 12, marginBottom: 12, borderRadius: 8 }}>
              <strong>{o.name}</strong> ({o.date})
              {o.items.map((it, j) => (
                <div key={j}>{it.product}: {it.quantity}</div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
