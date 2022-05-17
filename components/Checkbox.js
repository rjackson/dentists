/**
 * Custom textbox styling, borrowing implementation details from GDS
 * @see https://github.com/govuk-react/govuk-react/tree/main/components/checkbox
 */
import svgToTinyDataUri from "mini-svg-data-uri";
import styled from "styled-components";

// TODO: Decompose inputClasses into specific chunks, so we can use its focus
// styling without layout styling.

const checkmarkSvg = (color) =>
  `<svg viewBox="0 0 16 16" fill="${color}" xmlns="http://www.w3.org/2000/svg"><path d="M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z"/></svg>`;

const Checkbox = styled.input.attrs({
  type: "checkbox",
  className: `
    appearance-none

    inline-block
    py-3
    px-3
    rounded
        
    ring-2
    ring-gray-400

    focus:outline-none
    focus:ring
    focus:ring-indigo-500
    
    dark:ring-gray-500
    dark:bg-gray-900
    dark:text-fuchsia-400

    dark:focus:ring-fuchsia-400
  `,
})`
  &:checked {
    background-image: url("${svgToTinyDataUri(checkmarkSvg("black"))}");
  }
  .dark &:checked {
    background-image: url("${svgToTinyDataUri(checkmarkSvg("white"))}");
  }
`;

export default Checkbox;

{
  /* <input class="form-check-input appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" type="checkbox" value="" id="flexCheckDefault"> */
}
