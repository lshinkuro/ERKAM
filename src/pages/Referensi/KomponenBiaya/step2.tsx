/** @format */

import React, { useCallback, useState } from "react";
import { Alert, Button, Modal, ModalFooter } from "@windmill/react-ui";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faSync } from "@fortawesome/free-solid-svg-icons";

import XLSX from "xlsx";
import { Icon, Table } from "rsuite";
import { testUpload } from "../../../services/v2/referenceservice/komponenbiaya";

function Step2({ nextStep, prevStep }) {
  const [dataTable, setDataTable]: any = useState([]);
  // const [activeStep, setActiveStep] = React.useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setisSuccess] = useState(false);
  const [isFail, setisFail] = useState(false);
  const [log, setLog] = useState<any>("");

  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);
  const { Column, HeaderCell, Cell, Pagination } = Table;

  const customStyles = {
    rows: {
      style: {
        minHeight: "45px", // override the row height
      },
    },
    headCells: {
      style: {
        backgroundColor: "#1b6fbb",
        textTransform: "uppercase",
        color: "white",
      },
    },
  };

  const [isReading, setIsReading] = useState(false);

  const uploadTest = async (e: any) => {
    console.log("proses");

    setIsLoading(true);
    showDetails();
    try {
      const res: any = await testUpload(dataTable);
      setLog(res);
      setisSuccess(true);
      setisFail(false);
      setIsLoading(false);
    } catch (error) {
      // if (error.response) setLog(error.response.data.return);
      // else setLog(error.message);
      console.log(error);
      setisSuccess(false);
      setisFail(true);
      setIsLoading(false);
    }
  };
  const handleFileChange = useCallback((e: any) => {
    const file = e.target.files[0];
    var reader = new FileReader();
    showDetails();
    setIsLoading(true);

    try {
      reader.onload = function (e: any) {
        var data = new Uint8Array(e.target.result);
        var workbook = XLSX.read(data, { type: "array" });
        var firstSheet = workbook.SheetNames[0];
        setIsReading(false);
        const elements = XLSX.utils.sheet_to_json(workbook.Sheets[firstSheet]);
        console.log("Excel read OK!");
        console.log("Found " + elements.length + " elements");
        console.log("JSON size", JSON.stringify(elements).length, "bytes");
        setDataTable(elements);
        console.log(elements);
        setIsLoading(false);
        setisSuccess(true);
        setisFail(false);
        setIsLoading(false);
      };
      setIsReading(true);
      reader.readAsArrayBuffer(file);
      // setActiveStep(3);
    } catch (error) {}
  }, []);
  function hideDetails() {
    setIsModalOpen(false);
    nextStep();
  }
  function showDetails() {
    setIsModalOpen(true);
  }

  return (
    <>
      <div className="m-5 p-5 bg-white shadow-sm rounded-sm">
        <span>
          {dataTable.length == 0 ? (
            <div className="flex-1 text-center">
              <label
                htmlFor="upload"
                className="border-dashed p-4 border-2 border-light-blue-500">
                <input
                  // onClick={nextStep}
                  hidden
                  type="file"
                  accept=".xls, .xlsx"
                  id="upload"
                  className="inputFile"
                  onChange={handleFileChange}
                />
                Import Data / XLS <Icon icon="upload2" />
              </label>
            </div>
          ) : (
            ""
          )}
        </span>{" "}
        &nbsp;
        <div className="flex-1 text-center">
          <span>
            {dataTable.length > 0 ? (
              <Button
                style={{ backgroundColor: "#008e00" }}
                onClick={uploadTest}
                className="flex mt-7 text-white justify-center items-center bg-blue-500 hover:bg-blue-700 cursor-pointer p-2 rounded-md">
                <span className="text-xs">Prosses Data</span>
              </Button>
            ) : (
              ""
            )}
          </span>{" "}
          &nbsp;
        </div>
        <span>{log}</span>
        <div className="mt-8">
          {dataTable.length > 0 ? (
            <Table
              className="w-full"
              autoHeight
              data={dataTable}
              id="table"
              wordWraps
              cellBordered>
              <Column width={60}>
                <HeaderCell className="text-center">Tahun</HeaderCell>
                <Cell dataKey="Tahun" />
              </Column>
              <Column width={210}>
                <HeaderCell className="text-center">Kategori</HeaderCell>
                <Cell dataKey="Kategori" />
              </Column>
              <Column width={100}>
                <HeaderCell className="text-center">Kode Kategori</HeaderCell>
                <Cell dataKey=" Kode Kategori" />
              </Column>
              <Column width={140}>
                <HeaderCell className="text-center">Kode Provinsi</HeaderCell>
                <Cell dataKey="Kode Provinsi" />
              </Column>
              <Column width={140}>
                <HeaderCell className="text-center">Kode Kabkota</HeaderCell>
                <Cell dataKey="Kode Kabkota" />
              </Column>
              <Column width={75}>
                <HeaderCell className="text-center">Kode</HeaderCell>
                <Cell dataKey="Kode" />
              </Column>
              <Column width={255}>
                <HeaderCell className="text-center">Nama</HeaderCell>
                <Cell dataKey="Nama" />
              </Column>
              <Column width={100}>
                <HeaderCell className="text-center">Spesifikasi</HeaderCell>
                <Cell dataKey="Spesifikasi" />
              </Column>
              <Column width={75}>
                <HeaderCell className="text-center">Satuan</HeaderCell>
                <Cell dataKey="Satuan" />
              </Column>
              <Column width={100}>
                <HeaderCell className="text-center">Harga 1</HeaderCell>
                <Cell dataKey="Harga 1" />
              </Column>
              <Column width={100}>
                <HeaderCell className="text-center">Harga 2</HeaderCell>
                <Cell dataKey="Harga 2" />
              </Column>
              <Column width={100}>
                <HeaderCell className="text-center">Harga 3</HeaderCell>
                <Cell dataKey="Harga 3" />
              </Column>
            </Table>
          ) : (
            // <DataTableExtensions
            //   subHeader={columns}
            //   columns={columns}
            //   data={dataTable}
            // >
            //   <DataTable
            //     key={"asd"}
            //     subHeader={false}
            //     columns={columns}
            //     data={dataTable}
            //     noHeader
            //     responsive={true}
            //     defaultSortField="id"
            //     defaultSortAsc={false}
            //     pagination
            //     highlightOnHover
            //     customStyles={customStyles}
            //     overflowYOffset="hidden"
            //   />
            // </DataTableExtensions>
            ""
          )}
        </div>
      </div>

      <div className="m-5 p-5 bg-white shadow-sm rounded-sm">
        <div className="flex flex-row justify-end my-3 space-x-2">
          <Button
            style={{ backgroundColor: "#008e00" }}
            onClick={prevStep}
            className="flex text-white justify-center items-center bg-blue-500 hover:bg-blue-700 cursor-pointer p-2 rounded-md">
            <FontAwesomeIcon className="mr-2" icon={faArrowLeft} />
            <span className="text-xs">Kembali</span>
          </Button>
        </div>
        <Modal isOpen={isModalOpen} onClose={hideDetails}>
          {isLoading ? (
            <Alert type="info">
              Sedang Membaca File{" "}
              <FontAwesomeIcon className="ml-2" icon={faSync} spin size="sm" />
            </Alert>
          ) : null}
          {isSuccess ? (
            <Alert
              type="success"
              onClose={() => {
                setisSuccess(false);
              }}>
              {log ? log : "berhasil"}
            </Alert>
          ) : null}
          {isFail ? (
            <Alert
              type="danger"
              onClose={() => {
                setisFail(false);
              }}>
              {log ? log : "gagal"}
            </Alert>
          ) : null}
          <ModalFooter>
            <div className="hidden sm:block">
              <Button
                style={{ backgroundColor: "#008e00" }}
                layout="outline"
                onClick={hideDetails}>
                Ok
              </Button>
            </div>
            <div className="block w-full sm:hidden">
              <Button
                style={{ backgroundColor: "#008e00" }}
                block
                size="large"
                layout="outline"
                onClick={hideDetails}>
                Ok
              </Button>
            </div>
          </ModalFooter>
        </Modal>
      </div>
    </>
  );
}

export default Step2;
