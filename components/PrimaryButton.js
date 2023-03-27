import styled from "styled-components";

// todo: properly fix typescript hating className on styled components without this weird hack
export const primaryButtonClasses = `
${''}

px-2
py-1
rounded

ring-2
ring-gray-400
border-2
border-transparent

ring-indigo-500
bg-indigo-500
text-white

hover:border-white

focus:outline-none
focus:border-white

dark:bg-fuchsia-500
dark:ring-fuchsia-500

dark:hover:border-gray-900
dark:focus:border-gray-900
`;

// TODO: fuchsia-400 to fuchsia-500 in upstream Button to improve contrast ratio

const PrimaryButton = styled.button.attrs({
  className: primaryButtonClasses,
})``;

export default PrimaryButton;