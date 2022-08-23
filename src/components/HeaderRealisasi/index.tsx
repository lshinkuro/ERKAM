/** @format */

import React from "react";
import { Collapse, Divider, Progress, Typography, Table, Badge } from "antd";
import { formatRupiah, uuidv4 } from "../../utils/helper";
import { useSelector } from "react-redux";
const { Panel } = Collapse;
const { Text } = Typography;

const HeaderRealisasi = () => {
  const store = useSelector((state: any) => state.store);
  const tmpRealisasiPendapatanHeader: any =
    store.realisasiPendapatanHeader || null;
  const tmpRekeningBelanja = store.rekeningBelanja || [];
  const tmpTipeKas = store.tipeKas || [];
  const tmpSumberDana = store.sumberDana || [];
  const columns: any = [
    {
      title: "Pendapatan",
      key: "real_pendapatan",
      dataIndex: "real_pendapatan",
      align: "right",
      render: (real_pendapatan) => formatRupiah(real_pendapatan),
    },
    {
      title: "Pengeluaran",
      key: "real_pengeluaran_keg",
      dataIndex: "real_pengeluaran_keg",
      align: "right",
      render: (real_pengeluaran_keg) => formatRupiah(real_pengeluaran_keg),
    },
    {
      title: "Pengeluaran Pajak",
      key: "real_pengeluaran_pajak",
      dataIndex: "real_pengeluaran_pajak",
      align: "right",
      render: (real_pengeluaran_pajak) => formatRupiah(real_pengeluaran_pajak),
    },
    {
      title: "Pengembalian",
      key: "real_pengembalian",
      dataIndex: "real_pengembalian",
      align: "right",
      render: (real_pengembalian) => formatRupiah(real_pengembalian),
    },
    {
      title: "Status",
      key: "status",
      dataIndex: "status",
      render: (status) => (
        <>
          <Badge
            status={
              (status === "Selesai" && "success") ||
              ((status === "Menunggu" || status === "Menunggu_realisasi") &&
                "warning") ||
              (status === "Ditolak" && "error") ||
              "default"
            }
            text={status}
          />
        </>
      ),
    },
  ];
  const headerPanel = (
    <>
      <div className=" p-3 ">
        <div className="flex flex-col justify-between md:flex-row gap-2">
          <div>
            <Text strong>Total Penerimaan di BKU</Text>
            <div>
              {formatRupiah(
                (tmpRealisasiPendapatanHeader &&
                  tmpRealisasiPendapatanHeader?.header1?.pendapatan) ||
                  0,
              )}
            </div>
          </div>
          <div>
            <Text strong>Total Pengeluaran di BKU</Text>
            <div>
              {formatRupiah(
                (tmpRealisasiPendapatanHeader &&
                  tmpRealisasiPendapatanHeader?.header1?.pengeluaran) ||
                  0,
              )}
            </div>
          </div>
          <div>
            <Text strong>Saldo BKU</Text>
            <div>
              {formatRupiah(
                (tmpRealisasiPendapatanHeader &&
                  tmpRealisasiPendapatanHeader?.header1?.sisa) ||
                  0,
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <div className="w-full md:w-1/2">
            <Progress
              percent={
                Math.round(
                  tmpRealisasiPendapatanHeader &&
                    tmpRealisasiPendapatanHeader?.header1?.usagepercent,
                ) || 0
              }
              status="active"
            />
          </div>
        </div>
      </div>
    </>
  );

  const subHeaderPanel = (item: any) => (
    <>
      <div className="flex  flex-col  md:items-center md:flex-row gap-2 ">
        <div className="flex-1">
          <Text strong>Kas</Text>
          <div>
            {item.kode_tipe_kas &&
              tmpTipeKas
                .filter((items) => items.kode === item.kode_tipe_kas)
                .map((items) => items.nama)}{" "}
            {item.rekening_bank_id &&
              tmpRekeningBelanja
                .filter((items) => items.id.includes(item.rekening_bank_id))
                .map((items) => `(${items.no_rekening}-${items.nama_bank})`)}
          </div>
        </div>
        <div className="flex-1">
          <div className="flex flex-col justify-between md:flex-row gap-1">
            <div>
              <Text strong>Total Pendapatan:</Text>
              <div>{formatRupiah(item.pendapatan)}</div>
            </div>
            <div>
              <Text strong>Total Pengeluaran:</Text>
              <div>{formatRupiah(item.pengeluaran)}</div>
            </div>
            <div>
              <Text strong>Sisa:</Text>
              <div>{formatRupiah(item.sisa)}</div>
            </div>
          </div>
          <Progress percent={Math.round(item.usagepercent)} status="active" />
        </div>
      </div>
    </>
  );
  return (
    <div className="m-5 p-5 bg-white shadow-md rounded">
      <Collapse>
        <Panel className="headerBelanja" header={headerPanel} key={uuidv4()}>
          <div className="mb-4">
            <Table
              rowKey={uuidv4()}
              columns={columns}
              dataSource={
                (tmpRealisasiPendapatanHeader &&
                  tmpRealisasiPendapatanHeader?.header2) ||
                []
              }
              bordered
              pagination={false}
            />
          </div>
          {tmpRealisasiPendapatanHeader &&
            tmpRealisasiPendapatanHeader?.header3?.map(
              (item: any, i: number) => {
                return (
                  <Collapse>
                    <Panel
                      className="headerBelanja"
                      header={subHeaderPanel(item)}
                      key={uuidv4()}>
                      {item.details.length &&
                        item.details.map((item2: any) => (
                          <>
                            <Divider />
                            <div className="flex  flex-col  md:items-center md:flex-row gap-2 ">
                              <div className="flex-1">
                                <Text strong>
                                  {item2.sumber_dana &&
                                    tmpSumberDana
                                      .filter(
                                        (items) =>
                                          items.kode === item2.sumber_dana,
                                      )
                                      .map((items) => items.nama)}
                                </Text>
                              </div>
                              <div className="flex-1">
                                <div className="flex flex-col justify-between md:flex-row gap-1">
                                  <div>
                                    <Text strong>Pendapatan:</Text>
                                    <div>{formatRupiah(item2.pendapatan)}</div>
                                  </div>
                                  <div>
                                    <Text strong>Pengeluaran:</Text>
                                    <div>{formatRupiah(item2.pengeluaran)}</div>
                                  </div>
                                  <div>
                                    <Text strong>Sisa:</Text>
                                    <div>{formatRupiah(item2.sisa)}</div>
                                  </div>
                                </div>
                                <Progress
                                  percent={Math.round(item2.usagepercent)}
                                  status="active"
                                />
                              </div>
                            </div>
                          </>
                        ))}
                    </Panel>
                  </Collapse>
                );
              },
            )}
        </Panel>
      </Collapse>
    </div>
  );
};
export default HeaderRealisasi;
