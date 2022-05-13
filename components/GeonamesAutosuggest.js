import Geonames from "geonames.js";
import { useRef, useState } from "react";
import Autosuggest from "react-autosuggest";
import { inputClasses } from "@rjackson/rjds";

const geonames = Geonames({
  username: process.env.NEXT_PUBLIC_GEONAMES_USERNAME,
});

const geonameSearchConstraints = {
  featureClass: "p", // Populated place (cities, villages)

  country: "GB",

  // Capping this for now. Interacting with suggestions via arrow keys does not
  // scroll off-screen list items into view. The proper solution is a custom
  // `renderSuggestionsContainer`. For now, let's just make we never have more
  // suggestions than we can show on screen
  maxRows: 5,
};

const renderSuggestion = (suggestion) => <div>{suggestion.name}</div>;
const getSuggestionValue = (suggestion) => suggestion.name;

const GeonamesAutosuggest = ({ value: selectedLocation, onChange: setSelectedLocation, inputProps }) => {
  /**
   * The autosuggest component works like a regular text input, keeping track of
   * a single string. We want to track the full geonames place object, and pass
   * that along to our consumer when it changes.
   */
  const [value, setValue] = useState(selectedLocation?.name ?? "");
  const [suggestions, setSuggestions] = useState([]);
  const searchTimer = useRef(null);

  // State for the autosuggest's controlled input
  const onChange = (event, { newValue }) => {
    setValue(newValue);
  };

  // Managing suggestions
  const onSuggestionsFetchRequested = ({ value }) => {
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(
      () =>
        geonames
          .search({ ...geonameSearchConstraints, q: value })
          .then((resp) => setSuggestions(resp.geonames))
          .catch((e) => console.log(e)),
      300
    );
  };
  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const onSuggestionSelected = (_event, { suggestion }) => {
    setSelectedLocation(suggestion);
  };

  const onBlur = (_event, { highlightedSuggestion }) => {
    // If the user has previously selected a suggestion, revert back to it
    if (selectedLocation) {
      setValue(selectedLocation.name);
      return;
    }

    // Otherwise select the highlighted suggestion
    if (highlightedSuggestion) {
      setValue(highlightedSuggestion.name);
      setSelectedLocation(highlightedSuggestion);
    }
  };

  const theme = {
    container: "relative",
    containerOpen: "",
    input: "",
    inputOpen: "",
    inputFocused: "",
    suggestionsContainer: "absolute z-30 mt-px w-full bg-white",
    suggestionsContainerOpen: "true",
    suggestionsList: `max-h-56
      rounded-b
      py-1
      text-base
      ring-2
      ring-gray-400
      overflow-auto
      focus:outline-none
      px-1
      dark:ring-gray-600
      dark:bg-gray-900`,
    suggestion: "cursor-default select-none relative py-2 px-3",
    suggestionFirst: "",
    suggestionHighlighted: `
      ring-2
      bg-indigo-100
      ring-indigo-500
      dark:bg-fuchsia-800
      dark:ring-fuchsia-400`,
    // sectionContainer: "react-autosuggest__section-container",
    // sectionContainerFirst: "react-autosuggest__section-container--first",
    // sectionTitle: "react-autosuggest__section-title",
  };

  return (
    <Autosuggest
      getSuggestionValue={getSuggestionValue}
      inputProps={{
        ...inputProps,
        value,
        onChange,
        onBlur,
        className: inputClasses,
      }}
      onSuggestionsFetchRequested={onSuggestionsFetchRequested}
      renderSuggestion={renderSuggestion}
      suggestions={suggestions}
      onSuggestionsClearRequested={onSuggestionsClearRequested}
      onSuggestionSelected={onSuggestionSelected}
      highlightFirstSuggestion={true}
      theme={theme}
    />
  );
};

export default GeonamesAutosuggest;
