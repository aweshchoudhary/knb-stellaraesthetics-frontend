import React, { Suspense } from "react";
import { Country } from "country-state-city";
import Select from "react-select";

const CurrencySelect = ({
  selectedCurrency,
  setSelectedCurrency,
  handleBlur,
}) => {
  const AllCountriesCurrencyData = Country.getAllCountries().map((country) => {
    if (!selectedCurrency?.label && country.currency === "INR") {
      setSelectedCurrency({
        label: `${country.flag} ${country.name} (${country.currency})`,
        value: country.currency,
      });
    }

    return {
      label: `${country.flag} ${country.name} (${country.currency})`,
      value: country.currency,
    };
  });

  function handleCurrencyChange(newCurrency) {
    setSelectedCurrency(newCurrency);
  }
  return (
    <Suspense>
      <div className="flex-1">
        <Select
          name="currency"
          id="currency" // like inr,usd
          classNamePrefix="select"
          options={AllCountriesCurrencyData}
          onChange={handleCurrencyChange}
          onBlur={handleBlur || null}
          value={selectedCurrency}
        />
      </div>
    </Suspense>
  );
};

export default CurrencySelect;
