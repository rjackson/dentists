import styled from "styled-components";

export const buttonClasses = `
px-2
py-1
rounded

ring-2
ring-gray-400
border-2
border-transparent

hover:ring-indigo-500
hover:border-white
hover:bg-indigo-500
hover:text-white

focus:outline-none
focus:ring-indigo-500
focus:border-white
focus:bg-indigo-500
focus:text-white

dark:hover:bg-fuchsia-400
dark:hover:border-gray-900
dark:hover:ring-fuchsia-400
dark:focus:bg-fuchsia-400
dark:focus:border-gray-900
dark:focus:ring-fuchsia-400
dark:bg-gray-900
`;

const Button = styled.button.attrs({
  className: buttonClasses,
})``;

export default Button;
