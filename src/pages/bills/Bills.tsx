import React, { useState } from "react";
import "./Bills.scss";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store/store";
import { getBills } from "../../store/slice/bill";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Badge } from "primereact/badge";
const Bills = () => {
  let today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);
  const [date, setDate] = useState({ startDate: today, endDate: today });
  const dispatch = useDispatch<AppDispatch>();
  const billDetails = useSelector((state: any) => state.billDetails);

  const handleDateChange = (e: any) => {
    const { name } = e.target;
    setDate((prevDate) => ({
      ...prevDate,
      [name]: e.target.value,
    }));
  };

  const handleApiCall = async () => {
    const body = {
      startDate: date.startDate.toLocaleDateString("en-US"),
      endDate: date.endDate.toLocaleDateString("en-US"),
    };
    await dispatch(getBills(body));
  };

  const gstTemplate = (rowData: any) => {
    if(rowData.gstEnabled){
      return <Badge value="GST" severity={"success"} />
    }else{
      return <Badge value="No GST" severity={"danger"} />
    }
  };

  const DataTableComp = () => {
    return (
      <div className="py-3 w-100">
        <DataTable
          value={billDetails?.loadedBills?.data}
          scrollable
          scrollHeight="80vh"
          sortMode="multiple"
          showGridlines
          paginator
          rows={10}
        >
          <Column
            field="createdAt"
            header="Bill Date"
            sortable
            body={(rowData) => {
              return new Date(rowData.createdAt).toLocaleDateString('en-US',{ day: '2-digit', month: 'short', year: 'numeric' });
            }}
          ></Column>
          <Column field="billNumber" header="Bill Number" sortable></Column>
          <Column field="billName" header="Bill Name" sortable></Column>
          <Column field="gstEnabled" header="GST" sortable body={gstTemplate}></Column>
          <Column field="cash" header="Cash payment" sortable
            body = {(rowData:any) => {return(<Badge value={rowData?.cash ? 'Cash' : 'Others'} />)}}></Column>
          <Column field="individualTotal" header="Total" sortable></Column>
        </DataTable>
      </div>
    );
  };

  return (
    <div className="m-3">
      <div className="flex justify-content-between">
        <div className="flex gap-4 align-items-center">
          <div className="flex gap-2">
            <span className="text-base font-bold">From</span>
            <Calendar
              name="startDate"
              value={date.startDate}
              onChange={handleDateChange}
              maxDate={endOfToday}
              readOnlyInput
            />
          </div>
          <div className="flex gap-2">
            <span className="text-base font-bold">To</span>
            <Calendar
              name="endDate"
              value={date.endDate}
              onChange={handleDateChange}
              readOnlyInput
            />
          </div>
          <Button
            label="Get Bills"
            severity="secondary"
            style={{ height: "30px" }}
            disabled={!date.startDate || !date.endDate}
            onClick={handleApiCall}
          />
        </div>
        <div className="font-bold">
          GrandTotal : {billDetails.loadedBills.grandTotal}
        </div>
      </div>
      {billDetails.loading ? 'Loading Please Wait ....' : <DataTableComp />}
    </div>
  );
};

export default Bills;
