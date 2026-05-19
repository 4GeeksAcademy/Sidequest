import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const createAvatarIcon = (imageUrl) =>
	L.divIcon({
		html: `
      <div class="avatar-marker">
        <img src="${imageUrl}" />
      </div>
    `,
		className: "",
		iconSize: [56, 56],
		iconAnchor: [28, 56],
	});

export const Mapview = ({ setSelectedEvent }) => {
	const madrid = [40.4168, -3.7038];

	const events = [
		{
			id: 1,
			title: "Morning Gym Session",
			user: "Alex Chen",
			date: "2024-12-30",
			time: "07:00",
			friends: 3,
			position: [40.4168, -3.7038],
			image: "https://i.pravatar.cc/100?img=12",
		},

		{
			id: 2,
			title: "Coffee Meetup",
			user: "Sarah",
			date: "2024-12-31",
			time: "18:30",
			friends: 5,
			position: [40.4268, -3.6938],
			image: "https://i.pravatar.cc/100?img=32",
		},
	];

	return (
		<div className="map-wrapper">
			<MapContainer
				center={madrid}
				zoom={13}
				className="map-container"
			>
				<TileLayer
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				/>

				{events.map((event) => (
					<Marker
						key={event.id}
						position={event.position}
						icon={createAvatarIcon(event.image)}
						eventHandlers={{
							click: () => {
								setSelectedEvent(event);
							},
						}}
					/>
				))}
			</MapContainer>
		</div>
	);
};