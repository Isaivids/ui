import { Button } from "primereact/button";
import React, { useEffect, useRef, useState } from "react";
import AddPopup from "./AddPopup";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useDispatch, useSelector } from "react-redux";
import { addCategory, deleteCategory, getCategory, updateCategory } from "../../store/slice/category";
import { AppDispatch } from "../../store/store";
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';
import { Toast } from "primereact/toast";

const Categories = () => {
  const [popupVisible, setPopupVisible] = useState(false);
  const categoryDetails = useSelector((state: any) => state.categoryDetals);
  const dispatch = useDispatch<AppDispatch>();
  const [mode, setMode] = useState("");
  const [data, setData] = useState([]);
  const [edit, setEdit] = useState({});
  const toast:any = useRef<Toast>(null);
  const accept = async(options:any) => {
    try {
      const rs = await dispatch(deleteCategory({id : options._id}));
      if (rs.payload.status && !categoryDetails.body.loading) {
        setData(rs.payload.data);
        toast.current.show({ severity: 'info', summary: 'info', detail: 'Deleted Successfully', life: 3000 });
      }
    } catch (error) {
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error in deleting data', life: 3000 });
    }
  };

  const deleteProductOne = async(event:any,options:any) =>{
    confirmPopup({
      target: event.currentTarget,
      message: 'Do you want to delete this record?',
      icon: 'pi pi-info-circle',
      defaultFocus: 'reject',
      acceptClassName: 'p-button-danger',
      accept : () => accept(options),
  });
  }

  const ActionsTemplate = (options: any) => {
    return (
      <div className="flex gap-2">
          <Button label="Update" severity="success" style={{height : '30px'}} onClick={(e: any) => showDialog("update", options)} />
          <Button label="Delete" severity="danger" style={{height : '30px'}} onClick={(e:any) => deleteProductOne(e,options)}/>
      </div>
    );
  };

  const handleSubmit = async (type: any, item: any) => {
    try {
      if (type === "add") {
        const rs: any = await dispatch(addCategory([item]));
        if (rs.payload.status && !categoryDetails.body.loading) {
          setData(rs.payload.data);
        }
      } else {
        const rs:any = await dispatch(updateCategory(item));
        if (rs.payload.status && !categoryDetails.body.loading) {
          setData(rs.payload.data);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const imageTemplate = (options: any) => {
    return (
      <div className="flex">
        <img src={options.image} alt={options.description} width="32" />
      </div>
    );
  };

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await dispatch(getCategory());
      setData(response.payload.data);
    };
    fetchCategories();
  }, [dispatch]);

  const DataTableComp = () => {
    return (
      <div className="py-3 w-100">
        <DataTable
          value={data}
          scrollable
          scrollHeight="80vh"
          sortMode="multiple"
          showGridlines
          paginator
          rows={10}
        >
          <Column
            field="image"
            header="Image"
            body={imageTemplate}
            sortable
          ></Column>
          <Column field="name" header="Name" sortable></Column>
          <Column field="description" header="Description" sortable></Column>
          <Column field="categoryId" header="Category ID" sortable></Column>
          <Column
            field="actions"
            header="Actions"
            body={ActionsTemplate}
          ></Column>
        </DataTable>
      </div>
    );
  };

  const showDialog = (type: string, options: any) => {
    setEdit(options);
    setMode(type);
    setPopupVisible(true);
  };

  return (
    <div className="w-full p-3">
      <Toast ref={toast} />
      <ConfirmPopup />
      {categoryDetails.loading ? 'Loading Data. Please Wait...': (
        <div>
          <div className="flex justify-content-between">
            <Button
              label="Add Category"
              severity="success"
              onClick={() => showDialog("add", {})}
            />
          </div>
          <AddPopup
            popupVisible={popupVisible}
            setPopupVisible={setPopupVisible}
            mode={mode}
            handleSubmit={handleSubmit}
            edit={edit}
          />
          <DataTableComp />
        </div>
      )}
    </div>
  );
};

export default Categories;
