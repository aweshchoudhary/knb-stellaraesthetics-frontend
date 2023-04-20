import { useState } from "react";
import Select from "react-select";
import { Country, State, City } from "country-state-city";

export default function Address({ address, setAddress }) {
  const [currentCountry, setCurrentCountry] = useState(null);
  const [currentState, setCurrentState] = useState(null);
  const [currentCity, setCurrentCity] = useState(null);

  const countries = Country.getAllCountries();

  const updatedCountries = countries.map((country) => ({
    label: country.name,
    value: country.isoCode,
    ...country,
  }));

  const updatedStates = (countryCode) =>
    State.getStatesOfCountry(countryCode).map((state) => ({
      label: state.name,
      value: state.isoCode,
      ...state,
    }));
  const updatedCities = (countryCode, stateCode) =>
    City.getCitiesOfState(countryCode, stateCode).map((city) => ({
      label: city.name,
      value: city.id,
      ...city,
    }));

  const fillAddressInputs = (name, value) =>
    setAddress((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  return (
    <div className="input-group mb-3">
      <label htmlFor="personName" className="text-textColor block  mb-2">
        Address
      </label>
      <div className="flex items-center gap-2 mb-2">
        <input
          type="line1"
          name="line1"
          id="line1"
          placeholder="Address Line 1"
          className="input"
          value={address?.line1}
          onChange={(e) => fillAddressInputs(e.target.name, e.target.value)}
        />
      </div>
      <div className="flex items-center gap-2 mb-2">
        <input
          type="line2"
          name="line2"
          id="line2"
          placeholder="Address Line 2"
          className="input"
          value={address.line2}
          onChange={(e) => fillAddressInputs(e.target.name, e.target.value)}
        />
      </div>
      <div>
        <div>
          <Select
            id="country"
            name="country"
            label="country"
            options={updatedCountries}
            value={currentCountry}
            placeholder="Country"
            // onChange={value => {
            //   setFieldValue("country", value);
            //   setFieldValue("state", null);
            //   setFieldValue("city", null);
            // }}
            className="mb-2"
            onChange={(value) => {
              setCurrentCountry(value);
              setAddress((prev) => {
                return {
                  ...prev,
                  country: value,
                };
              });
            }}
          />
          <Select
            id="state"
            name="state"
            options={updatedStates(currentCountry?.value || null)}
            value={currentState}
            onChange={(value) => {
              setAddress((prev) => {
                return {
                  ...prev,
                  state: value,
                };
              });
              setCurrentState(value);
            }}
            placeholder="State"
            className="mb-2"
          />
          <Select
            id="city"
            name="city"
            placeholder="City"
            options={updatedCities(currentCountry?.value, currentState?.value)}
            value={currentCity}
            onChange={(value) => {
              setAddress((prev) => {
                return {
                  ...prev,
                  city: value,
                };
              });
              setCurrentCity(value);
            }}
            className="mb-2"
          />
        </div>
      </div>
    </div>
  );
}
