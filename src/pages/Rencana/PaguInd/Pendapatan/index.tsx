/** @format */

import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { uuidv4 } from "../../../../utils/helper";
import {
  Table,
  Space,
  Form,
  Modal,
  Button,
  Select,
  Input,
  InputNumber,
} from "antd";
import { BreadCrumb } from "../../../../components";
import { formatRupiah } from "../../../../utils/helper";
import { useDispatch, useSelector } from "react-redux";
import {
  ButtonLog,
  ButtonTableDelete,
  ButtonTableEdit,
  ButtonTambah,
} from "../../../../components/Button";
import InputSearch from "../../../../components/InputSearch";
import { NotifMessage } from "../../../../components/NotifMessage";
import notifAlert from "../../../../components/NotifAlert";
import {
  deleteRencanaPedapatanIndikatif,
  getRencanaPendapatanIndikatifLisAlokasi,
  postRencanaPendapatanIndikatif,
  editRencanaPendapatanIndikatif,
} from "../../../../services/v2/planningservice/rencanapendapatanindikatif";
import { setStore } from "../../../../redux/actions";

/**
 * Tampilan awal pagu indikatif pendapatan
 */
function PaguIndikatifPendapatan() {
  const itemBreadcrumb = [
    { path: "/", breadcrumbName: "Home" },
    { path: "/", breadcrumbName: "Rencana" },
    { path: "/", breadcrumbName: "Pagu Indikatif" },
    { path: "/", breadcrumbName: "Pendapatan" },
  ];
  const route = useHistory();
  const [form] = Form.useForm();
  const auths = useSelector((state: any) => state.auth);
  const store = useSelector((state: any) => state.store);
  const dispatch = useDispatch();
  const auth = auths?.data || null;
  const kodeRole = auth?.kode_role;
  const storeSumberDana: any = store.sumberDana || [];
  const tmpRencanaPendapatanIndikatif = store.rencanaPendapatanIndikatif || [];
  const tmpRencanaTanggal = store.rencanaTanggal || [];

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [id, setID] = useState("");
  const [title, setTitle] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [search, setSearch] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [btnAction, setBtnAction] = useState(false);

  const tmpFilterSumberDana = tmpRencanaPendapatanIndikatif
    .filter((item: any) => !item.id.includes(id))
    .map((item: any) => item.kode_sumber_dana);

  /** Filter Search */
  let dataTable: any = search
    ? tmpRencanaPendapatanIndikatif.filter((item: any) => {
        const val = search.toLowerCase();
        return (
          (item.nama_sumber_dana !== null &&
            (item.nama_sumber_dana || "")
              .toString()
              .toLowerCase()
              .includes(val)) ||
          (item.keterangan !== null &&
            (item.keterangan || "").toString().toLowerCase().includes(val))
        );
      })
    : tmpRencanaPendapatanIndikatif;
  let totalDataTable = dataTable.length;
  /**
   * Filter Pagination
   */
  dataTable = dataTable.filter((v, i) => {
    let start = pageSize * (page - 1);
    let end = start + pageSize;

    return i >= start && i < end;
  });

  /**
   * Filter Sumber Dana By status Madrasah
   */
  const tmpSumberDana =
    auth?.madrasah?.status === "n"
      ? storeSumberDana.filter((item: any) => item.madrasah_n === "1")
      : auth?.madrasah?.status === "ra"
      ? storeSumberDana.filter((item: any) => item.ra === "1")
      : storeSumberDana.filter((item: any) => item.madrasah_s === "1");

  /**
   * Data untuk tabel children pertama
   */
  let columns: any = [
    {
      title: "Tahun",
      dataIndex: "tahun",
      key: "tahun",
      onFilter: (value, record) => record.tahun.indexOf(value) === 0,
      sorter: (a, b) => a.tahun - b.tahun,
    },
    {
      title: "Sumber Dana",
      key: "nama_sumber_dana",
      dataIndex: "nama_sumber_dana",
      onFilter: (value, record) => record.nama_sumber_dana.indexOf(value) === 0,
      sorter: (a, b) => a.nama_sumber_dana.localeCompare(b.nama_sumber_dana),
    },
    {
      title: "Jumlah",
      key: "jumlah",
      dataIndex: "jumlah",
      align: "right",
      onFilter: (value, record) => record.jumlah.indexOf(value) === 0,
      sorter: (a, b) => a.jumlah - b.jumlah,
      render: (jumlah) => formatRupiah(jumlah),
    },
    {
      title: "Keterangan",
      key: "keterangan",
      dataIndex: "keterangan",
    },
  ];

  if (kodeRole === `kepala_madrasah`) {
    columns.push({
      title: "Aksi",
      key: "aksi",
      render: (record) => (
        <Space key={`aksiP` + record.id}>
          <ButtonTableEdit
            onClick={() => handleEdit(record)}
            disabled={btnAction}
          />
          <ButtonTableDelete
            disabled={btnAction}
            onClick={() => {
              Modal.confirm({
                title: "Perhatian",
                content: "Yakin Hapus Data?",
                onOk() {
                  return handleDelete(record);
                },
                onCancel() {},
                okText: "Hapus",
                cancelText: "Batal",
                okType: "danger",
              });
            }}
          />
        </Space>
      ),
    });
  }

  /** function handle tambah */
  const handleTambah = () => {
    setOpenModal(true);
    setTitle("Tambah");
    setID(uuidv4());
    form.resetFields();
  };

  const handleEdit = (record: any) => {
    setOpenModal(true);
    setTitle("Edit");
    setID(record.id);
    form.setFieldsValue({
      nilaiPendapatan: record.jumlah,
      keterangan: record.keterangan,
      sumberDana: record.kode_sumber_dana,
    });
  };

  const handleDelete = async (record: any) => {
    const response = await getRencanaPendapatanIndikatifLisAlokasi(record.id);
    if (response.length < 1) {
      const rencanaPendapatanIndikatif = tmpRencanaPendapatanIndikatif.filter(
        (item: any) => !item.id.includes(record.id),
      );
      try {
        await deleteRencanaPedapatanIndikatif(record.id);
        notifAlert({
          type: "success",
          description: "Penghapusan Data Pendapatan Indikatif Berhasil",
        });
        setTimeout(() => {
          dispatch(setStore({ rencanaPendapatanIndikatif }));
        }, 100);
      } catch (error) {
        console.log(error);
      }
    } else {
      notifAlert({
        type: "error",
        description:
          "Data tidak bisa dihapus karena sudah digunakan di rincian belanja",
      });
    }
  };

  const handleSave = async (values: any) => {
    setLoading(true);
    let namaSumber = tmpSumberDana.filter(
      (item: any) => item.kode === values.sumberDana,
    );
    let payload: any = {
      id: id,
      activated: "1",
      jumlah: values.nilaiPendapatan,
      kode_sumber_dana: values.sumberDana,
      nama_sumber_dana: namaSumber[0].nama,
      tahun: auth.isTahun,
      keterangan: values.keterangan,
    };
    if (title === "Tambah") {
      const rencanaPendapatanIndikatif = [
        ...tmpRencanaPendapatanIndikatif,
        payload,
      ];
      try {
        await postRencanaPendapatanIndikatif(payload);
        notifAlert({
          type: "success",
          description: "Penambahan Data Pendapatan Indikatif Berhasil",
        });
        setTimeout(() => {
          dispatch(setStore({ rencanaPendapatanIndikatif }));
        }, 100);
      } catch (error) {
        console.log(error);
      }
    } else {
      let filterData = tmpRencanaPendapatanIndikatif.filter(
        (item: any) => !item.id.includes(id),
      );
      const rencanaPendapatanIndikatif = [...filterData, payload];
      try {
        await editRencanaPendapatanIndikatif(payload);
        notifAlert({
          type: "success",
          description: "Penyimpanan Data Pendapatan Indikatif Berhasil",
        });
        setTimeout(() => {
          dispatch(setStore({ rencanaPendapatanIndikatif }));
        }, 100);
      } catch (error) {
        console.log(error);
      }
    }
    setOpenModal(false);
    setLoading(false);
  };

  return (
    <>
      <BreadCrumb routes={itemBreadcrumb} title="Pendapatan Indikatif" />
      <div className="m-5 p-5 bg-white shadow-md rounded">
        <div className="mb-4">
          <NotifMessage
            tanggalErkam={tmpRencanaTanggal}
            module="pendapatanIndikatif"
            setAction={(action: boolean) => setBtnAction(action)}
          />
        </div>
        <div className="mb-4 flex justify-end">
          <div className="mr-4">
            <Space>
              {kodeRole === `kepala_madrasah` && (
                <ButtonTambah onClick={handleTambah} disabled={btnAction} />
              )}
              <ButtonLog
                onClick={() => route.push("/rencana/indikatif/pendapatan/logs")}
              />
            </Space>
          </div>
          <InputSearch
            className="w-3/4"
            onChange={(e: any) => setSearch(e.currentTarget.value)}
          />
        </div>
        <div className="w-full">
          <Table
            rowKey={(record) => record.id}
            columns={columns}
            dataSource={dataTable}
            bordered
            pagination={{
              total: totalDataTable,
              position: ["bottomRight"],
              defaultPageSize: pageSize,
              defaultCurrent: page,
              showTotal: (total) => `Total ${total} items`,
              onChange(page, pageSize) {
                setPage(page);
                setPageSize(pageSize);
              },
            }}
          />
        </div>
      </div>
      <Modal
        visible={openModal}
        title={`${title} Rencana Pendapatan`}
        onCancel={() => setOpenModal(!openModal)}
        footer={[
          <Button key="back" onClick={() => setOpenModal(!openModal)}>
            Batal
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={() => form.submit()}>
            Simpan
          </Button>,
        ]}>
        <Form
          form={form}
          key="formPendapatanIndikatif"
          name="formPendapatanIndikatif"
          layout="vertical"
          onFinish={handleSave}>
          <Form.Item
            label="Sumber Dana"
            name="sumberDana"
            rules={[
              { required: true, message: "Sumber Dana tidak boleh kosong!" },
            ]}>
            <Select
              showSearch
              optionFilterProp="children"
              placeholder="Pilih Sumber Dana">
              {tmpSumberDana?.length &&
                tmpSumberDana
                  .filter(
                    (item: any) => !tmpFilterSumberDana.includes(item.kode),
                  )
                  .map((e: any, i: any) => {
                    return (
                      <Select.Option key={`role${i}`} value={e.kode}>
                        {e.nama}
                      </Select.Option>
                    );
                  })}
            </Select>
          </Form.Item>
          <Form.Item
            label="Nilai Pendapatan"
            name="nilaiPendapatan"
            rules={[
              {
                required: true,
                message: "Nilai Pendapatan tidak boleh kosong!",
              },
            ]}>
            <InputNumber
              style={{ width: "100%" }}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              prefix="Rp."
              placeholder="Silahkan isi Nilai Pendapatan"
            />
          </Form.Item>
          <Form.Item label="Keterangan" name="keterangan">
            <Input.TextArea placeholder="Keterangan" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
export default PaguIndikatifPendapatan;
