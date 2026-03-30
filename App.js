import React, { useMemo, useState } from "react";

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

  const login = () => {
    const c = customerTemplates[code.toUpperCase()];
    if (!c) return alert("Codice sbagliato");

    setCustomer(c);
    setItems(c.favoriteProducts.map(p => ({ product: p, quantity: 0 })));
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
    const clean = items.filter(i => i.quantity > 0);
    if (clean.length === 0) return alert("Metti almeno una quantità");

    setOrders([...orders, {
      date: today,
      name: customer.customerName,
      items: clean
    }]);

    alert("Ordine inviato!");
    setScreen("home");
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Antico Forno Setino</h1>

      {screen === "home" && (
        <div>
          <h2>Accesso cliente</h2>
          <input
            placeholder="Codice cliente"
            value={code}
            onChange={e => setCode(e.target.value)}
          />
          <br /><br />
          <button onClick={login}>Entra</button>

          <p>Codici:</p>
          <p>PON001 - Forno di Pontinia</p>
          <p>LAT002 - Forno di Latina</p>
        </div>
      )}

      {screen === "order" && customer && (
        <div>
          <h2>{customer.customerName}</h2>
          <p>Data: {today}</p>

          {items.map((item, i) => (
            <div key={i}>
              {item.product}
              <input
                type="number"
                value={item.quantity}
                onChange={e => updateQty(i, e.target.value)}
                style={{ marginLeft: 10 }}
              />
            </div>
          ))}

          <br />
          <button onClick={addProduct}>+ Aggiungi prodotto</button>
          <br /><br />
          <button onClick={sendOrder}>Invia ordine</button>
        </div>
      )}

      <hr />

      <h2>Ordini ricevuti</h2>
      {orders.map((o, i) => (
        <div key={i}>
          <strong>{o.name}</strong> ({o.date})
          {o.items.map((it, j) => (
            <div key={j}>{it.product}: {it.quantity}</div>
          ))}
          <hr />
        </div>
      ))}
    </div>
  );
}
