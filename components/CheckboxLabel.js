const CheckboxLabel = ({ className, children, ...props }) => {
  return (
    <label className={`block space-x-2 ${className}`} {...props}>
      {children}
    </label>
  );
};

export default CheckboxLabel;
