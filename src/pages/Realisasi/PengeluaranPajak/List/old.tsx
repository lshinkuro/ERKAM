/** @format */

import React, { useState, useEffect } from "react";
import { BreadCrumb } from "../../../../components";
import { useHistory } from "react-router-dom";
import * as realizationService from "../../../../services/v2/realizationservice";
import { formatRupiah } from "../../../../utils/helper";
import moment from "moment";
import "moment/locale/id";
import {
  Table,
  Input,
  InputGroup,
  Icon,
  Button,
  ButtonToolbar,
  Modal,
  Badge,
  IconButton,
  DatePicker,
  Notification,
} from "rsuite";
import { Table as Tablea } from "antd";
const { Column, HeaderCell, Cell, Pagination } = Table;

let tableBody: any = null;

/**
 * Tampilan realisasi pengeluaran pajak
 */
function PengeluaranPajak() {
  const refSumberDana: any =
    JSON.parse(localStorage.getItem("rencana-pendapatan-definitif")!) || [];
  const refTipeKas: any =
    JSON.parse(localStorage.getItem("tipe-kas-controller")!) || [];
  const refPajak: any = JSON.parse(localStorage.getItem("kbiaya/pajak")!) || [];
  const refRekening: any =
    JSON.parse(localStorage.getItem("rekening-belanja")!) || [];
  // const refSaldoKas: any = JSON.parse(localStorage.getItem("realisasi-pendapatan-header")!) || [];
  const refPengeluaranKegiatan: any =
    JSON.parse(
      localStorage.getItem("realisasi-pengeluaran-kegiatan/rincian-nota")!,
    ) || [];
  // const refPajakData: any = JSON.parse(localStorage.getItem("realisasi-pengeluaran-pajak")!) || [];
  const refPenerima: any =
    JSON.parse(localStorage.getItem("penerimaRekening")!) || [];
  const refBank: any = JSON.parse(localStorage.getItem("bank")!) || [];

  const route = useHistory();
  const itemBreadcrumb = [
    { path: "/", breadcrumbName: "Home" },
    { path: "/", breadcrumbName: "Realisasi" },
    { path: "/", breadcrumbName: "Pengeluaran Pajak" },
    { path: "/", breadcrumbName: "List" },
  ];
  const [page, setPage] = useState(1);
  const [displayLength, setDisplayLength] = useState(10);
  const auth: any = JSON.parse(localStorage.getItem("auth")!);
  let role = auth.nama_role || "";
  const [tableData, setTableData] = useState<any>([]);
  const [tableDataCount, setTableDataCount] = useState<any>([]);
  //const [dataTable, setDataTable] = useState<any>([]);

  /**
   * Mengubah halaman pada tabel
   */
  const handleChangePage = (dataKey) => {
    setPage(dataKey);
  };

  /**
   * Mengubah total data pada tabel
   */
  const handleChangeLength = (dataKey) => {
    setPage(page);
    setDisplayLength(dataKey);
  };

  /**
   * Variabel untuk data yang akan tampil pada tabel
   */
  const data = tableData.filter((v, i) => {
    let start = displayLength * (page - 1);
    let end = start + displayLength;

    return i >= start && i < end;
  });

  /**
   * Mengambil data dari API
   */
  const getData = async () => {
    // const dataTmp: any[] = JSON.parse(localStorage.getItem("realisasi-pengeluaran-pajak")!) || [];
    let dataTmp =
      await realizationService.pengeluaranpajakService.getPengeluaranPajak(
        auth.tahun,
      );
    setTableData(dataTmp);
    setTableDataCount(dataTmp);
  };

  /**
   * Menjalankan fungsi getData selama waktu berjalan
   */
  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localStorage.getItem("auth")!]);

  /**
   * Untuk mencari data pada tabel sesuai apa yang user ketik
   */
  const filterSearch = async (e) => {
    const search = e.toLowerCase();
    // let tmpTable = JSON.parse(localStorage.getItem("realisasi-pengeluaran-pajak")!) || [];
    let tmpTable =
      await realizationService.pengeluaranpajakService.getPengeluaranPajak(
        auth.tahun,
      );

    if (search) {
      const val = (tmpTable || "").filter((item) => {
        return (
          (item.noNotaFormat !== null &&
            (item.noNotaFormat || "").toLowerCase().includes(search)) ||
          (item.keterangan !== null &&
            (item.keterangan || "").toLowerCase().includes(search)) ||
          // (item.nama_sub_kegiatan !== null &&
          //     (item.nama_sub_kegiatan || '').toLowerCase().includes(search)) ||
          // (item.indikator_output !== null &&
          //     (item.indikator_output || '').toLowerCase().includes(search)) ||
          // item.indikator_output_target.toLowerCase().includes(search) ||
          item.id.toLowerCase().includes(search)
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

  /**
   * Mengembalikan isi tabel ketika isian pencarian user di kosongkan
   */
  function resetPagination() {
    const data = tableData.filter((v, i) => {
      let start = displayLength * (page - 1);
      let end = start + displayLength;
      return i >= start && i < end;
    });
  }
  return (
    <>
      <BreadCrumb routes={itemBreadcrumb} title="Realisasi Pengeluaran Pajak" />
      <div className="m-5 p-5 bg-white shadow-sm">
        <div className="flex justify-end">
          <div className="w-1/2">
            <div className="flex items-center">
              <ButtonToolbar className="flex">
                {role === "Bendahara Madrasah" ? (
                  <Button
                    color="green"
                    onClick={() =>
                      route.push({
                        pathname: "add/",
                        state: { action: "Tambah", rowData: [] },
                      })
                    }
                    size="sm">
                    <Icon icon="plus" /> Tambah
                  </Button>
                ) : (
                  ""
                )}
                <Button
                  appearance="ghost"
                  onClick={() => route.push({ pathname: "logs/" })}
                  className="mr-2"
                  size="sm">
                  <Icon icon="cogs" /> Log
                </Button>
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
          <Table
            data={data}
            height={480}
            wordWrap
            cellBordered
            bordered
            bodyRef={(ref) => {
              tableBody = ref;
            }}>
            <Column width={380} verticalAlign="middle" align="center">
              <HeaderCell>No Nota</HeaderCell>
              <Cell dataKey="noNotaFormat" />
            </Column>
            <Column width={320} verticalAlign="middle" align="center">
              <HeaderCell>Jenis Pajak</HeaderCell>
              <Cell dataKey="kodePajak">
                {(rowData) =>
                  refPajak
                    .filter((e) => e.kode === rowData.kodePajak)
                    .map((e) => e.nama)
                }
              </Cell>
            </Column>
            <Column width={320} verticalAlign="middle" align="center">
              <HeaderCell>Sumber Dana</HeaderCell>
              <Cell>
                {(rowData) =>
                  refSumberDana
                    .filter(
                      (e) => e.kode_sumber_dana === rowData.kodeSumberDana,
                    )
                    .map((e) => e.nama_sumber_dana)
                }
              </Cell>
            </Column>
            <Column width={300} verticalAlign="middle" align="center">
              <HeaderCell>Tipe Kas</HeaderCell>
              <Cell dataKey="kodeTipeKas">
                {(rowData) =>
                  refTipeKas
                    .filter((e) => e.kode.includes(rowData.kodeTipeKas))
                    .map((e) => e.nama)
                }
              </Cell>
            </Column>
            <Column width={250} verticalAlign="middle" align="center">
              <HeaderCell>Keterangan</HeaderCell>
              <Cell dataKey="keterangan" />
            </Column>
            <Column width={250} verticalAlign="middle" align="center">
              <HeaderCell>Tanggal Nota</HeaderCell>
              <Cell>
                {(rowData) => {
                  return rowData.tanggalNota
                    ? moment(rowData.tanggalNota).format(
                        "dddd,DD MMM YYYY HH:mm:ss",
                      )
                    : "";
                }}
              </Cell>
            </Column>
            <Column width={250} verticalAlign="middle" align="center">
              <HeaderCell>Tanggal Realisasi</HeaderCell>
              <Cell>
                {(rowData) => {
                  return rowData.tanggalRealisasi
                    ? moment(rowData.tanggalRealisasi).format(
                        "dddd,DD MMM YYYY HH:mm:ss",
                      )
                    : "";
                }}
              </Cell>
            </Column>
            <Column width={250} verticalAlign="middle" align="center">
              <HeaderCell>No Referensi</HeaderCell>
              <Cell dataKey="realisasiNoReferensi" />
            </Column>
            <Column width={250} verticalAlign="middle" align="center">
              <HeaderCell>Jumlah</HeaderCell>
              <Cell>
                {(rowData) => {
                  return rowData.grandTotal
                    ? formatRupiah(rowData.grandTotal)
                    : "";
                }}
              </Cell>
            </Column>
            <Column
              width={220}
              verticalAlign="middle"
              align="center"
              fixed="right">
              <HeaderCell>Status</HeaderCell>
              <Cell>
                {(rowData) => {
                  return rowData.status
                    ? (rowData.status === "Menunggu" && (
                        <>
                          <Badge
                            style={{ background: "#f5c31d" }}
                            content="Menunggu"
                          />{" "}
                        </>
                      )) ||
                        (rowData.status === "Menunggu Tanggal Realisasi" && (
                          <>
                            <Badge
                              style={{ background: "#f5c31d" }}
                              content="Menunggu Tanggal Realisasi"
                            />{" "}
                          </>
                        )) ||
                        (rowData.status === "Selesai" && (
                          <>
                            <Badge
                              style={{ background: "#0e9f6e" }}
                              content="Selesai"
                            />{" "}
                          </>
                        )) ||
                        (rowData.status === "Tidak Disetujui" && (
                          <>
                            <Badge
                              style={{ background: "#f53b2d" }}
                              content="Tidak Disetujui"
                            />{" "}
                          </>
                        ))
                    : "";
                }}
              </Cell>
            </Column>
            <Column
              width={210}
              verticalAlign="middle"
              align="center"
              fixed="right">
              <HeaderCell>Aksi</HeaderCell>
              <ActionCell
                rowData={(rowData, rowIndex) => rowIndex}
                role={role}
                dataKey="id"
                onClear={getData}
                refPajak={refPajak}
                refRekening={refRekening}
                refBank={refBank}
                refPengeluaranKegiatan={refPengeluaranKegiatan}
                refPenerima={refPenerima}
                refSumberDana={refSumberDana}
                refTipeKas={refTipeKas}
              />
            </Column>
          </Table>
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
    </>
  );
}

/**
 * Memunculkan data untuk tombol action
 */
const ActionCell = ({ rowData, dataKey, ...props }) => {
  return (
    <Cell {...props} className="link-group">
      <CustomWhisper rowData={rowData} {...props} />
    </Cell>
  );
};

/**
 * Memunculkan modal pada tombol aksi
 */
const CustomWhisper: React.FC<any> = ({ rowData, ...props }) => {
  // let trigger;
  const [openModal, setOpenModal] = useState(false);
  const [openModalTanggal, setOpenModalTanggal] = useState(false);
  const [openModalNota, setOpenModalNota] = useState(false);
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [isLoadingTolak, setIsLoadingTolak] = useState(false);
  const [dataTab, setDataTab] = useState<any>([]);
  const [dataNota, setDataNota] = useState<any>([]);
  const [dataTabNota, setDataTabNota] = useState<any>([]);
  const [tanggal, setTanggal] = useState<any>(null);
  const [noreferensi, setNoReferensi] = useState<any>("");
  const route = useHistory();

  /**
   * Menjalankan fungsi saat ada perubahan pada data tabel
   */
  useEffect(() => {
    let biayaID = rowData.pajakDetails.map((e) => e.biayaId);
    let dataTmp = props.refPengeluaranKegiatan.filter((e) =>
      biayaID.includes(e.id),
    );
    setDataTab(dataTmp);
    setNoReferensi(
      rowData.realisasiNoReferensi ? rowData.realisasiNoReferensi : "",
    );
    setTanggal(rowData.tanggalRealisasi ? rowData.tanggalRealisasi : null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowData]);

  /**
   * Menjalankan fungsi saat ada perubahan pada tabel nota
   */
  useEffect(() => {
    let tabNota = dataNota.length !== 0 ? dataNota.biayaDetails : [];
    setDataTabNota(tabNota);
  }, [dataNota]);

  /**
   * Menjalankan fungsi saat ada tanggal terpilih
   */
  useEffect(() => {
    let valid = false;

    if (tanggal === null) {
      valid = true;
    } else if (noreferensi === "") {
      valid = true;
    }
    setIsDisabled(valid);
  }, [tanggal, noreferensi]);

  /**
   * Menjalankan tombol hapus
   */
  const hadleDelete = async () => {
    setIsLoading(true);
    try {
      await realizationService.pengeluaranpajakService.delPengeluaranPajak(
        rowData.id,
      );

      Notification["success"]({
        title: "Success",
        description: "Data berhasil di hapus",
      });
    } catch (err) {
      console.log(err);
    }
    props.onClear();
    setOpenModalDelete(false);
    setIsLoading(false);
  };

  const handleSetTanggal = async () => {
    setIsLoading(true);
    let params = {
      id: rowData.id,
      tanggalRealisasi: moment(tanggal).utc(),
      realisasiNoReferensi: noreferensi,
    };

    try {
      await realizationService.pengeluaranpajakService.putPengeluaranPajakRealisasi(
        params,
      );
      Notification["success"]({
        title: "Success",
        description: "Pengeluaran pajak berhasil ubah",
      });
    } catch (err) {
      console.log(err);
    }
    props.onClear();
    setOpenModalTanggal(false);
    setIsLoading(false);
  };

  /**
   * Menghandle saat approval modal
   */
  const handleApprove = async (action) => {
    let params = {
      id: rowData.id,
      approveStatus: action,
    };
    if (action === "DITOLAK") {
      setIsLoadingTolak(true);
      try {
        await realizationService.pengeluaranpajakService.putPengeluaranPajakDisapproval(
          params,
        );
        Notification["success"]({
          title: "Success",
          description: "Pengeluaran pajak berhasil ditolak",
        });
      } catch (err) {
        console.log(err);
      }
    } else {
      setIsLoading(true);
      try {
        await realizationService.pengeluaranpajakService.putPengeluaranPajakApproval(
          params,
        );
        Notification["success"]({
          title: "Success",
          description: "Pengeluaran pajak berhasil disetujui",
        });
      } catch (err) {
        console.log(err);
      }
    }

    props.onClear();
    setOpenModalTanggal(false);
    setIsLoading(false);
    setIsLoadingTolak(false);
  };

  /**
   * Set data kolom tabel
   */
  const columns = [
    {
      title: "Jenis Pajak",
      dataIndex: "jenispajak",
      key: "jenispajak",
      render: () =>
        props.refPajak
          .filter((e) => e.kode === rowData.kodePajak)
          .map((e) => e.nama),
    },
    {
      title: "No Nota",
      dataIndex: "noNotaFormat",
      key: "noNotaFormat",
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      render: (value, record) => {
        return record.biayaSumberDanas
          .filter((e) => e.kodeSumberDana === rowData.kodeSumberDana)
          .map((e) => formatRupiah(e.grandPajakTerutang));
      },
    },
    {
      title: "Aksi",
      dataIndex: "aksi",
      width: "15%",
      key: "id",
      render: (value, record) => (
        <ButtonToolbar>
          <IconButton
            color="blue"
            icon={<Icon icon="eye" />}
            onClick={() => {
              setOpenModalNota(true);
              setDataNota(record);
            }}
            size="sm"
          />
        </ButtonToolbar>
      ),
    },
  ];
  return (
    <>
      {(props.role === "Bendahara Madrasah" && (
        <ButtonToolbar>
          {(rowData.status === "Menunggu Tanggal Realisasi" ||
            rowData.status === "Selesai") && (
            <>
              <IconButton
                color="blue"
                placement="right"
                onClick={() => setOpenModalTanggal(true)}
                icon={<Icon icon="calendar" className="text-xs" />}
                size="sm"
              />
            </>
          )}
          <IconButton
            color="cyan"
            placement="right"
            onClick={() => setOpenModal(true)}
            icon={<Icon icon="eye" className="text-xs" />}
            size="sm"
          />

          <IconButton
            color="yellow"
            placement="right"
            onClick={() =>
              route.push({ pathname: "edit/" + rowData.id, state: rowData })
            }
            icon={<Icon icon="edit" className="text-xs" />}
            size="sm"
          />
          <IconButton
            color="red"
            placement="right"
            onClick={() => setOpenModalDelete(true)}
            icon={<Icon icon="trash2" className="text-xs" />}
            size="sm"
          />
        </ButtonToolbar>
      )) ||
        (props.role === "Kepala Madrasah" && (
          <ButtonToolbar>
            <IconButton
              color="blue"
              placement="right"
              onClick={() => setOpenModalTanggal(true)}
              icon={<Icon icon="check-circle-o" className="text-xs" />}
              size="sm"
            />
            <IconButton
              color="cyan"
              placement="right"
              onClick={() => setOpenModal(true)}
              icon={<Icon icon="eye" className="text-xs" />}
              size="sm"
            />
          </ButtonToolbar>
        ))}
      <Modal
        size="lg"
        show={openModalTanggal}
        onHide={() => setOpenModalTanggal(!openModalTanggal)}>
        <Modal.Header>
          <Modal.Title>
            {(props.role === "Bendahara Madrasah" &&
              "Set Tanggal Realisasi Nota Pajak ") ||
              (props.role === "Kepala Madrasah" && "Approval Nota Pajak")}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {props.role === "Bendahara Madrasah" && (
            <div className="grid gap-4 grid-cols-2">
              <div>
                <p className="mb-4">
                  Tanggal Realisasi <span className="text-red-400">*</span>
                </p>
                <p>
                  <DatePicker
                    className="w-full"
                    defaultValue={tanggal}
                    // disabledHours={hour => hour < parseInt(moment().format('hh'))}
                    disabledDate={(date: any) =>
                      moment(date).isBefore(rowData.tanggalNota, "day")
                    }
                    onChange={(e) => {
                      return e === undefined ? setTanggal(null) : setTanggal(e);
                    }}
                    format="DD MMM YYYY hh:mm:ss A"
                    showMeridian
                    placeholder="Tanggal Realisasi"
                    ranges={[{ label: "Now", value: new Date() }]}
                  />
                </p>
              </div>
              <div>
                <p className="mb-4">
                  No Referensi <span className="text-red-400">*</span>
                </p>
                <p>
                  <Input
                    placeholder="No Referensi"
                    defaultValue={noreferensi}
                    onChange={(e) => setNoReferensi(e)}
                  />
                </p>
              </div>
            </div>
          )}
          <div className="mb-4">
            <strong>Nota Pajak</strong>
          </div>
          <div className="grid gap-4 grid-cols-2">
            <div>
              <p className="mb-4">No Nota:</p>
              <p>{rowData ? rowData.noNotaFormat : ""}</p>
            </div>
            <div>
              <p className="mb-4">Tanggal Nota:</p>
              <p>
                {rowData
                  ? moment(rowData.tanggalNota).format(
                      "dddd,DD MMM YYYY HH:mm:ss",
                    )
                  : ""}
              </p>
            </div>
            <div>
              <p className="mb-4">No Referensi:</p>
              <p>
                {rowData.realisasiNoReferensi
                  ? rowData.realisasiNoReferensi
                  : "-"}
              </p>
            </div>
            <div>
              <p className="mb-4">Tanggal Realisasi:</p>
              <p>
                {rowData.tanggalRealisasi
                  ? moment(rowData.tanggalRealisasi).format(
                      "dddd,DD MMM YYYY HH:mm:ss",
                    )
                  : "-"}
              </p>
            </div>
            <div>
              <p className="mb-4">Sumber Dana:</p>
              <p>
                {rowData.kodeSumberDana
                  ? props.refSumberDana
                      .filter(
                        (e) => e.kode_sumber_dana === rowData.kodeSumberDana,
                      )
                      .map((e) => e.nama_sumber_dana)
                  : ""}
              </p>
            </div>
            <div>
              <p className="mb-4">Tipe Kas:</p>
              <p>
                {rowData.kodeTipeKas
                  ? props.refTipeKas
                      .filter((e) => e.kode === rowData.kodeTipeKas)
                      .map((e) => e.nama)
                  : ""}
              </p>
            </div>
            <div>
              <p className="mb-4">No Rekening:</p>
              <p>
                {rowData
                  ? props.refRekening
                      .filter((e) => e.id === rowData.rekeningBankId)
                      .map((e) => e.no_rekening)
                  : "-"}{" "}
              </p>
            </div>
            <div>
              <p className="mb-4">Rekening Atas Nama:</p>
              <p>
                {rowData
                  ? props.refRekening
                      .filter((e) => e.id === rowData.rekeningBankId)
                      .map((e) => e.no_rekening_nama)
                  : "-"}{" "}
              </p>
            </div>
            <div>
              <p className="mb-4">Nama Bank:</p>
              <p>
                {rowData
                  ? props.refRekening
                      .filter((e) => e.id === rowData.rekeningBankId)
                      .map((e) => e.nama_bank)
                  : "-"}{" "}
              </p>
            </div>
            <div>
              <p className="mb-4">Jenis Pajak:</p>
              <p>
                {rowData
                  ? props.refPajak
                      .filter((e) => e.kode === rowData.kodePajak)
                      .map((e) => e.nama)
                  : ""}
              </p>
            </div>
            <div>
              <p className="mb-4">Total:</p>
              <p>{rowData ? formatRupiah(rowData.grandTotal) : ""} </p>
            </div>
            <div>
              <p className="mb-4">Keterangan:</p>
              <p>{rowData ? rowData.keterangan : ""} </p>
            </div>
          </div>
          <div className="my-4 block overflow-auto">
            <Tablea columns={columns} dataSource={dataTab} bordered />
          </div>
        </Modal.Body>
        <Modal.Footer className="pt-4">
          <Button
            onClick={() => setOpenModalTanggal(!openModalTanggal)}
            appearance="ghost">
            Tutup
          </Button>
          {(props.role === "Bendahara Madrasah" && (
            <Button
              color="green"
              loading={isLoading}
              disabled={isDisabled}
              onClick={() => handleSetTanggal()}>
              Simpan
            </Button>
          )) ||
            (props.role === "Kepala Madrasah" && (
              <>
                <Button
                  color="red"
                  loading={isLoadingTolak}
                  onClick={() => handleApprove("DITOLAK")}>
                  Tolak
                </Button>
                <Button
                  color="green"
                  loading={isLoading}
                  onClick={() => handleApprove("DISETUJUI")}>
                  Disetujui
                </Button>
              </>
            ))}
        </Modal.Footer>
      </Modal>

      <Modal size="lg" show={openModal} onHide={() => setOpenModal(!openModal)}>
        <Modal.Header>
          <Modal.Title>Lihat Nota Pajak</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-4">
            <strong>Nota Pajak</strong>
          </div>
          <div className="grid gap-4 grid-cols-2">
            <div>
              <p className="mb-4">No Nota:</p>
              <p>{rowData ? rowData.noNotaFormat : ""}</p>
            </div>
            <div>
              <p className="mb-4">Tanggal Nota:</p>
              <p>
                {rowData
                  ? moment(rowData.tanggalNota).format(
                      "dddd,DD MMM YYYY HH:mm:ss",
                    )
                  : ""}
              </p>
            </div>
            <div>
              <p className="mb-4">No Referensi:</p>
              <p>
                {rowData.realisasiNoReferensi
                  ? rowData.realisasiNoReferensi
                  : "-"}
              </p>
            </div>
            <div>
              <p className="mb-4">Tanggal Realisasi:</p>
              <p>
                {rowData.tanggalRealisasi
                  ? moment(rowData.tanggalRealisasi).format(
                      "dddd,DD MMM YYYY HH:mm:ss",
                    )
                  : "-"}
              </p>
            </div>
            <div>
              <p className="mb-4">Sumber Dana:</p>
              <p>
                {rowData.kodeSumberDana
                  ? props.refSumberDana
                      .filter(
                        (e) => e.kode_sumber_dana === rowData.kodeSumberDana,
                      )
                      .map((e) => e.nama_sumber_dana)
                  : ""}
              </p>
            </div>
            <div>
              <p className="mb-4">Tipe Kas:</p>
              <p>
                {rowData.kodeTipeKas
                  ? props.refTipeKas
                      .filter((e) => e.kode === rowData.kodeTipeKas)
                      .map((e) => e.nama)
                  : ""}
              </p>
            </div>
            <div>
              <p className="mb-4">No Rekening:</p>
              <p>
                {rowData
                  ? props.refRekening
                      .filter((e) => e.id === rowData.rekeningBankId)
                      .map((e) => e.no_rekening)
                  : "-"}{" "}
              </p>
            </div>
            <div>
              <p className="mb-4">Rekening Atas Nama:</p>
              <p>
                {rowData
                  ? props.refRekening
                      .filter((e) => e.id === rowData.rekeningBankId)
                      .map((e) => e.no_rekening_nama)
                  : "-"}{" "}
              </p>
            </div>
            <div>
              <p className="mb-4">Nama Bank:</p>
              <p>
                {rowData
                  ? props.refRekening
                      .filter((e) => e.id === rowData.rekeningBankId)
                      .map((e) => e.nama_bank)
                  : "-"}{" "}
              </p>
            </div>
            <div>
              <p className="mb-4">Jenis Pajak:</p>
              <p>
                {rowData
                  ? props.refPajak
                      .filter((e) => e.kode === rowData.kodePajak)
                      .map((e) => e.nama)
                  : ""}
              </p>
            </div>
            <div>
              <p className="mb-4">Total:</p>
              <p>{rowData ? formatRupiah(rowData.grandTotal) : ""} </p>
            </div>
            <div>
              <p className="mb-4">Keterangan:</p>
              <p>{rowData ? rowData.keterangan : ""} </p>
            </div>
          </div>
          <div className="my-4">
            <Tablea columns={columns} dataSource={dataTab} bordered />
          </div>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>

      <Modal
        size="lg"
        show={openModalNota}
        onHide={() => setOpenModalNota(!openModalNota)}>
        <Modal.Header>
          <Modal.Title>Lihat Nota Pengeluaran</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-4">
            <strong>Nota Pengeluaran</strong>
          </div>
          <div className="grid gap-4 grid-cols-2">
            <div>
              <p className="mb-4">No Nota:</p>
              <p>{dataNota.length !== 0 ? dataNota.noNotaFormat : ""}</p>
            </div>
            <div>
              <p className="mb-4">Tanggal Nota:</p>
              <p>
                {dataNota.length !== 0
                  ? moment(dataNota.tanggalNota).format(
                      "dddd,DD MMM YYYY HH:mm:ss",
                    )
                  : ""}
              </p>
            </div>
            <div>
              <p className="mb-4">No Referensi:</p>
              <p>
                {dataNota.length !== 0 ? dataNota.realisasiNoReferensi : ""}
              </p>
            </div>
            <div>
              <p className="mb-4">Tanggal Realisasi:</p>
              <p>
                {dataNota.length !== 0
                  ? moment(dataNota.tanggalRealisasi).format(
                      "dddd,DD MMM YYYY HH:mm:ss",
                    )
                  : ""}
              </p>
            </div>
            <div>
              <p className="mb-4">Sumber Dana:</p>
              <p>
                {dataNota.length !== 0
                  ? dataNota.biayaSumberDanas
                      .filter(
                        (e) => e.kodeSumberDana === rowData.kodeSumberDana,
                      )
                      .map((e) => <div>{e.namaSumberDana}</div>)
                  : ""}
              </p>
            </div>
            <div>
              <p className="mb-4">Tipe Kas:</p>
              <p>
                {dataNota.length !== 0
                  ? dataNota.biayaSumberDanas
                      .filter(
                        (e) => e.kodeSumberDana === rowData.kodeSumberDana,
                      )
                      .map((e) => <div>{e.namaTipeKas}</div>)
                  : ""}
              </p>
            </div>
            <div>
              <p className="mb-4">No Rekening:</p>
              <p>
                {dataNota.length !== 0
                  ? dataNota.biayaSumberDanas
                      .filter(
                        (e) => e.kodeSumberDana === rowData.kodeSumberDana,
                      )
                      .map((e) => {
                        let rek = props.refRekening
                          .filter((f) => f.id.includes(e.rekeningBankId))
                          .map((f) => f.no_rekening);
                        return rek;
                      })
                  : ""}
              </p>
            </div>
            <div>
              <p className="mb-4">Rekening Atas Nama:</p>
              <p>
                {dataNota.length !== 0
                  ? dataNota.biayaSumberDanas
                      .filter(
                        (e) => e.kodeSumberDana === rowData.kodeSumberDana,
                      )
                      .map((e) => {
                        let rek = props.refRekening
                          .filter((f) => f.id.includes(e.rekeningBankId))
                          .map((f) => f.no_rekening_nama);
                        return rek;
                      })
                  : ""}
              </p>
            </div>
            <div>
              <p className="mb-4">Nama Bank:</p>
              <p>
                {dataNota.length !== 0
                  ? dataNota.biayaSumberDanas
                      .filter(
                        (e) => e.kodeSumberDana === rowData.kodeSumberDana,
                      )
                      .map((e) => <div>{e.rekeningBankNama}</div>)
                  : ""}
              </p>
            </div>
            <div>
              <p className="mb-4">Nama Penerima:</p>
              <p>
                {dataNota.length !== 0
                  ? props.refPenerima
                      .filter((e) => e.id.includes(dataNota.penerimaId))
                      .map((e) => e.nama)
                  : ""}
              </p>
            </div>
            <div>
              <p className="mb-4">No Rekening Penerima:</p>
              <p>
                {dataNota.length !== 0
                  ? props.refPenerima
                      .filter((e) => e.id.includes(dataNota.penerimaId))
                      .map((e) => {
                        let penerimaTmp = e.penerimaRekenings.map(
                          (r) => r.no_rekening,
                        );
                        return penerimaTmp;
                      })
                  : ""}
              </p>
            </div>
            <div>
              <p className="mb-4">Nama Bank Penerima:</p>
              <p>
                {dataNota.length !== 0
                  ? props.refPenerima
                      .filter((e) => e.id.includes(dataNota.penerimaId))
                      .map((e) => {
                        let penerimaTmp = e.penerimaRekenings.map((r) => {
                          let x = props.refBank
                            .filter((v) => v.kode === r.kode_bank)
                            .map((v) => v.nama);
                          return x;
                        });
                        return penerimaTmp;
                      })
                  : ""}
              </p>
            </div>
            <div>
              <p className="mb-4">Sub Total:</p>
              <p>
                {dataNota.length !== 0
                  ? dataNota.biayaSumberDanas
                      .filter(
                        (e) => e.kodeSumberDana === rowData.kodeSumberDana,
                      )
                      .map((e) => {
                        let x =
                          parseInt(e.grandPajak) +
                          parseInt(e.grandPajakTerutang) +
                          parseInt(e.jumlah);
                        return formatRupiah(x);
                      })
                  : ""}
              </p>
            </div>
            <div>
              <p className="mb-4">Pajak:</p>
              <p>
                {dataNota.length !== 0
                  ? dataNota.biayaSumberDanas
                      .filter(
                        (e) => e.kodeSumberDana === rowData.kodeSumberDana,
                      )
                      .map((e) => formatRupiah(e.grandPajak))
                  : ""}
              </p>
            </div>
            <div>
              <p className="mb-4">Pajak Terutang:</p>
              <p>
                {dataNota.length !== 0
                  ? dataNota.biayaSumberDanas
                      .filter(
                        (e) => e.kodeSumberDana === rowData.kodeSumberDana,
                      )
                      .map((e) => formatRupiah(e.grandPajakTerutang))
                  : ""}
              </p>
            </div>
            <div>
              <p className="mb-4">Total:</p>
              <p>
                {dataNota.length !== 0
                  ? dataNota.biayaSumberDanas
                      .filter(
                        (e) => e.kodeSumberDana === rowData.kodeSumberDana,
                      )
                      .map((e) => formatRupiah(e.jumlah))
                  : ""}
              </p>
            </div>
            <div>
              <p className="mb-4">Keterangan:</p>
              <p>{dataNota.length !== 0 ? dataNota.keterangan : ""}</p>
            </div>
          </div>
          <div className="my-4">
            <Tablea scroll={{ x: 1300 }} dataSource={dataTabNota} bordered>
              <Tablea.Column
                title="Kategory"
                dataIndex="komponenBiayaKategori"
                key="komponenBiayaKategori"
              />
              <Tablea.Column
                title="Nama"
                dataIndex="komponenBiayaNama"
                key="komponenBiayaNama"
              />
              <Tablea.Column
                title="Spesifikasi"
                dataIndex="komponenBiayaSpesifikasi"
                key="komponenBiayaSpesifikasi"
              />
              <Tablea.Column
                title="Satuan"
                dataIndex="komponenBiayaSatuan"
                key="komponenBiayaSatuan"
              />
              <Tablea.Column
                title="Kuantitas"
                dataIndex="kuantitas"
                key="kuantitas"
                render={(kuantitas) =>
                  dataNota.length !== 0
                    ? dataNota.biayaSumberDanas
                        .filter(
                          (e) => e.kodeSumberDana === rowData.kodeSumberDana,
                        )
                        .map((e) => e.quantity)
                    : ""
                }
              />
              <Tablea.Column
                title="Harga Satuan"
                dataIndex="hargaSatuan"
                key="hargaSatuan"
                align="right"
                render={(hargaSatuan) => formatRupiah(hargaSatuan)}
              />
              <Tablea.ColumnGroup title="Pemungut Pajak">
                <Tablea.Column
                  title="PPN"
                  dataIndex="pemungutPajakPpn"
                  key="pemungutPajakPpn"
                  render={(pemungutPajakPpn) =>
                    pemungutPajakPpn ? "Ya" : "Tidak"
                  }
                />
                <Tablea.Column
                  title="PPH"
                  dataIndex="pemungutPajakPph"
                  key="pemungutPajakPph"
                  render={(pemungutPajakPph) =>
                    pemungutPajakPph ? "Ya" : "Tidak"
                  }
                />
              </Tablea.ColumnGroup>
              <Tablea.ColumnGroup title="Biaya Pajak">
                <Tablea.Column
                  title="Biaya PPN"
                  dataIndex="biayaPpn"
                  key="biayaPpn"
                  align="right"
                  render={(biayaPpn) =>
                    dataNota.length !== 0
                      ? dataNota.biayaSumberDanas
                          .filter(
                            (e) => e.kodeSumberDana === rowData.kodeSumberDana,
                          )
                          .map((e) => formatRupiah(e.grandPajakTerutangPpn))
                      : ""
                  }
                />
                <Tablea.Column
                  title="Biaya PPH21"
                  dataIndex="biayaPph21"
                  key="biayaPph21"
                  align="right"
                  render={(biayaPph21) =>
                    dataNota.length !== 0
                      ? dataNota.biayaSumberDanas
                          .filter(
                            (e) => e.kodeSumberDana === rowData.kodeSumberDana,
                          )
                          .map((e) => formatRupiah(e.grandPajakTerutangPph21))
                      : ""
                  }
                />
                <Tablea.Column
                  title="Biaya PPH22"
                  dataIndex="biayaPph22"
                  key="biayaPph22"
                  align="right"
                  render={(biayaPph22) =>
                    dataNota.length !== 0
                      ? dataNota.biayaSumberDanas
                          .filter(
                            (e) => e.kodeSumberDana === rowData.kodeSumberDana,
                          )
                          .map((e) => formatRupiah(e.grandPajakTerutangPph22))
                      : ""
                  }
                />
                <Tablea.Column
                  title="Biaya PPH23"
                  dataIndex="biayaPph23"
                  key="biayaPph23"
                  align="right"
                  render={(biayaPph23) =>
                    dataNota.length !== 0
                      ? dataNota.biayaSumberDanas
                          .filter(
                            (e) => e.kodeSumberDana === rowData.kodeSumberDana,
                          )
                          .map((e) => formatRupiah(e.grandPajakTerutangPph23))
                      : ""
                  }
                />
              </Tablea.ColumnGroup>
              <Tablea.ColumnGroup title="Total">
                <Tablea.Column
                  title="Sub Total"
                  dataIndex="grandSubTotal"
                  key="grandSubTotal"
                  align="right"
                  render={(grandSubTotal) =>
                    dataNota.length !== 0
                      ? dataNota.biayaSumberDanas
                          .filter(
                            (e) => e.kodeSumberDana === rowData.kodeSumberDana,
                          )
                          .map((e) => formatRupiah(e.jumlah))
                      : ""
                  }
                />
                <Tablea.Column
                  title="Pajak"
                  dataIndex="grandPajak"
                  key="grandPajak"
                  align="right"
                  render={(grandPajak) =>
                    dataNota.length !== 0
                      ? dataNota.biayaSumberDanas
                          .filter(
                            (e) => e.kodeSumberDana === rowData.kodeSumberDana,
                          )
                          .map((e) => formatRupiah(e.grandPajak))
                      : ""
                  }
                />
                <Tablea.Column
                  title="Pajak Terutang"
                  dataIndex="grandPajakTerutang"
                  key="grandPajakTerutang"
                  align="right"
                  render={(grandPajakTerutang) =>
                    dataNota.length !== 0
                      ? dataNota.biayaSumberDanas
                          .filter(
                            (e) => e.kodeSumberDana === rowData.kodeSumberDana,
                          )
                          .map((e) => formatRupiah(e.grandPajakTerutang))
                      : ""
                  }
                />
                <Tablea.Column
                  title="Grand Total"
                  dataIndex="grandTotal"
                  key="grandTotal"
                  align="right"
                  render={(grandTotal) =>
                    dataNota.length !== 0
                      ? dataNota.biayaSumberDanas
                          .filter(
                            (e) => e.kodeSumberDana === rowData.kodeSumberDana,
                          )
                          .map((e) =>
                            formatRupiah(
                              parseInt(e.grandPajak) +
                                parseInt(e.grandPajakTerutang) +
                                parseInt(e.jumlah),
                            ),
                          )
                      : ""
                  }
                />
              </Tablea.ColumnGroup>
            </Tablea>
          </div>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
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
          <Button color="red" loading={isLoading} onClick={hadleDelete}>
            Hapus
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default PengeluaranPajak;
