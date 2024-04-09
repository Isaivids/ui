import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import React, { useEffect, useState } from "react";

const AddPopup = ({
  popupVisible,
  setPopupVisible,
  mode,
  handleSubmit,
  edit,
}: any) => {
  const [item, setItem] = useState({ name: "", description: "", image: "" });
  const [fileName, setFileName] = useState({ name: "", error: "" });
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setItem((prevState: any) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleYes = () => {
    handleSubmit(mode, { ...item, id: edit._id, filename: fileName.name });
    setPopupVisible(false);
  };

  const handleNo = () => {
    setPopupVisible(false);
  };

  useEffect(() => {
    if (mode === "update") {
      setItem({
        name: edit.name,
        description: edit.description,
        image: edit.image,
      });
    } else if (mode === "add") {
      setItem({
        name: "",
        description: "",
        image: "",
      });
    }
  }, [edit, mode]);

  const footerContent = (
    <div>
      <Button
        label="No"
        icon="pi pi-times"
        className="p-button-text"
        onClick={handleNo}
      />
      <Button
        label={mode}
        icon="pi pi-check"
        disabled={!(item.image && item.name)}
        onClick={handleYes}
      />
    </div>
  );

  const onUpload = (e: any) => {
    if (e.target) {
      const selectedFile = e.target.files[0];
      if (selectedFile.size < 200 * 1024) {
        const fileType = selectedFile.type;
        if (fileType === "image/svg+xml" || fileType === "image/png") {
          const reader = new FileReader();
          reader.onloadend = () => {
            setFileName({ ...fileName, name: selectedFile.name, error: "" });
            const base64String = reader.result as string;
            setItem((prevState: any) => ({
              ...prevState,
              image: base64String,
            }));
          };
          reader.readAsDataURL(selectedFile);
        } else {
          setFileName({
            ...fileName,
            name: "",
            error: "File type must be SVG or PNG",
          });
        }
      } else {
        setFileName({
          ...fileName,
          name: "",
          error: "File size exceeds 200KB",
        });
      }
    }
  };
  

  return (
    <Dialog
      header="Category Details"
      visible={popupVisible}
      style={{ width: "50vw" }}
      onHide={() => setPopupVisible(false)}
      footer={footerContent}
    >
      <div className="grid-nogutter">
        <div className="flex flex-column">
          <label className="mb-1">Category Name</label>
          <input
            type="text"
            name="name"
            value={item.name}
            onChange={handleChange}
            maxLength={10}
          />
        </div>
        <div className="flex flex-column">
          <label className="mb-1">Category Description</label>
          <input
            type="text"
            name="description"
            value={item.description}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-column">
          <label className="mb-1" htmlFor="upload-input">
            Image
          </label>
          <input
            id="upload-input"
            type="file"
            onChange={(e: any) => onUpload(e)}
          />
          {item.image && (
            <div className="img-cont">
              <img src={`${item.image}`} alt="Seected" />
            </div>
          )}
          {fileName.error && <small>{fileName.error}</small>}
        </div>
      </div>
    </Dialog>
  );
};

export default AddPopup;
