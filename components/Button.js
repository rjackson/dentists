import styled from "styled-components";

export const buttonClasses = `
px-2
py-1
rounded

ring-2
ring-indigo-500

hover:bg-indigo-500
hover:text-white

focus:outline-none
focus:ring
focus:bg-indigo-500
focus:text-white

dark:hover:bg-fuchsia-400
dark:focus:bg-fuchsia-400
dark:focus:ring-fuchsia-400
dark:ring-fuchsia-600
dark:bg-gray-900
`;

const Button = styled.button.attrs({
  className: buttonClasses,
})``;

export default Button;
