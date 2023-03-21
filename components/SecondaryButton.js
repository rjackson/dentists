import { buttonClasses } from "@rjackson/rjds";
import styled from "styled-components";

export const secondaryButtonClasses = `
${buttonClasses}

bg-white
`;

const SecondaryButton = styled.button.attrs({
  className: secondaryButtonClasses,
})``;

export default SecondaryButton;