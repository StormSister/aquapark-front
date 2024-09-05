import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./SellTickets.css";

const SellTickets = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [ticketTypes, setTicketTypes] = useState([]);
  const [ticketQuantities, setTicketQuantities] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);
  const [message, setMessage] = useState("");
  const [isGroup, setIsGroup] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cash"); // Dodano stan dla metody płatności

  useEffect(() => {
    const fetchTicketTypes = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/tickets/ticket-types"
        );
        const data = await response.json();
        setTicketTypes(data);
      } catch (error) {
        console.error("Error fetching ticket types:", error);
      }
    };

    fetchTicketTypes();
  }, []);

  useEffect(() => {
    let total = 0;
    ticketTypes.forEach((ticket) => {
      const quantity =
        ticketQuantities[`${ticket.category}-${ticket.type}`] || 0;
      total += quantity * ticket.finalPrice;
    });
    setTotalPrice(total);
  }, [ticketQuantities, ticketTypes]);

  const handleQuantityChange = (category, type, quantity) => {
    const key = `${category}-${type}`;
    const validQuantity = Math.max(Number(quantity) || 0, 0);
    setTicketQuantities((prev) => ({
      ...prev,
      [key]: validQuantity,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const excursionTicket = ticketTypes.find(
      (ticket) => ticket.category === "Excursion"
    );
    const excursionQuantity =
      ticketQuantities[
        `${excursionTicket?.category}-${excursionTicket?.type}`
      ] || 0;

    if (excursionTicket && excursionQuantity > 0 && excursionQuantity < 20) {
      setMessage(
        "Aby wybrać bilet typu Excursion, musi być co najmniej 20 osób."
      );
      return;
    }

    try {
      const requestData = {
        email,
        ticketDetails: ticketTypes
          .map((ticket) => ({
            type: ticket.type,
            category: ticket.category,
            quantity:
              ticketQuantities[`${ticket.category}-${ticket.type}`] || 0,
          }))
          .filter((ticket) => ticket.quantity > 0),
        isGroup,
        paymentMethod, // Dodano pole metody płatności
      };

      const response = await fetch(
        "http://localhost:8080/tickets/register-sale",
        {
          // Nowy endpoint do rejestracji sprzedaży
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        }
      );

      if (response.ok) {
        setMessage("Sprzedaż biletów została pomyślnie zarejestrowana.");
        navigate("/success");
      } else {
        const errorText = await response.text();
        setMessage(`Wystąpił błąd: ${errorText}`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setMessage("Wystąpił błąd podczas przetwarzania zapytania.");
    }
  };

  return (
    <div className="sell-tickets-container">
      <h1>Sell Tickets</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        {ticketTypes.map((ticket, index) => (
          <div
            className="form-group"
            key={`${ticket.category}-${ticket.type}-${index}`}
          >
            <label className="ticket-label">
              {`${ticket.category} Ticket:`}
              {ticket.isPromotion ? (
                <>
                  <span className="ticket-price">
                    {ticket.standardPrice.toFixed(2)}
                  </span>
                  <span className="promotion-price">
                    {ticket.finalPrice.toFixed(2)} PROMOTION
                  </span>
                </>
              ) : (
                <span>{ticket.finalPrice.toFixed(2)}</span>
              )}
            </label>
            <input
              type="number"
              value={ticketQuantities[`${ticket.category}-${ticket.type}`] || 0}
              onChange={(e) =>
                handleQuantityChange(
                  ticket.category,
                  ticket.type,
                  e.target.value
                )
              }
              min="0"
            />
          </div>
        ))}
        <div className="form-group checkbox-group">
          <label>One ticket for all guests</label>
          <input
            type="checkbox"
            checked={isGroup}
            onChange={(e) => setIsGroup(e.target.checked)}
          />
        </div>
        <div className="form-group">
          <label>Payent method:</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option value="cash">Cash</option>
            <option value="card">Card</option>
            <option value="free">Free Ticket</option>
          </select>
        </div>
        <div>
          <h3>Total price: {totalPrice.toFixed(2)}</h3>
        </div>
        <button type="submit">Sell tickets</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default SellTickets;
