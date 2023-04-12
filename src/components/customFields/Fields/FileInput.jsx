import { Icon } from "@iconify/react";
import { useRef } from "react";

const FileInput = ({ files, name, handleChangeFn, handleDeleteItem }) => {
  const fileInputRef = useRef();
  function handleChange(event) {
    handleChangeFn(event.target.files[0]);
    fileInputRef.current.value = "";
  }
  function formatFileSize(bytes) {
    const sufixes = ["B", "kB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sufixes[i]}`;
  }
  return (
    <>
      <ul>
        {files?.map((file, index) => {
          return (
            <li
              key={index}
              id={index}
              className="flex items-center justify-between border-b py-2"
            >
              <div className="flex items-center gap-2">
                <Icon icon="uil:file" className="text-xl" />
                <p className="text-sm">{file.name}</p>
              </div>
              <div className="flex items-center gap-2">
                <p>{formatFileSize(file.size)}</p>
                <button onClick={() => handleDeleteItem(file.name)}>
                  <Icon icon="uil:trash" className="text-xl" />
                </button>
              </div>
            </li>
          );
        })}
      </ul>
      <input
        type="file"
        onChange={handleChange}
        className="input absolute top-full left-full opacity-0"
        id={name}
        name={name}
        ref={fileInputRef}
      />
      <button
        onClick={() => fileInputRef.current.click()}
        className="btn-filled mt-3"
      >
        browse
      </button>
    </>
  );
};

export default FileInput;
