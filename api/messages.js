const supportMessages = [
  {
    id: "1",
    name: "Sarah Jenkins",
    location: "Colorado Springs, CO",
    message: "Thank you for sharing your beautiful voice. Never let anyone quiet your beliefs!",
    date: "2026-05-27T14:32:00Z"
  },
  {
    id: "2",
    name: "David K.",
    location: "Denver, CO",
    message: "Every life has value, and your poem is a powerful reminder. Keep standing strong!",
    date: "2026-05-28T02:15:00Z"
  },
  {
    id: "3",
    name: "Maria Rodriguez",
    location: "Arvada, CO",
    message: "Hope House Colorado does amazing work, and this t-shirt is a wonderful blessing. Order placed!",
    date: "2026-05-28T04:45:00Z"
  }
];

export default function handler(req, res) {
  if (req.method === "GET") {
    return res.status(200).json({ messages: supportMessages });
  }

  if (req.method === "POST") {
    const { name, location, message } = req.body || {};

    if (!name || !message) {
      return res.status(400).json({ error: "Name and message are required." });
    }

    const newMessage = {
      id: String(Date.now()),
      name: String(name).trim(),
      location: String(location || "Anonymous").trim(),
      message: String(message).trim(),
      date: new Date().toISOString()
    };

    supportMessages.unshift(newMessage);
    return res.status(201).json(newMessage);
  }

  res.setHeader("Allow", "GET, POST");
  return res.status(405).json({ error: "Method not allowed." });
}
