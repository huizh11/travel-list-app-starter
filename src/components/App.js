import { useState } from "react";

// Initial packing items
const initialItems = [
  { id: 1, description: "Shirt", quantity: 5, packed: true },
  { id: 2, description: "Pants", quantity: 2, packed: false },
];

function Logo() {
  return <h1>My Travel List</h1>;
}

function Form({ onAddItem, tripDate, setTripDate }) {
  const [quantity, setQuantity] = useState(1);
  const [description, setDescription] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!description) return;

    const newItem = {
      id: Date.now(),
      description,
      quantity,
      packed: false,
    };

    onAddItem(newItem);
    setDescription("");
    setQuantity(1);
  }

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <h3>What do you need to pack?</h3>

      <select value={quantity} onChange={(e) => setQuantity(Number(e.target.value))}>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
      </select>

      <input
        type="text"
        placeholder="Item..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        autoFocus
      />

      {/* TRIP DATE INPUT */}
      <input
        type="date"
        value={tripDate}
        onChange={(e) => setTripDate(e.target.value)}
      />

      <button type="submit">Add</button>
    </form>
  );
}

function PackingList({ items, onToggleItem, onDecreaseItem }) {
  return (
    <div className="list">
      <ul>
        {items.map((item) => (
          <Item
            item={item}
            key={item.id}
            onToggleItem={onToggleItem}
            onDecrease={onDecreaseItem}
          />
        ))}
      </ul>
    </div>
  );
}

function Item({ item, onToggleItem, onDecrease }) {
  return (
    <li className={item.packed ? "packed" : ""}>
      <input
        type="checkbox"
        checked={item.packed}
        onChange={() => onToggleItem(item.id)}
      />

      <span className="item-text">
        {item.description} <strong>x{item.quantity}</strong>
      </span>

      <button className="qty-btn" onClick={() => onDecrease(item.id)}>
        -
      </button>
    </li>
  );
}

// -------- COUNTDOWN FUNCTION --------
function getDaysLeft(tripDate) {
  if (!tripDate) return null;

  const today = new Date();
  const target = new Date(tripDate);

  const diff = target - today;
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

  return days;
}

function Stats({ items, tripDate }) {
  const total = items.length;
  const packed = items.filter((item) => item.packed).length;
  const percent = total === 0 ? 0 : Math.round((packed / total) * 100);

  const daysLeft = getDaysLeft(tripDate);

  return (
    <footer className="stats">
      <em>
        🎒 You have {total} items. You’ve packed {packed} ({percent}%).
      </em>

      {daysLeft !== null && (
        <p className="countdown">
          {daysLeft > 1 && `⏳ Your trip is in ${daysLeft} days!`}
          {daysLeft === 1 && `✨ Your trip is tomorrow!`}
          {daysLeft === 0 && `🎉 Your trip is TODAY!`}
          {daysLeft < 0 && `💖 Hope you enjoyed your trip!`}
        </p>
      )}
    </footer>
  );
}

function App() {
  const [items, setItems] = useState(initialItems);
  const [tripDate, setTripDate] = useState("");

  function toggleItem(id) {
    setItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, packed: !item.packed } : item
      )
    );
  }

  function decreaseItem(id) {
    setItems((items) =>
      items
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  function addItem(newItem) {
    setItems((items) => {
      const existingItem = items.find(
        (item) =>
          item.description.toLowerCase() ===
          newItem.description.toLowerCase()
      );

      if (existingItem) {
        return items.map((item) =>
          item.id === existingItem.id
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        );
      }

      return [...items, newItem];
    });
  }

  return (
    <div className="app">
      <Logo />
      <Form onAddItem={addItem} tripDate={tripDate} setTripDate={setTripDate} />
      <PackingList
        items={items}
        onToggleItem={toggleItem}
        onDecreaseItem={decreaseItem}
      />
      <Stats items={items} tripDate={tripDate} />
    </div>
  );
}

export default App;
