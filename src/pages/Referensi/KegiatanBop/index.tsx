/** @format */

import React, { useEffect } from "react";
import { BreadCrumb } from "../../../components";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHeader,
  TableRow,
  Pagination,
} from "@windmill/react-ui";
import InputModal from "./inputmodal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faPencilAlt,
  faPlus,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";

function KegiatanBop() {
  const itemBreadcrumb = [
    { path: "/", breadcrumbName: "Home" },
    { path: "/", breadcrumbName: "Referensi" },
    { path: "/", breadcrumbName: "Kegiatan BOP" },
  ];
  const localItems = "kegiatan-bop";
  const resultsPerPage = 10;
  const [totalResults, setTotalResults] = React.useState<number>(1);
  const [pageTable, setPageTable] = React.useState<number>(1);
  const [dataTable, setDataTable] = React.useState<any>([]);
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);
  const [modalData, setModalData] = React.useState<any>("");

  function onPageChangeTable(p: number) {
    setPageTable(p);
  }

  const generateTableData = () => {
    if (localStorage.getItem(localItems)) {
      setTotalResults(
        JSON.parse(localStorage.getItem(localItems)!).length || 1,
      );
      setDataTable(
        JSON.parse(localStorage.getItem(localItems)!).slice(
          (pageTable - 1) * resultsPerPage,
          pageTable * resultsPerPage,
        ),
      );
    }
  };

  useEffect(() => {
    generateTableData();
  }, [localStorage.getItem(localItems)!]);

  useEffect(() => {
    generateTableData();
  }, [pageTable]);

  function showDetails(data: any) {
    setIsModalOpen(true);
    setModalData(data);
  }
  function showDetail() {
    setIsModalOpen(true);
  }

  function hideDetails() {
    setModalData("");
    setIsModalOpen(false);
  }

  function deleteData(data: any) {
    let tmp0: any = [];
    tmp0.push({
      id: data.id,
      isDeleted: "deleted",
    });
    setIsModalOpen(true);
    setModalData(tmp0[0]);
  }

  const status = (sts: string) => {
    if (sts === "1") {
      return "Aktif";
    } else if (sts === "0") {
      return "Tidak Aktif";
    }
  };
  const color = (sts: string) => {
    if (sts === "1") {
      return "success";
    } else if (sts === "0") {
      return "danger";
    }
  };

  return (
    <>
      <InputModal onClose={hideDetails} isOpen={isModalOpen} data={modalData} />
      <BreadCrumb routes={itemBreadcrumb} title="Kegiatan BOP" />
      <div className="m-5 p-5 bg-white shadow-md rounded">
        <div className="flex flex-row justify-end my-3">
          <div
            className="bg-blue-500 p-3  text-white cursor-pointer hover:bg-blue-700 flex items-center justify-center"
            onClick={showDetail}>
            <FontAwesomeIcon icon={faPlus} size="sm" />
          </div>
        </div>
        <div>
          <TableContainer className="mb-8">
            <Table>
              <TableHeader className="bg-blue-500">
                <tr className="text-white">
                  <TableCell width={5}>Kode</TableCell>
                  <TableCell>Nama Kegiatan </TableCell>
                  <TableCell width={5}>Tahun</TableCell>
                  <TableCell width={5}>Actions</TableCell>
                </tr>
              </TableHeader>
              <TableBody className="text-sm">
                {dataTable.map((user: any, i: number) => (
                  <TableRow key={i}>
                    <TableCell>{user.kode}</TableCell>
                    <TableCell>{user.nama}</TableCell>
                    <TableCell align="center">{user.tahun}</TableCell>
                    <TableCell align="center">
                      <div className="flex items-center text-white">
                        <div
                          // layout="link"
                          className="bg-blue-500 hover:bg-blue-700 mx-0 px-2 py-1 cursor-pointer"
                          aria-label="details"
                          title="Lihat Detail"
                          onClick={() => {
                            // goToKegiatan(user.kode);
                          }}>
                          <FontAwesomeIcon icon={faEye} size="sm" />
                        </div>
                        <div
                          // layout="link"
                          className="bg-yellow-300 hover:bg-yellow-400 mx-0 px-2 py-1 cursor-pointer"
                          aria-label="Edit"
                          title="Edit"
                          onClick={() => {
                            showDetails(user);
                          }}>
                          <FontAwesomeIcon icon={faPencilAlt} size="sm" />
                        </div>
                        <div
                          // layout="link"
                          className="bg-red-500 hover:bg-red-600 mx-0 px-2 py-1 cursor-pointer"
                          aria-label="details"
                          title="hapus"
                          onClick={() => {
                            deleteData(user);
                          }}>
                          <FontAwesomeIcon icon={faTrashAlt} size="sm" />
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TableFooter>
              <Pagination
                totalResults={totalResults}
                resultsPerPage={resultsPerPage}
                onChange={onPageChangeTable}
                label="Table navigation"
              />
            </TableFooter>
          </TableContainer>
        </div>
      </div>
    </>
  );
}

export default KegiatanBop;
