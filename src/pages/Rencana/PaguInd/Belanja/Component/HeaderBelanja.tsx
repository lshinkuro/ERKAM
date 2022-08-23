/** @format */

import React from "react";
import { Collapse, Divider, Progress, Typography } from "antd";
import { formatRupiah } from "../../../../../utils/helper";
const { Panel } = Collapse;
const { Text } = Typography;

const HeaderBelanja = (params: any) => {
  const tmpRekapSumberDana = params.data || [];
  let tmpTotalPendapatan: number = 0;
  let tmpTotalBelanja: number = 0;
  let tmpTotalSisa: number = 0;
  tmpRekapSumberDana.length &&
    // eslint-disable-next-line array-callback-return
    tmpRekapSumberDana.map((item: any) => {
      tmpTotalPendapatan += item.jumlah;
      tmpTotalBelanja += item.sub_total_rencana_belanja;
      tmpTotalSisa += item.selisih;
    });
  const headerPanel = (
    <>
      <div className=" p-3 ">
        <div className="flex flex-col justify-between md:flex-row gap-2">
          <div>
            <Text strong>Total Pendapatan:</Text>
            <div>{formatRupiah(tmpTotalPendapatan)}</div>
          </div>
          <div>
            <Text strong>Total Belanja:</Text>
            <div>{formatRupiah(tmpTotalBelanja)}</div>
          </div>
          <div>
            <Text strong>Sisa:</Text>
            <div>{formatRupiah(tmpTotalSisa)}</div>
          </div>
        </div>
        <div className="flex justify-end">
          <div className="w-full md:w-1/2">
            <Progress
              percent={Math.round((tmpTotalBelanja / tmpTotalPendapatan) * 100)}
              status="active"
            />
          </div>
        </div>
      </div>
    </>
  );
  return (
    <div className="m-5 p-5 bg-white shadow-md rounded">
      <Collapse>
        <Panel className="headerBelanja" header={headerPanel} key="1">
          {tmpRekapSumberDana.length &&
            tmpRekapSumberDana.map((item: any) => (
              <>
                <Divider />
                <div className="flex  flex-col  md:items-center md:flex-row gap-2 ">
                  <div className="flex-1">
                    <Text strong>{item.nama_kode_sumber_dana}</Text>
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col justify-between md:flex-row gap-1">
                      <div>
                        <Text strong>Total Pendapatan:</Text>
                        <div>{formatRupiah(item.jumlah)}</div>
                      </div>
                      <div>
                        <Text strong>Total Belanja:</Text>
                        <div>
                          {formatRupiah(item.sub_total_rencana_belanja)}
                        </div>
                      </div>
                      <div>
                        <Text strong>Sisa:</Text>
                        <div>{formatRupiah(item.selisih)}</div>
                      </div>
                    </div>
                    <Progress
                      percent={Math.round(
                        (item.sub_total_rencana_belanja / item.jumlah) * 100,
                      )}
                      status="active"
                    />
                  </div>
                </div>
              </>
            ))}
        </Panel>
      </Collapse>
    </div>
  );
};
export default HeaderBelanja;
