import React, { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import "./Product.scss";

const PopUp = ({
  product,
  setProduct,
  popupvisible,
  setPopupVisible,
  categoryDetails,
  mode,
  edit,
  setEdit,
  handleSubmit
}: any) => {
  const [fileName, setFileName] = useState({name : '', error : ''});
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setProduct((prevState: any) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleYes = () => {
    setPopupVisible(false);
    handleSubmit(mode);
  };

  const handleNo = () =>{
    setPopupVisible(false);
  }

  const handleCategoryChange = (selectedCategory: any) => {
    setProduct((prevState: any) => ({
      ...prevState,
      category: selectedCategory.target.value,
    }));
  };

  const onUpload = (e: any) => {
    const selectedFile = e.target.files[0];
    if (selectedFile.size < 200 * 1024) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFileName({...fileName, name : selectedFile.name, error : ''});
        const base64String = reader.result as string;
        setProduct((prevState: any) => ({
          ...prevState,
          photo: base64String,
        }));
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setFileName({...fileName, name : '', error : 'File size exceeds 200KB'});
    }
  };

  const footerContent = (
    <div>
      <Button label="No" icon="pi pi-times" className="p-button-text" onClick={handleNo} />
      <Button label={mode} icon="pi pi-check" disabled={!(product.name && product.amount && product.gst && product.photo && product.category)} onClick={handleYes} />
    </div>
  );

  useEffect(() => {
    if (mode === "update") {
      setProduct({
        name: edit.name,
        gst: edit.gst,
        amount: edit.amount,
        category: edit.category,
        description: edit.description,
        photo: edit.photo,
      });
    } else if (mode === "add") {
      setProduct({
        name: "",
        gst: 0,
        amount: 0,
        category: "",
        description: "",
        photo: null,
      });
    }
  }, [edit, mode, setProduct]);

  return (
    <div className="card flex justify-content-center">
      <Dialog
        header="Product Details"
        visible={popupvisible}
        style={{ width: "50vw" }}
        onHide={() => setPopupVisible(false)}
        footer={footerContent}
      >
        <div className="grid-nogutter">
          <div className="flex flex-column">
            <label className="mb-1">Product Name</label>
            <input
              type="text"
              name="name"
              value={product.name}
              onChange={handleChange}
              maxLength={15}
            />
          </div>
          <div className="flex flex-column">
            <label className="mb-1">Amount</label>
            <input
              type="number"
              name="amount"
              value={product.amount}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-column">
            <label className="mb-1">Gst</label>
            <input
              type="number"
              name="gst"
              value={product.gst}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-column">
            <label className="mb-1">Description</label>
            <input
              type="text"
              name="description"
              value={product.description}
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
              onChange={(e:any) => onUpload(e)}
            />
            {fileName.error && <span>{fileName.error}</span>}
            {product.photo && (
              <div className="img-cont">
                <img src={`${product.photo}`} alt="Seected" />
              </div>
            )}
          </div>
          <div className="flex flex-column">
            <label className="mb-1">Category</label>
            <select value={product.category} onChange={handleCategoryChange}>
              <option value="">Select a Category</option>
              {categoryDetails.body.data &&
                categoryDetails.body.data.map((category: any) => (
                  <option key={category.categoryId} value={category.categoryId}>
                    {category.name}
                  </option>
                ))}
            </select>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default PopUp;
