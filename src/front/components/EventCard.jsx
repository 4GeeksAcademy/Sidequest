import { useState } from "react";

import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

import { FiX, FiSend } from "react-icons/fi";

export const EventCard = ({ event, setSelectedEvent }) => {
	const [joined, setJoined] = useState(false);
	const [showChat, setShowChat] = useState(false);
	const [chatMessage, setChatMessage] = useState("");

	const [messages, setMessages] = useState([
		{
			user: "Alex",
			text: "Hey everyone!",
		},
		{
			user: "Sarah",
			text: "See you at the event 🔥",
		},
	]);

	const handleJoin = () => {
		setJoined(!joined);
	};

	const handleSendMessage = () => {
		if (chatMessage.trim() === "") return;

		setMessages([
			...messages,
			{
				user: "You",
				text: chatMessage,
			},
		]);

		setChatMessage("");
	};

	return (
		<>
			<div className="event-card">
				<button
					className="close-card-button"
					onClick={() => setSelectedEvent(null)}
				>
					<FiX />
				</button>

				<h2>{event.title}</h2>

				<p>Event by {event.user}</p>

				<p>
					Starts on {event.date} at {event.time}
				</p>

				<p>{event.friends} friends are going</p>

				<div className="event-buttons">
					<button>Directions</button>

					<button>Status</button>

					<button onClick={() => setShowChat(true)}>
						Chat
					</button>

					<button
						onClick={handleJoin}
						className={joined ? "joined-button" : ""}
					>
						{joined ? "Leave" : "Join"}
					</button>
				</div>
			</div>

			<Modal
				show={showChat}
				onHide={() => setShowChat(false)}
				centered
			>
				<Modal.Header closeButton>
					<Modal.Title>Event Chat</Modal.Title>
				</Modal.Header>

				<Modal.Body>
					<div className="chat-messages">
						{messages.map((message, index) => (
							<div
								key={index}
								className="chat-message"
							>
								<strong>{message.user}</strong>
								<p>{message.text}</p>
							</div>
						))}
					</div>

					<Form.Control
						as="textarea"
						rows={2}
						placeholder="Write a message..."
						value={chatMessage}
						onChange={(e) =>
							setChatMessage(e.target.value)
						}
					/>
				</Modal.Body>

				<Modal.Footer>
					<Button
						variant="secondary"
						onClick={() => setShowChat(false)}
					>
						Close
					</Button>

					<Button
						variant="primary"
						onClick={handleSendMessage}
					>
						<FiSend /> Send
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
};