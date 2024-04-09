import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store/store";
import {
  addFromExcel,
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from "../../store/slice/products";
import { getCategory } from "../../store/slice/category";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import "./Product.scss";
import PopUp from "./PopUp";
import { FaUpload } from "react-icons/fa";
import { Toast } from "primereact/toast";
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';
import { Paginator } from "primereact/paginator";

const Products = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [data, setData] = useState([]);
  const productDetails = useSelector((state: any) => state.productDetaild);
  const categoryDetails = useSelector((state: any) => state.categoryDetals);
  const [popupvisible, setPopupVisible] = useState<boolean>(false);
  const [mode, setMode] = useState("");
  const [product, setProduct]: any = useState({
    name: "",
    amount: 0,
    gst: 0,
    description: "",
    photo: "",
    category: null,
  });
  const [edit, setEdit]: any = useState({});
  const [file, setfile] = useState({ name: "", file: "", error: "" });
  const toast:any = useRef<Toast>(null);

  //pagination
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);
  const [totalPage, setTotalPage] = useState(0);
  const [page, setPage] = useState(0)
  const onPageChange = (event:any) => {
      setPage(event.page);
      setFirst(event.first);
      setRows(event.rows);
  };
  
  const accept = async(options:any) => {
    try {
      const rs = await dispatch(deleteProduct({ id: options._id }));
      if (rs.payload.status && !categoryDetails.body.loading) {
        setData(rs.payload.data);
        toast.current.show({ severity: 'info', summary: 'info', detail: 'Deleted Successfully', life: 3000 });
      }
    } catch (error) {
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error in deleting data', life: 3000 });
    }
  };

  const handleSubmit = async (type: any) => {
    try {
      if (type === "add") {
        const body = {
          name: product.name,
          description: product.description,
          photo: product.photo,
          amount: Number(product.amount),
          category: product.category,
          gst: Number(product.gst),
        };
        const rs:any = await dispatch(createProduct(body));
        if(rs.payload.status && !productDetails.body.loading){
          setData(rs.payload.data);
        }
      } else {
        const body = {
          name: product.name,
          description: product.description,
          photo: product.photo,
          amount: Number(product.amount),
          category: product.category,
          gst: Number(product.gst),
          id: edit._id,
        };
        const rs:any = await dispatch(updateProduct(body));
        if(rs.payload.status && !productDetails.body.loading){
          setData(rs.payload.data);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchData = useCallback(async () => {
    try {
      const data = await dispatch(getProducts({ category: "",page : page, rows:rows,name : '' }));
      await dispatch(getCategory());
      setData(data.payload?.data);
      setTotalPage(data.payload.pagination.totalItems)
      // setData(data.payload?.data);
    } catch (error) {
      console.log(error);
    }
  }, [dispatch, page, rows]);

  useEffect(() => {
    const fetchDataAndLog = async () => {
      await fetchData();
    };
    fetchDataAndLog();
  }, [fetchData]);

  const imageTemplate = (options: any) => {
    return (
      <div className="flex">
        <img src={options.photo} alt={options.desc} width="32" />
      </div>
    );
  };

  const categoryTemplate = (options: any) => {
    const category = categoryDetails.body.data.find(
      (cat: any) => cat.categoryId === options.category
    );
    return category ? category.name : "";
  };

  const ActionsTemplate = (options: any) => {
    return (
      <div className="flex gap-2">
          <Button label="Update" severity="success" style={{height : '30px'}} onClick={(e: any) => showDialog("update", options)} />
          <Button label="Delete" severity="danger" style={{height : '30px'}} onClick={(e:any) => deleteProductOne(e,options)}/>
      </div>
    );
  };

  const DataTableComp = () => {
    return (
      <div className="py-3 w-100">
        <DataTable
          value={data}
          scrollable
          scrollHeight="80vh"
          sortMode="multiple"
          showGridlines
          // paginator
          rows={10}
        >
          <Column
            field="photo"
            header="Image"
            body={imageTemplate}
            style={{ width: "10%" }}
            sortable
          ></Column>
          <Column
            field="gst"
            header="GST"
            style={{ width: "10%" }}
            sortable
          ></Column>
          <Column
            field="name"
            header="Name"
            style={{ width: "20%" }}
            sortable
          ></Column>
          <Column
            field="amount"
            header="Amount"
            style={{ width: "10%" }}
            sortable
          ></Column>
          <Column
            field="category"
            header="Category"
            body={categoryTemplate}
            sortable
          ></Column>
          <Column
            field="actions"
            header="Actions"
            body={ActionsTemplate}
            style={{ width: "10%" }}
          ></Column>
        </DataTable>
        <Paginator first={first} rows={rows} totalRecords={totalPage} onPageChange={onPageChange} />
      </div>
    );
  };

  const showDialog = (type: string, options: any) => {
    setEdit(options);
    setMode(type);
    setPopupVisible(true);
  };

  const deleteProductOne = async (event:any,options: any) => {
    confirmPopup({
        target: event.currentTarget,
        message: 'Do you want to delete this record?',
        icon: 'pi pi-info-circle',
        defaultFocus: 'reject',
        acceptClassName: 'p-button-danger',
        accept : () => accept(options),
    });
  };

  const customBase64Uploader = async (event: any) => {
    const selectedFile = event.target.files[0];
    if (
      selectedFile.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      selectedFile.type === "application/vnd.ms-excel"
    ) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64data: any = reader.result;
        setfile({ ...file, file: base64data, name: selectedFile.name });
      };

      reader.readAsDataURL(selectedFile);
    } else {
      event.target.value = null;
      setfile({ ...file, error: "Upload only Excel file" });
    }
  };

  const uploadFile = async () => {
    try {
      await dispatch(addFromExcel({ excel: file.file.split(",")[1] }));
      await fetchData();
      setfile({ name: "", file: "", error: "" });
    } catch (error) {
      console.log("error");
    }
  };

  return (
    <div>
      <Toast ref={toast} />
      <ConfirmPopup />
      {(categoryDetails.loading || productDetails.loading) && 'Loading Data. Please Wait....'}
      {!categoryDetails.loading &&
        !categoryDetails.error &&
        !productDetails.loading && (
          <div className="w-full p-3">
            <div className="flex justify-content-between">
              <Button
                label="Add Product"
                severity="success"
                onClick={() => showDialog("add", {})}
              />
              <div className="flex gap-2">
                {file.error && <span>{file.error}</span>}
                {file.name && <span>{file.name}</span>}
                <input
                  id="upload-input"
                  type="file"
                  onChange={customBase64Uploader}
                  className="hidden"
                />
                <label
                  htmlFor="upload-input"
                  className="bg-primary border-primary-500 px-3 py-2 text-base border-1 border-solid border-round cursor-pointer transition-all transition-duration-200 hover:bg-primary-600 hover:border-primary-600 active:bg-primary-700 active:border-primary-700"
                >
                  <FaUpload />
                </label>
                <Button
                  label="Upload"
                  severity="info"
                  onClick={uploadFile}
                  disabled={!file.name}
                />
              </div>
            </div>
            <PopUp
              product={product}
              setProduct={setProduct}
              popupvisible={popupvisible}
              setPopupVisible={setPopupVisible}
              categoryDetails={categoryDetails}
              mode={mode}
              edit={edit}
              setEdit={setEdit}
              handleSubmit={handleSubmit}
            />
            <DataTableComp />
          </div>
        )}
    </div>
  );
};

export default Products;
