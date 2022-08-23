/** @format */

import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import {
  Form,
  Button,
  Table,
  Modal,
  Space,
  Select,
  Typography,
  InputNumber,
  Input,
  Badge,
} from "antd";
import { BreadCrumb } from "../../../../components";
import { formatRupiah } from "../../../../utils/helper";
import { uuidv4 } from "../../../../utils/helper";

import { useDispatch, useSelector } from "react-redux";
import notifAlert from "../../../../components/NotifAlert";
import {
  ButtonLog,
  ButtonPlus,
  ButtonTableDelete,
  ButtonTableEdit,
  ButtonTambah,
} from "../../../../components/Button";
import { NotifMessage } from "../../../../components/NotifMessage";
import InputSearch from "../../../../components/InputSearch";
import { getReferenceAll } from "../../../../services/v2/referenceservice";
import { setStore } from "../../../../redux/actions";
import {
  deleteRencanaPedapatanDefinitif,
  editRencanaPendapatanDefinitif,
  importRencanaPendapatanDefinitif,
  postRencanaPendapatanDefinitif,
} from "../../../../services/v2/planningservice/rencanapendapatandefinitif";
import { getPlanningAll } from "../../../../services/v2/planningservice";
const { Text } = Typography;

const PaguDefPendapatan = () => {
  const itemBreadcrumb = [
    { path: "/", breadcrumbName: "Home" },
    { path: "/", breadcrumbName: "Rencana" },
    { path: "/", breadcrumbName: "Pagu Definitif" },
    { path: "/", breadcrumbName: "Pendapatan" },
  ];
  const route = useHistory();
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const auths = useSelector((state: any) => state.auth);
  const store = useSelector((state: any) => state.store);
  const auth = auths?.data || null;
  const kodeRole = auth?.kode_role;
  const storeSumberDana = store.sumberDana || [];
  const tmpRencanaPendapatanDefinitif = store.rencanaPendapatanDefinitif || [];
  const tmpRencanaTanggal = store.rencanaTanggal || [];

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [id, setID] = useState("");
  const [title, setTitle] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [search, setSearch] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [btnAction, setBtnAction] = useState(false);
  const [enabledNilai, setEnabledNilai] = useState(false);

  const tmpFilterSumberDana = tmpRencanaPendapatanDefinitif
    .filter((item: any) => !item.id.includes(id))
    .map((item: any) => item.kode_sumber_dana);

  /** Filter Search */
  let dataTable: any = search
    ? tmpRencanaPendapatanDefinitif.filter((item: any) => {
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
    : tmpRencanaPendapatanDefinitif;
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
        <Space>
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
    const rencanaPendapatanDefinitif = tmpRencanaPendapatanDefinitif.filter(
      (item: any) => !item.id.includes(record.id),
    );
    try {
      await deleteRencanaPedapatanDefinitif(record.id);
      notifAlert({
        type: "success",
        description: "Penghapusan Data Pendapatan Definitif Berhasil",
      });
      setTimeout(() => {
        dispatch(setStore({ rencanaPendapatanDefinitif }));
      }, 100);
    } catch (error) {
      console.log(error);
    }
  };

  const getPortalBos = async (values: any) => {
    const dataPortalBos = await getReferenceAll("portal-bos", {
      nsm: auth.madrasah.nsm,
      tahun: auth.isTahun,
    });
    const tmpBos =
      values === "apbn_bos_semester_1"
        ? "apbn_bos_semester1"
        : "apbn_bos_semester2";
    const tmoNilai = (dataPortalBos && dataPortalBos[`${tmpBos}`]) || "1";
    form.setFieldsValue({ nilaiPendapatan: tmoNilai });
  };

  const handleChange = (values: any) => {
    if (values === "apbn_bos_semester_1" || values === "apbn_bos_semester_2") {
      setEnabledNilai(true);
      getPortalBos(values);
    } else {
      setEnabledNilai(false);
    }
  };

  const confirmImport = () => {
    Modal.confirm({
      title: "Perhatian",
      content: informationImport,
      onOk() {
        return handleImport();
      },
      onCancel() {},
      okText: "Import",
      cancelText: "Batal",
      okType: "primary",
    });
  };

  const handleImport = async () => {
    const tmpImport = await importRencanaPendapatanDefinitif(auth.isTahun);
    if (tmpImport.length > 0) {
      const rencanaPendapatanDefinitif = tmpImport;
      notifAlert({
        type: "success",
        description: "Proses import data dari indikatif berhasil di import",
      });

      const rencanaKegiatanDefinitif = await getPlanningAll(
        "rencana/kegiatan-definitif",
        { tahun: auth.isTahun },
      );
      const rencanaRincianKegiatanDefinitif = await getPlanningAll(
        "rencana-rincian-kegiatan-definitif",
        { tahun: auth.isTahun },
      );
      const rencanaRekapSumberDanaBelanjaDefinitif = await getPlanningAll(
        "rencana-rekap-sumber-dana-belanja-definitif",
        { tahun: auth.isTahun },
      );
      const dataTmp = {
        rencanaKegiatanDefinitif,
        rencanaRincianKegiatanDefinitif,
        rencanaPendapatanDefinitif,
        rencanaRekapSumberDanaBelanjaDefinitif,
      };
      setTimeout(() => {
        dispatch(setStore(dataTmp));
      }, 100);
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
      const rencanaPendapatanDefinitif = [
        ...tmpRencanaPendapatanDefinitif,
        payload,
      ];
      try {
        await postRencanaPendapatanDefinitif(payload);
        notifAlert({
          type: "success",
          description: "Penambahan Data Pendapatan Definitif Berhasil",
        });
        setTimeout(() => {
          dispatch(setStore({ rencanaPendapatanDefinitif }));
        }, 100);
      } catch (error) {
        console.log(error);
      }
    } else {
      let filterData = tmpRencanaPendapatanDefinitif.filter(
        (item: any) => !item.id.includes(id),
      );
      const rencanaPendapatanDefinitif = [...filterData, payload];
      try {
        await editRencanaPendapatanDefinitif(payload);
        notifAlert({
          type: "success",
          description: "Penyimpanan Data Pendapatan Definitif Berhasil",
        });
        setTimeout(() => {
          dispatch(setStore({ rencanaPendapatanDefinitif }));
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
      <BreadCrumb routes={itemBreadcrumb} title="Pendapatan Definitif" />
      <div className="m-5 p-5 bg-white shadow-sm">
        <div className="mb-4">
          <NotifMessage
            tanggalErkam={tmpRencanaTanggal}
            module="pendapatanDefinitif"
            setAction={(action: boolean) => setBtnAction(action)}
          />
        </div>
        <div className="mb-4 flex justify-end">
          <div className="mr-4">
            <Space>
              {kodeRole === `kepala_madrasah` && (
                <>
                  <ButtonTambah onClick={handleTambah} disabled={btnAction} />
                  <ButtonPlus
                    title="Import Indikatif"
                    onClick={confirmImport}
                    type="primary"
                    disabled={btnAction}
                  />
                </>
              )}
              <ButtonLog
                onClick={() => route.push("/rencana/definitif/pendapatan/logs")}
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
              onChange={handleChange}
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
              disabled={enabledNilai}
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
};
const informationImport = (
  <>
    <p>
      Dengan menyetujui dan klik tombol <Text strong>Import</Text>, maka semua{" "}
      <Text strong>Rencana Indikatif</Text> : <br />
      <Badge status="default" /> Pendapatan Indikatif <br />
      <Badge status="default" /> Belanja Indikatif <br />
      <Badge status="default" /> Rincian Belanja Indikatif <br />
      akan di duplikasi kemudian di import ke dalam{" "}
      <Text strong>Rencana Definitif</Text>
    </p>
  </>
);
export default PaguDefPendapatan;
