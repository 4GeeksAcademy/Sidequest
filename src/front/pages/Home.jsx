import { useState } from "react";

import { Navbar } from "../components/Navbar";
import { Mapview } from "../components/Mapview";
import { EventCard } from "../components/EventCard";
import { BottomNavbar } from "../components/ButtonNavbar";

export const Home = () => {
	const [selectedEvent, setSelectedEvent] = useState(null);

	return (
		<div className="home-page">
			<Navbar />

			<Mapview setSelectedEvent={setSelectedEvent} />

			{selectedEvent && (
				<EventCard
					event={selectedEvent}
					setSelectedEvent={setSelectedEvent}
				/>
			)}

			<BottomNavbar />
		</div>
	);
};