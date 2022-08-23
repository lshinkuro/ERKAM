/** @format */

import React, { useState, useEffect } from "react";
import { BreadCrumb } from "../../components";
import { useHistory } from "react-router-dom";
import * as commentService from "../../services/v2/notificationservice/comment";
// import moment from "moment";
// import 'moment/locale/id';

import {
  Table,
  Input,
  InputGroup,
  Icon,
  Button,
  ButtonToolbar,
  Badge,
  Modal,
  IconButton,
  Notification,
} from "rsuite";
import { Table as Tablea, Select } from "antd";
const { Pagination } = Table;
const { Option } = Select;
let tableBody;
function Komentar() {
  const route = useHistory();
  const itemBreadcrumb = [
    { path: "/", breadcrumbName: "Home" },
    { path: "/", breadcrumbName: "Komentar" },
  ];
  const [page, setPage] = useState(1);
  const [displayLength, setDisplayLength] = useState(10);
  const [title, setTitle] = useState("");
  const [deleteID, setDeleteID] = useState("");
  const [madrasah, setMadrasah] = useState<any>(null);
  const [menupage, setMenupage] = useState<any>(null);
  const [message, setMessage] = useState("");
  const [tableData, setTableData] = useState<any>([]);
  const [tableDataCount, setTableDataCount] = useState<any>([]);
  const [optMenupage, setOptMenupage] = useState<any>([]);
  const [openModalAction, setOpenModalAction] = useState(false);
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  let refMadrasah: any =
    JSON.parse(localStorage.getItem("referensi-madrasah")!) || [];
  let refRole: any = JSON.parse(localStorage.getItem("pusatrole")!) || [];
  let tmpAuth: any = JSON.parse(localStorage.getItem("auth")!) || [];
  let role = tmpAuth.kode_role || "";

  const handleChangePage = (dataKey) => {
    setPage(dataKey);
  };
  const handleChangeLength = (dataKey) => {
    setPage(page);
    setDisplayLength(dataKey);
  };

  const data = tableData.reverse().filter((v, i) => {
    let start = displayLength * (page - 1);
    let end = start + displayLength;

    return i >= start && i < end;
  });

  const getData = async () => {
    let params = {
      notificationStatus: "NOT_READ",
    };
    let dataTmp = await commentService.getComments(params);
    setTableData(dataTmp);
    setTableDataCount(dataTmp);
    let menuTmp: any = commentService.getMenuPage();
    setOptMenupage(menuTmp);
  };

  useEffect(() => {
    getData();
  }, [1]);

  useEffect(() => {
    let valid = false;
    if (madrasah === null) {
      valid = true;
    } else if (menupage === null) {
      valid = true;
    } else if (message === "") {
      valid = true;
    }
    setIsDisabled(valid);
  }, [madrasah, menupage, message]);

  const filterSearch = async (e) => {
    const search = e.toLowerCase();
    let tmpTable = JSON.parse(localStorage.getItem("komentar")!);

    if (search) {
      const val = (tmpTable || "").filter((item) => {
        return (
          item.menuPage.toLowerCase().includes(search) ||
          item.message.toLowerCase().includes(search)
        );
      });
      setTableData(val);
      setTableDataCount(val);
      resetPagination();
    } else {
      setTableData(tmpTable);
      setTableDataCount(tmpTable);
      resetPagination();
    }
  };

  function resetPagination() {
    const data = tableData.filter((v, i) => {
      let start = displayLength * (page - 1);
      let end = start + displayLength;
      return i >= start && i < end;
    });
  }

  function handleButtonAdd() {
    setOpenModalAction(true);
    setTitle("Tambah");
    setMadrasah(null);
    setMessage("");
    setMenupage(null);
  }

  function validationField(e, type) {
    if (e === undefined) {
      e = null;
    }
    switch (type) {
      case "madrasah":
        setMadrasah(e);
        return;
      case "menupage":
        setMenupage(e);
        return;
    }
  }

  const handleSave = async () => {
    setIsLoading(true);
    let payload = {
      madrasahId: madrasah,
      message: message,
      menuPage: menupage,
      tahun: tmpAuth.tahun,
    };

    try {
      let res = await commentService.postComment(payload);
      Notification["success"]({
        title: "Success",
        description: "Data berhasil di simpan",
      });
    } catch (err) {
      Notification["error"]({
        title: "Error",
        description: "Data gagal di simpan",
      });
    }
    setOpenModalAction(false);
    getData();
    setIsLoading(false);
  };

  const handleDelete = async () => {
    setIsLoading(true);

    try {
      let res = await commentService.deleteComment(deleteID);
      Notification["success"]({
        title: "Success",
        description: "Data berhasil di hapus",
      });
    } catch (err) {
      Notification["error"]({
        title: "Error",
        description: "Data gagal di hapus",
      });
    }
    setOpenModalDelete(false);
    getData();
    setIsLoading(false);
  };

  return (
    <>
      <BreadCrumb routes={itemBreadcrumb} title="Komentar" />
      <div className="m-5 p-5 bg-white shadow-sm">
        <div className="flex justify-end">
          <div className="w-1/2">
            <div className="flex items-center">
              <ButtonToolbar className="flex mr-2">
                {role !== "pengawas_pusat" && (
                  <Button color="green" onClick={handleButtonAdd} size="sm">
                    <Icon icon="plus" /> Tambah
                  </Button>
                )}
              </ButtonToolbar>
              <InputGroup inside>
                <Input
                  type="text"
                  name="search"
                  className="h-8 py-1 w-full pl-3"
                  placeholder="Cari..."
                  onChange={(e) => filterSearch(e)}
                />
                <InputGroup.Addon>
                  <Icon icon="search" />
                </InputGroup.Addon>
              </InputGroup>
            </div>
          </div>
        </div>
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
        <div className="w-full">
          <Tablea dataSource={data} bordered pagination={false}>
            <Tablea.Column
              title="User Role"
              align="center"
              key="kodeRole"
              dataIndex="kodeRole"
              render={(kodeRole) =>
                refRole
                  .filter((item) => item.kode === kodeRole)
                  .map((item) => item.nama)
              }
            />
            <Tablea.Column
              title="Madrasah"
              align="center"
              key="madrasahId"
              dataIndex="madrasahId"
              render={(madrasahId) =>
                refMadrasah
                  .filter((item) => item.id.includes(madrasahId))
                  .map((item) => item.nama)
              }
            />
            <Tablea.Column
              title="Menu Page"
              key="menuPage"
              align="center"
              dataIndex="menuPage"
            />
            <Tablea.Column
              title="Komentar"
              key="message"
              align="center"
              dataIndex="message"
            />
            <Tablea.Column
              title="Status"
              key="notificationStatus"
              align="center"
              dataIndex="notificationStatus"
              render={(notificationStatus) =>
                (notificationStatus === "READ" && (
                  <>
                    <Badge style={{ background: "#f5c31d" }} content="READ" />{" "}
                  </>
                )) ||
                (notificationStatus === "NOT_READ" && (
                  <>
                    <Badge
                      style={{ background: "#f53b2d" }}
                      content="NOT READ"
                    />{" "}
                  </>
                ))
              }
            />
            <Tablea.Column
              title="Aksi"
              key="id"
              fixed="right"
              align="center"
              render={(value, record) => {
                return (
                  <>
                    {role === value.kodeRole && (
                      <ButtonToolbar>
                        <IconButton
                          color="red"
                          placement="right"
                          onClick={() => {
                            setDeleteID(value.id);
                            return setOpenModalDelete(true);
                          }}
                          icon={<Icon icon="trash2" className="text-xs" />}
                          size="sm"
                        />
                      </ButtonToolbar>
                    )}
                  </>
                );
              }}
            />
          </Tablea>
        </div>
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

      <Modal
        show={openModalAction}
        onHide={() => setOpenModalAction(!openModalAction)}>
        <Modal.Header>
          <Modal.Title>{title} Komentar</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-2">
            <div className="mb-2">
              <p className="mb-4">
                <span className="text-red-400">*</span> Madrasah:
              </p>
              <div className="text-xs error">
                <Select
                  showSearch
                  allowClear
                  optionFilterProp="children"
                  value={madrasah}
                  placeholder="Madrasah"
                  className="w-full error"
                  onChange={(e) => validationField(e, "madrasah")}>
                  {refMadrasah.length !== 0 &&
                    refMadrasah.map((e) => {
                      return (
                        <Option value={e.id}>{e.nsm + " - " + e.nama}</Option>
                      );
                    })}
                </Select>
                {/* <span className="text-red-600">{errMadrasah}</span> */}
              </div>
            </div>
            <div className="mb-2">
              <p className="mb-4">
                <span className="text-red-400">*</span> Menu Page:
              </p>
              <div className="text-xs error">
                <Select
                  showSearch
                  allowClear
                  value={menupage}
                  placeholder="Menu Page"
                  className="w-full error"
                  options={
                    optMenupage.length !== 0
                      ? optMenupage.map((e) => {
                          return { value: e.name, label: e.name };
                        })
                      : []
                  }
                  onChange={(e) => validationField(e, "menupage")}
                />
                {/* <span className="text-red-600">{errMenupage}</span> */}
              </div>
            </div>
            <div className="mb-2">
              <p className="mb-4">
                <span className="text-red-400">*</span> Komentar:
              </p>
              <div className="text-xs ">
                <Input
                  componentClass="textarea"
                  defaultValue={message}
                  rows={3}
                  placeholder="Komentar"
                  onChange={(e) => setMessage(e)}
                />
                {/* <span className="text-red-600">{errMessage}</span> */}
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="pt-4">
          <Button
            appearance="ghost"
            onClick={() => setOpenModalAction(!openModalAction)}>
            Batal
          </Button>
          <Button
            color="green"
            loading={isLoading}
            disabled={isDisabled}
            onClick={handleSave}>
            Simpan
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={openModalDelete}
        onHide={() => setOpenModalDelete(!openModalDelete)}>
        <Modal.Header>
          <Modal.Title>
            <Icon icon="info" style={{ color: "red" }} /> Perhatian
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>Yakin Hapus Data?</Modal.Body>
        <Modal.Footer className="pt-4">
          <Button
            onClick={() => setOpenModalDelete(!openModalDelete)}
            appearance="ghost">
            Batal
          </Button>
          <Button color="red" loading={isLoading} onClick={handleDelete}>
            Hapus
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Komentar;
