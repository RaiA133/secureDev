import React, { useContext, useState } from "react";
import { Input } from "@nextui-org/react";
import { EyeFilledIcon } from "./icon/EyeFilledIcon";
import { EyeSlashFilledIcon } from "./icon/EyeSlashFilledIcon";
import { FileImportContext } from "../contexts/fileImportContext";

function InputApiKey() {
  // const [inputValue, setInputValue] = useState(localStorage.getItem("apiKey") || "");
  const {apiKey, setApiKey} = useContext(FileImportContext)
  const [isVisible, setIsVisible] = useState(false);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setApiKey(newValue);
    localStorage.setItem("apiKey", newValue); // Update localStorage on input change
  };

  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <div className="absolute bottom-0 left-0 m-5 p-0 flex flex-row gap-2">
      <Input
        title="Google API Key"
        placeholder="Input Gemini API Key"
        size="sm"
        value={apiKey}
        onChange={handleInputChange}
        endContent={
          <button
            className="focus:outline-none"
            type="button"
            onClick={toggleVisibility}
            aria-label="toggle input visibility"
          >
            {isVisible ? (
              <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
            ) : (
              <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
            )}
          </button>
        }
        type={isVisible ? "text" : "password"}
      />
    </div>
  );
}

export default InputApiKey;
