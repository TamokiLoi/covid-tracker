import { FormControl, MenuItem, Select } from "@material-ui/core";
import { useState } from "react";

const WORLDWIDE = "worldwide";

function Header({ countries, sendCountryCode }) {
	const [countryCode, setCountryCode] = useState(WORLDWIDE);

	const onCountryChange = async (event) => {
		const countryCodeCurrent = event.target.value;
		setCountryCode(countryCodeCurrent);
		sendCountryCode(countryCodeCurrent);
	};

	return (
		<div className="app__header">
			<h1>Covid Tracker</h1>
			<FormControl className="app__dropdown">
				<Select
					variant="outlined"
					value={countryCode}
					onChange={onCountryChange}
				>
					{/* Loop through all the countries and show a dropdown list of the options */}
					<MenuItem value={WORLDWIDE}>Worldwide</MenuItem>
					{countries.map((country) => (
						<MenuItem value={country.value} key={country.name}>
							{country.name}
						</MenuItem>
					))}
				</Select>
			</FormControl>
		</div>
	);
}

export default Header;
