import styled from "styled-components";

export const inputClasses = `
w-full
px-2
py-1
rounded

ring-2
ring-gray-400


focus:outline-none
focus:ring
focus:ring-indigo-500

dark:focus:ring-fuchsia-400
dark:ring-gray-500
dark:bg-gray-900
`;

const Input = styled.input.attrs({
  className: inputClasses,
})``;

export default Input;
