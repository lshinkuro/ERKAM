/** @format */

import React, { useState } from "react";
import { BreadCrumb } from "../../../components";
import moment from "moment";
import "moment/locale/id";
import type { RangePickerProps } from "antd/es/date-picker";
import { uuidv4 } from "../../../utils/helper";
import {
  Table,
  Select,
  Space,
  Input,
  Button,
  Modal,
  Form,
  Badge,
  DatePicker,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import InputSearch from "../../../components/InputSearch";
import {
  ButtonTableApproval,
  ButtonTableEdit,
  ButtonTambah,
} from "../../../components/Button";
import notifAlert from "../../../components/NotifAlert";
import { setStore } from "../../../redux/actions";
import {
  deleteRencanaTanggal,
  editRencanaTanggal,
  postRencanaTanggal,
} from "../../../services/v2/planningservice/rencanatanggalservices";

const { RangePicker } = DatePicker;

const range = (start: number, end: number) => {
  const result: any = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return result;
};

// eslint-disable-next-line arrow-body-style
const disabledDate: RangePickerProps["disabledDate"] = (current) => {
  // Can not select days before today and today
  return current && current <= moment().startOf("day");
};

const disabledRangeTime: RangePickerProps["disabledTime"] = (_, type) => {
  if (type === "start") {
    return {
      disabledHours: () => range(0, 60).splice(4, 20),
      disabledMinutes: () => range(30, 60),
      disabledSeconds: () => [55, 56],
    };
  }
  return {
    disabledHours: () => range(0, 60).splice(20, 4),
    disabledMinutes: () => range(0, 31),
    disabledSeconds: () => [55, 56],
  };
};

const TanggalRkam = () => {
  // const route = useHistory();
  const itemBreadcrumb = [
    { path: "/", breadcrumbName: "Home" },
    { path: "/", breadcrumbName: "Pengaturan" },
    { path: "/", breadcrumbName: "Tanggal RKAM" },
  ];
  const dispatch = useDispatch();
  const store = useSelector((state: any) => state.store);
  const auths = useSelector((state: any) => state.auth);
  const [search, setSearch] = useState<any>(null);
  const [form] = Form.useForm();
  const [id, setID] = useState("");
  const [title, setTitle] = useState<any>(null);
  const [loading, setLoading] = useState<any>(false);
  const tmpTanggalRkam = store.rencanaTanggal || [];
  const auth = auths.data || [];

  const tmpJenisTahapan = [
    {
      value: "penetapan indikatif",
      label: "Penetapan Indikatif",
    },
    {
      value: "penetapan definitif",
      label: "Penetapan Definitif",
    },
    { value: "perubahan", label: "Perubahan" },
  ];

  const [openModal, setOpenModal] = useState(false);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  let dataTable = search
    ? tmpTanggalRkam.filter((item: any) => {
        const val = search.toLowerCase();
        return (
          (item.kode_jenis_tahapan !== null &&
            (item.kode_jenis_tahapan || "").toLowerCase().includes(val)) ||
          (item.keterangan !== null &&
            (item.keterangan || "").toLowerCase().includes(val))
        );
      })
    : tmpTanggalRkam;

  let totalDataTable = dataTable.length;
  /**
   * Filter Pagination
   */
  dataTable = dataTable
    .sort((a, b) => (parseInt(a.activated) < parseInt(b.activated) ? 1 : -1))
    .filter((v, i) => {
      let start = pageSize * (page - 1);
      let end = start + pageSize;

      return i >= start && i < end;
    });

  const handleEdit = (record: any) => {
    setTitle("Edit");
    setOpenModal(true);
    setID(record.id);
    form.setFieldsValue({
      kodeJenisTahapan: record.kode_jenis_tahapan,
      tanggal: [moment(record.start_date), moment(record.end_date)],
      keterangan: record.keterangan,
    });
  };

  const handleSelesai = async (record: any) => {
    try {
      await deleteRencanaTanggal(record.id);
      let filterData = tmpTanggalRkam.filter(
        (item: any) => !item.id.includes(record.id),
      );
      let payload = {
        ...record,
        activated: `0`,
      };

      const rencanaTanggal = [...filterData, payload];
      notifAlert({
        type: "success",
        description: "Tanggal tahapan berhasil selesai",
      });
      setTimeout(() => {
        dispatch(setStore({ rencanaTanggal }));
      }, 100);
    } catch (error) {
      console.log(error);
    }
  };

  const handleTambah = () => {
    setTitle("Tambah");
    setOpenModal(true);
    setID(uuidv4());
    form.setFieldsValue({
      kodeJenisTahapan: null,
      tanggal: null,
      keterangan: null,
    });
  };

  const handleSave = async (values: any) => {
    setLoading(true);
    let statusPagu = tmpJenisTahapan.filter((item: any) =>
      item.value.includes(values.kodeJenisTahapan),
    );

    let payload: any = {
      id: id,
      kode_jenis_tahapan: values.kodeJenisTahapan,
      keterangan: values.keterangan,
      tahun: auth.isTahun,
      start_date: moment(values.tanggal[0]).format("YYYY-MM-DDTHH:mm"),
      end_date: moment(values.tanggal[1]).format("YYYY-MM-DDTHH:mm"),
      status_pagu: statusPagu[0].label,
      expired: moment(values.tanggal[1]).format("YYYY-MM-DDTHH:mm"),
      kode_provinsi: auth.profile.kode_provinsi,
      kode_kabkota: auth.profile.kode_kabkota,
      activated: "1",
    };

    if (title === "Tambah") {
      let filterData = tmpTanggalRkam.filter(
        (item: any) => item.activated === `0`,
      );
      const rencanaTanggal = [...filterData, payload];
      try {
        await postRencanaTanggal(payload);
        notifAlert({
          type: "success",
          description: "Tanggal tahapan berhasil di simpan",
        });
        setTimeout(() => {
          dispatch(setStore({ rencanaTanggal }));
        }, 100);
      } catch (error) {
        console.log(error);
      }
    } else {
      let filterData = tmpTanggalRkam.filter(
        (item: any) => !item.id.includes(id),
      );
      const rencanaTanggal = [...filterData, payload];
      try {
        await editRencanaTanggal(payload);
        notifAlert({
          type: "success",
          description: "Tanggal tahapan berhasil di simpan",
        });
        setTimeout(() => {
          dispatch(setStore({ rencanaTanggal }));
        }, 100);
      } catch (error) {
        console.log(error);
      }
    }

    setOpenModal(false);
    setLoading(false);
  };

  const columns: any = [
    {
      title: "Tahapan",
      dataIndex: "kode_jenis_tahapan",
      key: "kode_jenis_tahapan",
      className: "capitalize",
    },
    {
      title: "Tanggal Mulai",
      dataIndex: "start_date",
      key: "start_date",
      render: (start_date) =>
        moment(start_date).format("dddd,DD MMM YYYY HH:mm:ss"),
    },
    {
      title: "Tanggal Akhir",
      dataIndex: "end_date",
      key: "end_date",
      render: (end_date) =>
        moment(end_date).format("dddd,DD MMM YYYY HH:mm:ss"),
    },
    {
      title: "Keterangan",
      dataIndex: "keterangan",
      key: "keterangan",
    },
    {
      title: "Status",
      dataIndex: "activated",
      key: "activated",
      render: (activated) =>
        (activated === "1" && (
          <>
            <Badge status="processing" text="Aktif" />
          </>
        )) || (
          <>
            <Badge status="success" text="Selesai" />
          </>
        ),
    },
    {
      title: "Aksi",
      key: "aksi",
      render: (record: any) =>
        record.activated === "1" && (
          <Space size="small">
            <ButtonTableEdit onClick={() => handleEdit(record)} />
            <ButtonTableApproval
              onClick={() => {
                Modal.confirm({
                  title: "Perhatian",
                  content: "Tetapkan Status Menjadi Selesai?",
                  onOk() {
                    return handleSelesai(record);
                  },
                  onCancel() {},
                  okText: "Selesai",
                  cancelText: "Batal",
                  okType: "danger",
                });
              }}
            />
          </Space>
        ),
    },
  ];

  return (
    <>
      <BreadCrumb routes={itemBreadcrumb} title="Tanggal Input ERKAM" />
      <div className="m-5 p-5 bg-white shadow-md rounded">
        <div className="mb-4 flex justify-end">
          <div className="mr-4">
            <ButtonTambah onClick={handleTambah} />
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
            tableLayout="auto"
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
        title={`${title} Tanggal RKAM`}
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
          key="formTanggalRkam"
          name="formTanggalRkam"
          layout="vertical"
          onFinish={handleSave}>
          <Form.Item
            label="Tahapan"
            name="kodeJenisTahapan"
            rules={[
              { required: true, message: "Sumber Dana tidak boleh kosong!" },
            ]}>
            <Select
              showSearch
              optionFilterProp="children"
              placeholder="Pilih Sumber Dana">
              {tmpJenisTahapan?.length &&
                tmpJenisTahapan.map((e: any, i: any) => {
                  return (
                    <Select.Option key={`role${i}`} value={e.value}>
                      {e.label}
                    </Select.Option>
                  );
                })}
            </Select>
          </Form.Item>
          <Form.Item
            label="Tanggal Mulai dan Akhir"
            name="tanggal"
            rules={[
              {
                required: true,
                message: "Tanggal Mulai dan Tanggal Akhir tidak boleh kosong!",
              },
            ]}>
            <RangePicker
              style={{ width: "100%" }}
              disabledDate={disabledDate}
              disabledTime={disabledRangeTime}
              placeholder={["Pilih Tanggal Mulai", "Pilih Tanggal Selesai"]}
              showTime={{
                hideDisabledOptions: true,
                defaultValue: [
                  moment("00:00:00", "HH:mm:ss"),
                  moment("11:59:59", "HH:mm:ss"),
                ],
              }}
              format="YYYY-MM-DD HH:mm:ss"
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

export default TanggalRkam;
