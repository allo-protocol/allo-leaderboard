import { ChangeEvent } from "react";

export const Input = ({
  value,
  handleChange,
  placeholder,
}: {
  value?: string;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
}) => {
  return (
    <input
      type="text"
      placeholder={placeholder}
      className="text-grey-200 bg-blue-800 border border-grey-200 rounded-lg w-full px-2 py-3 font-mono"
      value={value}
      onChange={(e) => handleChange(e)}
    />
  );
};
