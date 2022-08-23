/** @format */

import React, { useState } from "react";
import { BreadCrumb } from "../../../components";
import moment from "moment";
import "moment/locale/id";
import {
  Table,
  Input,
  Space,
  Form,
  Modal,
  Select,
  Tag,
  Switch,
  DatePicker,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  ButtonTableDelete,
  ButtonTableEdit,
  ButtonTambah,
} from "../../../components/Button";
import notifAlert from "../../../components/NotifAlert";
import { uuidv4 } from "../../../utils/helper";
import InputSearch from "../../../components/InputSearch";
import { setStore } from "../../../redux/actions";
import {
  deleteKegiatanSnp,
  postKegiatanSnp,
} from "../../../services/v2/referenceservice/snpkegiatanservices";

const Kegiatan = () => {
  const itemBreadcrumb = [
    { path: "/", breadcrumbName: "Home" },
    { path: "/", breadcrumbName: "Referensi" },
    { path: "/", breadcrumbName: "Kegiatan" },
  ];
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const store = useSelector((state: any) => state.store);
  const auths = useSelector((state: any) => state.auth);
  const auth = auths.data || null;
  const kodeRole = auth?.kode_role;
  const refKegiatan = store.kegiatan || [];
  const refSubKegiatan = store.subKegiatan || [];
  const refSnp = store.snp || [];
  const [search, setSearch] = useState<any>(null);
  const [id, setID] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [title, setTitle] = useState<any>("");
  const [openModal, setOpenModal] = useState(false);

  /** Filter Search */
  let dataTable: any = search
    ? refKegiatan.filter((item: any) => {
        const val = search.toLowerCase();
        return (
          (item.kegiatan.nama !== null &&
            (item.kegiatan.nama || "")
              .toString()
              .toLowerCase()
              .includes(val)) ||
          (item.kode_kegiatan !== null &&
            (item.kode_kegiatan || "").toString().toLowerCase().includes(val))
        );
      })
    : refKegiatan;
  const totalDataTable = dataTable.length;
  /**
   * Filter Pagination
   */
  dataTable = dataTable.filter((v, i) => {
    let start = pageSize * (page - 1);
    let end = start + pageSize;

    return i >= start && i < end;
  });

  const columnTmp: any = [
    {
      title: "Kode",
      dataIndex: "kode_kegiatan",
      key: "kode_kegiatan",
    },
    {
      title: "Tahun",
      dataIndex: "tahun",
      key: "tahun",
    },
    {
      title: "Kegiatan",
      key: "nama",
      render: (record) => record.kegiatan.nama,
    },
    {
      title: "Madrasah",
      key: "madrasah",
      render: (record) =>
        (record.kegiatan.madrasah === "0" && (
          <Tag color="default">Tidak Aktif</Tag>
        )) || <Tag color="success">Aktif</Tag>,
    },
    {
      title: "Ra",
      key: "ra",
      render: (record) =>
        (record.kegiatan.ra === "0" && (
          <Tag color="default">Tidak Aktif</Tag>
        )) || <Tag color="success">Aktif</Tag>,
    },
    {
      title: "Total Sub Kegiatan",
      dataIndex: "total_sub_kegiatan",
      key: "total_sub_kegiatan",
    },
    {
      title: "Aksi",
      key: "aksi",
      align: "center",
      width: 120,
      fixed: "right",
      render: (record) => (
        <Space>
          <ButtonTableEdit onClick={() => handleEdit(record)} />
          <ButtonTableDelete
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
    },
  ];

  kodeRole !== "super_admin_pusat" &&
    kodeRole !== "admin_pusat" &&
    delete columnTmp[5];

  const handleEdit = (record: any) => {
    setTitle("Edit");
    setOpenModal(true);
    setID(record.id);

    form.setFieldsValue({
      nama: record.kegiatan.nama,
      kode: record.kegiatan.kode,
      snp: record.kode_snp,
      tahun: moment(`${record.tahun}-01-01`),
      madrasah: record.kegiatan.madrasah === "1" ? true : false,
      ra: record.kegiatan.ra === "1" ? true : false,
    });
  };

  const handleDelete = async (record: any) => {
    try {
      await deleteKegiatanSnp(record.id);
      let kegiatan = refKegiatan.filter((item: any) => item.id !== record.id);

      notifAlert({
        type: "success",
        description: "Hapus data berhasil",
      });

      setTimeout(() => {
        dispatch(setStore({ kegiatan }));
      }, 100);
    } catch (error) {
      console.log(error);
    }
  };

  const handleTambah = () => {
    setTitle("Tambah");
    setID(uuidv4());
    setOpenModal(true);
    form.resetFields();
  };

  const handleSave = async (values: any) => {
    const payload: any = {
      id: id,
      tahun: moment(values.tahun).format("YYYY"),
      activated: 1,
      nama: values.nama,
      kode: values.kode,
      kode_snp: values.snp,
      madrasah: values.madrasah ? "1" : "0",
      ra: values.ra ? "1" : "0",
    };

    const filterKegiatan = refKegiatan.filter(
      (item: any) => !item.id.includes(id),
    );

    try {
      const res = await postKegiatanSnp(payload);
      const kegiatan = [...filterKegiatan, res];
      notifAlert({
        type: "success",
        description: "Data berhasil disimpan",
      });
      setTimeout(() => {
        dispatch(setStore({ kegiatan }));
      }, 100);
    } catch (error) {
      console.log(error);
    }

    setOpenModal(false);
  };

  const validateName = (_, values) => {
    const val = values.toLowerCase();

    const checkName: any =
      refKegiatan
        .filter((item) => !item.id.includes(id))
        .filter(
          (item) =>
            item.kegiatan.nama !== null &&
            (item.kegiatan.nama || "").toString().toLowerCase() === val,
        ) || null;
    if (checkName.length) {
      return Promise.reject("Nama Sudah Digunakan!");
    } else {
      return Promise.resolve();
    }
  };

  const validateKode = (_, values) => {
    const val = values.toLowerCase();

    const checkKode: any =
      refKegiatan
        .filter((item) => !item.id.includes(id))
        .filter(
          (item) =>
            item.kode_kegiatan !== null &&
            (item.kode_kegiatan || "").toString().toLowerCase() === val,
        ) || null;
    if (checkKode.length) {
      return Promise.reject("Kode Sudah Digunakan!");
    } else {
      return Promise.resolve();
    }
  };

  const columnSubKegiatanTmp = [
    {
      title: "Kode",
      dataIndex: "kode",
      key: "kode",
    },
    {
      title: "Tahun",
      dataIndex: "tahun",
      key: "tahun",
    },
    {
      title: "Nama Sub Kegiatan",
      key: "nama",
      dataIndex: "nama",
    },
    {
      title: "BOS",
      children: [
        {
          title: "Kode",
          key: "kode_bos",
          dataIndex: "kode_bos",
        },
        {
          title: "Komponen",
          key: "nama_bos",
          dataIndex: "nama_bos",
        },
      ],
    },
  ];

  const expandedRowSubKegiatan = (subKegiatanArr) => {
    let subKegiatanTmp: any = refSubKegiatan
      .filter((e) => e.kode_kegiatan === subKegiatanArr.kode_kegiatan)
      .filter((e) => e.tahun === subKegiatanArr.tahun);
    return (
      <Table
        rowKey={(record) => record.id}
        columns={columnSubKegiatanTmp}
        dataSource={subKegiatanTmp}
        pagination={false}
        bordered
      />
    );
  };
  return (
    <>
      <BreadCrumb routes={itemBreadcrumb} title="Kegiatan" />
      <div className="m-5 p-5 bg-white shadow-md rounded">
        <div className="mb-4 flex justify-end">
          {(kodeRole === "admin_pusat" || kodeRole === "super_admin_pusat") && (
            <div className="mr-4">
              <ButtonTambah onClick={handleTambah} />
            </div>
          )}
          <InputSearch
            className="w-3/4"
            onChange={(e: any) => setSearch(e.currentTarget.value)}
          />
        </div>
        <div className="w-full">
          <Table
            rowKey={(record) => record.id}
            columns={columnTmp}
            expandable={{
              expandedRowRender: (record) => expandedRowSubKegiatan(record),
            }}
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
        title={`${title} Kegiatan`}
        onCancel={() => setOpenModal(!openModal)}
        okText="Simpan"
        cancelText="Batal"
        onOk={() => form.submit()}>
        <Form
          form={form}
          key="formKegiatan"
          name="formKegiatan"
          layout="vertical"
          onFinish={handleSave}>
          <Form.Item
            label="Standar Nasional Pendidikan"
            name="snp"
            rules={[
              {
                required: true,
                message: "Standar Nasional Pendidikan tidak boleh kosong!",
              },
            ]}>
            <Select
              placeholder="Standar Nasional Pendidikan"
              allowClear
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option!.children as unknown as string).includes(input)
              }
              filterSort={(optionA, optionB) =>
                (optionA!.children as unknown as string)
                  .toLowerCase()
                  .localeCompare(
                    (optionB!.children as unknown as string).toLowerCase(),
                  )
              }
              showSearch>
              {refSnp &&
                refSnp.map((item, i) => (
                  <Select.Option
                    key={`snp${i}`}
                    value={
                      item.kode
                    }>{`${item.kode}. ${item.nama}`}</Select.Option>
                ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Kode"
            name="kode"
            rules={[
              { required: true, message: "Kode tidak boleh kosong!" },
              { validator: validateKode },
            ]}>
            <Input placeholder="Kode" />
          </Form.Item>
          <Form.Item
            label="Nama"
            name="nama"
            rules={[
              { required: true, message: "Nama tidak boleh kosong!" },
              { validator: validateName },
            ]}>
            <Input placeholder="Nama" />
          </Form.Item>
          <Form.Item
            label="Tahun"
            name="tahun"
            rules={[{ required: true, message: "Tahun tidak boleh kosong!" }]}>
            <DatePicker picker="year" placeholder="Tahun" />
          </Form.Item>
          <Form.Item label="Madrasah" name="madrasah" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item label="Ra" name="ra" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Kegiatan;
