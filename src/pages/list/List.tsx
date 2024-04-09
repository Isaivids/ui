import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { AppDispatch } from "../../store/store";
import { getProducts } from "../../store/slice/products";
import ProductCard from "../../components/productCard/ProductCard";
import { Message } from "primereact/message";
import { Paginator } from "primereact/paginator";
import { ProgressBar } from "primereact/progressbar";
import { Button } from "primereact/button";

const List = () => {
  const params: any = useParams();
  const [data, setData] = useState<any>([]);
  const productDetails = useSelector((state: any) => state.productDetaild);
  const userDetails = useSelector((state: any) => state.userDetails);
  const dispatch = useDispatch<AppDispatch>();
  const [seatchString, setSeatchString] = useState('')
  //pagination
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(100);
  const [totalPage, setTotalPage] = useState(0);
  const [page, setPage] = useState(0)
  const onPageChange = (event:any) => {
      setPage(event.page);
      setFirst(event.first);
      setRows(event.rows);
  };
  
  const searchProducts = async() =>{
    try {
      const products = await dispatch(getProducts({ category: params.id === 'all' ? '' : params.id, page : page, rows:rows , name : seatchString}));
      setData(products.payload?.data);
      setTotalPage(products.payload.pagination.totalItems)
    } catch (error) {
      console.log('err',error)
    }
  }

  const fetchData = useCallback(async () => {
    try {
      const products = await dispatch(getProducts({ category: params.id === 'all' ? '' : params.id, page : params.id !== 'all' ? null : page, rows:params.id !== 'all' ? null : rows , name : ''}));
      setData(products.payload?.data);
      setTotalPage(products.payload.pagination.totalItems)
    } catch (error) {
      console.log('err',error)
    }
  }, [dispatch, page, params.id, rows]);

  useEffect(() => {
    const fetchDataAndLog = async () => {
      await fetchData();
    };
    fetchDataAndLog();
  }, [fetchData, params.id]);

  return (
    <div>
      {productDetails.loading && <ProgressBar mode="indeterminate" style={{ height: '6px' }}></ProgressBar>}
      {productDetails.error && <Message severity="error" text="Unable to fetch Data" />}
      {(!productDetails.loading && !productDetails.error) && (  
        <>
          <div className="flex m-2 gap-2 col justify-content-center">
            <input type="text" className="col-9" value={seatchString} onChange={(e:any) => setSeatchString(e.target.value)}/>
            <Button style={{height:'30px'}} label="Search" severity="success" onClick={searchProducts}/>
            <Button label="Clear" style={{height:'30px'}} severity="warning" onClick={() => setSeatchString('')} disabled={!seatchString}/>
          </div>
          <ProductCard data={data} userDetails={userDetails}/>
          { params.id === 'all' && <Paginator first={first} rows={rows} totalRecords={totalPage} onPageChange={onPageChange} />}  
        </>
      )}
    </div>
  );
};

export default List;
