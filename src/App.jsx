import { Card, CardContent } from "@material-ui/core";
import { useEffect, useState } from "react";
import Header from "./components/Header";
import InfoBox from "./components/InfoBox";
import LineGraph from "./components/LineGraph";
import Map from "./components/Map";
import Table from "./components/Table";
import { handleSortData, prettyPrintStat } from "./utils/util";

import "leaflet/dist/leaflet.css";
import "./styles/App.css";

const WORLDWIDE = "worldwide";
const URL_ALL = "https://disease.sh/v3/covid-19/all";
const URL_COUNTRIES = "https://disease.sh/v3/covid-19/countries";

function App() {
	const [countryInfo, setCountryInfo] = useState({});
	const [countries, setCountries] = useState([]);
	const [tableData, setTableData] = useState([]);
	const [casesType, setCasesType] = useState("cases");
	const [isLoading, setLoading] = useState(false);
	const [mapCenter, setMapCenter] = useState([34.80746, -40.4796]);
	const [zoom, setZoom] = useState(3);
	const [mapCountries, setMapCountries] = useState([]);

	useEffect(() => {
		const getCountriesData = async () => {
			await fetch(URL_COUNTRIES)
				.then((res) => res.json())
				.then((data) => {
					const countries = data.map((country) => ({
						name: country.country,
						value: country.countryInfo.iso2,
					}));

					const sortedData = handleSortData(data);
					setTableData(sortedData);
					setCountries(countries);
					setMapCountries(data);
				});
		};
		getCountriesData();
		const getDefaultCountry = async () => {
			await fetch(URL_ALL)
				.then((res) => res.json())
				.then((data) => {
					setCountryInfo(data);
				});
		};
		getDefaultCountry();
	}, []);

	const getCountryCode = async (countryCode) => {
		setLoading(true);
		const url =
			countryCode === WORLDWIDE
				? URL_ALL
				: `https://disease.sh/v3/covid-19/countries/${countryCode}`;

		await fetch(url)
			.then((res) => res.json())
			.then((data) => {
				setLoading(false);
				setCountryInfo(data);
				countryCode === "worldwide"
					? setMapCenter([34.80746, -40.4796])
					: setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
				setZoom(4);
			});
	};

	return (
		// BEM
		<div className="app">
			<div className="app__left">
				<Header countries={countries} sendCountryCode={getCountryCode} />

				<div className="app__stats">
					<InfoBox
						isRed
						active={casesType === "cases"}
						className="infoBox__cases"
						onClick={(e) => setCasesType("cases")}
						title="Coronavirus Cases"
						total={prettyPrintStat(countryInfo.cases)}
						cases={prettyPrintStat(countryInfo.todayCases)}
						isloading={isLoading}
					/>
					<InfoBox
						active={casesType === "recovered"}
						className="infoBox__recovered"
						onClick={(e) => setCasesType("recovered")}
						title="Recovered"
						total={prettyPrintStat(countryInfo.recovered)}
						cases={prettyPrintStat(countryInfo.todayRecovered)}
						isloading={isLoading}
					/>
					<InfoBox
						isGrey
						active={casesType === "deaths"}
						className="infoBox__deaths"
						onClick={(e) => setCasesType("deaths")}
						title="Deaths"
						total={prettyPrintStat(countryInfo.deaths)}
						cases={prettyPrintStat(countryInfo.todayDeaths)}
						isloading={isLoading}
					/>
				</div>

				<Map
					countries={mapCountries}
					center={mapCenter}
					zoom={zoom}
					casesType={casesType}
				/>
			</div>

			<Card className="app__right">
				<CardContent>
					<h3>Live Cases by Country</h3>
					<Table countries={tableData} />

					<h3 className="app__graphTitle">WorldWide new {casesType}</h3>
					<LineGraph className="app__graph" casesType={casesType} />
				</CardContent>
			</Card>
		</div>
	);
}

export default App;
