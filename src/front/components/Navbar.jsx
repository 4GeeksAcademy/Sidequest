import { useState } from "react";

import Container from "react-bootstrap/Container";
import NavbarBs from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import ListGroup from "react-bootstrap/ListGroup";
import Form from "react-bootstrap/Form";

import { FiMenu, FiMail, FiX, FiSend } from "react-icons/fi";

export const Navbar = () => {
	const [showMessages, setShowMessages] = useState(false);
	const [replyMessageId, setReplyMessageId] = useState(null);
	const [replyText, setReplyText] = useState("");

	const [messages, setMessages] = useState([
		{
			id: 1,
			name: "Alex Chen",
			text: "Hey! Are you coming to the gym session?",
		},
		{
			id: 2,
			name: "Sarah",
			text: "The event location changed.",
		},
		{
			id: 3,
			name: "Mike",
			text: "Can you invite more people?",
		},
	]);

	const handleDeleteMessage = (id) => {
		const filteredMessages = messages.filter(
			(message) => message.id !== id
		);

		setMessages(filteredMessages);
	};

	const handleOpenReply = (id) => {
		setReplyMessageId(id);
		setReplyText("");
	};

	const handleSendReply = () => {
		if (replyText.trim() === "") return;

		console.log("Respuesta enviada:", {
			messageId: replyMessageId,
			reply: replyText,
		});

		setReplyMessageId(null);
		setReplyText("");
	};

	return (
		<>
			<NavbarBs
				bg="dark"
				variant="dark"
				className="px-4 py-3 fixed-top"
			>
				<Container fluid className="d-flex justify-content-between">
					<NavbarBs.Brand className="fw-bold fs-3">
						SQ
					</NavbarBs.Brand>

					<Nav className="d-flex flex-row align-items-center gap-4">
						<Button
							variant="dark"
							className="position-relative border-0"
							onClick={() => setShowMessages(true)}
						>
							<FiMail size={28} color="white" />

							{messages.length > 0 && (
								<Badge
									bg="danger"
									pill
									className="position-absolute top-0 start-100 translate-middle"
								>
									{messages.length}
								</Badge>
							)}
						</Button>

						<FiMenu size={34} color="white" />
					</Nav>
				</Container>
			</NavbarBs>

			<Modal
				show={showMessages}
				onHide={() => setShowMessages(false)}
				centered
			>
				<Modal.Header closeButton>
					<Modal.Title>Pending Messages</Modal.Title>
				</Modal.Header>

				<Modal.Body>
					{messages.length === 0 ? (
						<p className="text-muted mb-0">
							No pending messages.
						</p>
					) : (
						<ListGroup>
							{messages.map((message) => (
								<ListGroup.Item key={message.id}>
									<div className="d-flex justify-content-between align-items-start gap-3">
										<div>
											<strong>{message.name}</strong>
											<br />
											<span>{message.text}</span>
										</div>

										<Button
											variant="light"
											size="sm"
											className="border-0"
											onClick={() =>
												handleDeleteMessage(message.id)
											}
										>
											<FiX />
										</Button>
									</div>

									<div className="mt-3">
										<Button
											variant="outline-primary"
											size="sm"
											onClick={() =>
												handleOpenReply(message.id)
											}
										>
											Reply
										</Button>
									</div>

									{replyMessageId === message.id && (
										<div className="mt-3">
											<Form.Control
												as="textarea"
												rows={2}
												placeholder="Write your reply..."
												value={replyText}
												onChange={(e) =>
													setReplyText(e.target.value)
												}
											/>

											<div className="d-flex justify-content-end gap-2 mt-2">
												<Button
													variant="secondary"
													size="sm"
													onClick={() =>
														setReplyMessageId(null)
													}
												>
													Cancel
												</Button>

												<Button
													variant="primary"
													size="sm"
													onClick={handleSendReply}
												>
													<FiSend /> Send
												</Button>
											</div>
										</div>
									)}
								</ListGroup.Item>
							))}
						</ListGroup>
					)}
				</Modal.Body>

				<Modal.Footer>
					<Button
						variant="secondary"
						onClick={() => setShowMessages(false)}
					>
						Close
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
};