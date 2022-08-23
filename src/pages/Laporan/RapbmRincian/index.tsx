/** @format */

import React, { useState, useEffect } from "react";
import { BreadCrumb } from "../../../components";
import { useHistory } from "react-router-dom";
import { PdfIcon, ExcelIcon, DownloadIcon } from "../../../icons";
// import { Dropdown, DropdownItem } from "@windmill/react-ui";
import {
  Table,
  Input,
  InputGroup,
  Icon,
  ButtonToolbar,
  Dropdown,
} from "rsuite";

import "./component/filter";
import FilterLaporan from "./component/filter";

const { Pagination } = Table;

function RapbmRincian() {
  const route = useHistory();
  const auth: any = JSON.parse(localStorage.getItem("auth")!);
  const role = auth.nama_role || "";
  // const item = ["Home", "Laporan", "RAPBM Rincian"]
  const itemBreadcrumb = [
    { path: "/", breadcrumbName: "Home" },
    { path: "/", breadcrumbName: "Laporan" },
    { path: "/", breadcrumbName: "RAPBM Rincian" },
  ];
  const [page, setPage] = useState(1);
  const [displayLength, setDisplayLength] = useState(10);
  const [tableData, setTableData] = useState<any>([]);
  const [tableDataCount, setTableDataCount] = useState<any>([]);
  // const [openDropdownExport, setOpenDropdownExport] = useState(false)
  // const [dataTable, setDataTable] = useState<any>([])

  const handleChangePage = (dataKey) => {
    setPage(dataKey);
  };

  const handleChangeLength = (dataKey) => {
    setPage(page);
    setDisplayLength(dataKey);
  };

  const data = tableData.filter((v, i) => {
    let start = displayLength * (page - 1);
    let end = start + displayLength;

    return i >= start && i < end;
  });

  const getData = async () => {
    const dataTmp: any[] = [];
    setTableData(dataTmp);
    setTableDataCount(dataTmp);
  };

  useEffect(() => {
    getData();
  }, [localStorage.getItem("auth")!]);

  const filterSearch = async (e) => {};

  function resetPagination() {
    const data = tableData.filter((v, i) => {
      let start = displayLength * (page - 1);
      let end = start + displayLength;
      return i >= start && i < end;
    });
  }
  return (
    <>
      <BreadCrumb routes={itemBreadcrumb} title="Laporan RAPBM Rincian" />
      <div className="m-5 p-5 bg-white shadow-sm">
        <div className="flex justify-end">
          <ButtonToolbar>
            <Dropdown
              title="Export"
              className="border rounded"
              icon={
                <DownloadIcon
                  className="mr-2"
                  width="18px"
                  style={{ float: "left" }}
                />
              }>
              <Dropdown.Item className="px-2">
                <ExcelIcon className="mr-2" style={{ float: "left" }} /> Excel
              </Dropdown.Item>
              <Dropdown.Item className="px-2">
                <PdfIcon className="mr-2" style={{ float: "left" }} /> Pdf
              </Dropdown.Item>
            </Dropdown>
          </ButtonToolbar>
        </div>
        <div className="flex flex-col md:flex-row lg:flex-row justify-around  items-center">
          <div className="flex-1">
            <div className="flex items-center">
              <InputGroup inside>
                <Input
                  type="text"
                  name="search"
                  className="h-8 py-1 w-full "
                  placeholder="Cari..."
                  onChange={(e) => filterSearch(e)}
                />
                <InputGroup.Addon>
                  <Icon icon="search" />
                </InputGroup.Addon>
              </InputGroup>
            </div>
          </div>
          <div className="flex-1">
            <FilterLaporan />
          </div>
          <div className="flex-1">
            <div className="float-right">
              <Pagination
                className="pagination-justify-start"
                lengthMenu={[
                  { value: 10, label: 10 },
                  { value: 20, label: 20 },
                  { value: 40, label: 40 },
                ]}
                activePage={page}
                displayLength={displayLength}
                total={tableDataCount.length}
                ellipsis={true}
                boundaryLinks={true}
                onChangePage={handleChangePage}
                onChangeLength={handleChangeLength}
              />
            </div>
          </div>
        </div>
        <div className="w-full">&nbsp;</div>
        <div className="w-full">
          <Pagination
            lengthMenu={[
              { value: 10, label: 10 },
              { value: 20, label: 20 },
              { value: 40, label: 40 },
            ]}
            activePage={page}
            displayLength={displayLength}
            total={tableDataCount.length}
            ellipsis={true}
            boundaryLinks={true}
            onChangePage={handleChangePage}
            onChangeLength={handleChangeLength}
          />
        </div>
      </div>
    </>
  );
}

export default RapbmRincian;
