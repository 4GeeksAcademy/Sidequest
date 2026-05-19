import { useState } from "react";

import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

import {
	FiHome,
	FiCompass,
	FiPlus,
	FiMessageSquare,
	FiUser,
} from "react-icons/fi";

export const BottomNavbar = () => {
	const [showProfile, setShowProfile] = useState(false);

	const [userData, setUserData] = useState({
		name: "Alex Chen",
		email: "alexchen@email.com",
		username: "alexchen",
		city: "Madrid",
		bio: "Gym lover and morning runner.",
		profileImage: "https://i.pravatar.cc/150?img=12",
	});

	// CAMBIAR INPUTS
	const handleChange = (e) => {
		setUserData({
			...userData,
			[e.target.name]: e.target.value,
		});
	};

	// CAMBIAR FOTO
	const handleImageChange = (e) => {
		const file = e.target.files[0];

		if (file) {
			const imageUrl = URL.createObjectURL(file);

			setUserData({
				...userData,
				profileImage: imageUrl,
			});
		}
	};

	// GUARDAR
	const handleSave = () => {
		console.log("Datos guardados:", userData);
		setShowProfile(false);
	};

	return (
		<>
			<div className="bottom-navbar">

				{/* HOME */}
				<div className="bottom-item">
					<FiHome />
					<span>home</span>
				</div>

				{/* EXPLORE */}
				<div className="bottom-item">
					<FiCompass />
					<span>explore</span>
				</div>

				{/* QUEST */}
				<div className="bottom-item">
					<FiPlus />
					<span>quest</span>
				</div>

				{/* INBOX */}
				<div className="bottom-item">
					<FiMessageSquare />
					<span>inbox</span>
				</div>

				{/* PROFILE */}
				<button
					className="bottom-item profile-button border-0 bg-transparent"
					onClick={() => setShowProfile(true)}
				>
					<FiUser />
					<span>profile</span>
				</button>
			</div>

			{/* MODAL PROFILE */}
			<Modal
				show={showProfile}
				onHide={() => setShowProfile(false)}
				centered
			>
				<Modal.Header closeButton>
					<Modal.Title>User Profile</Modal.Title>
				</Modal.Header>

				<Modal.Body>

					<Form>

						{/* FOTO PERFIL */}
						<div className="profile-image-section">

							<img
								src={userData.profileImage}
								alt="Profile"
								className="profile-image-preview"
							/>

							<Form.Group className="mb-3">
								<Form.Label>
									Change profile photo
								</Form.Label>

								<Form.Control
									type="file"
									accept="image/*"
									onChange={handleImageChange}
								/>
							</Form.Group>

						</div>

						{/* NAME */}
						<Form.Group className="mb-3">
							<Form.Label>Name</Form.Label>

							<Form.Control
								type="text"
								name="name"
								value={userData.name}
								onChange={handleChange}
							/>
						</Form.Group>

						{/* EMAIL */}
						<Form.Group className="mb-3">
							<Form.Label>Email</Form.Label>

							<Form.Control
								type="email"
								name="email"
								value={userData.email}
								onChange={handleChange}
							/>
						</Form.Group>

						{/* USERNAME */}
						<Form.Group className="mb-3">
							<Form.Label>Username</Form.Label>

							<Form.Control
								type="text"
								name="username"
								value={userData.username}
								onChange={handleChange}
							/>
						</Form.Group>

						{/* CITY */}
						<Form.Group className="mb-3">
							<Form.Label>City</Form.Label>

							<Form.Control
								type="text"
								name="city"
								value={userData.city}
								onChange={handleChange}
							/>
						</Form.Group>

						{/* BIO */}
						<Form.Group className="mb-3">
							<Form.Label>Bio</Form.Label>

							<Form.Control
								as="textarea"
								rows={3}
								name="bio"
								value={userData.bio}
								onChange={handleChange}
							/>
						</Form.Group>

					</Form>

				</Modal.Body>

				<Modal.Footer>

					<Button
						variant="secondary"
						onClick={() => setShowProfile(false)}
					>
						Cancel
					</Button>

					<Button
						variant="primary"
						onClick={handleSave}
					>
						Save changes
					</Button>

				</Modal.Footer>
			</Modal>
		</>
	);
};