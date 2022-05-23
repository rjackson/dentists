const CheckboxLabel = ({ className = "", children, label, ...props }) => {
  return (
    <label className={`flex items-center space-x-2 ${className}`} {...props}>
      {children}
      <span>{label}</span>
    </label>
  );
};

export default CheckboxLabel;
