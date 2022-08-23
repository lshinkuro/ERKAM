/** @format */

import React from "react";
import {
  // useHistory,
  Link,
} from "react-router-dom";

import { Avatar, List, Tabs, Typography } from "antd";
import moment from "moment";
import {
  // BellOutlined,
  SoundOutlined,
} from "@ant-design/icons";

const { TabPane } = Tabs;
const { Text } = Typography;
export const Notification = () => {
  const data = [
    {
      title: "Approval",
      description: "Pengembalian dana",
      date: moment(),
    },
    {
      title: "Informasi",
      description: "Pengembalian dana",
      date: moment(),
    },
  ];
  return (
    <div className="card-container">
      <Tabs defaultActiveKey="1" type="card" size="small">
        <TabPane tab={`Notifikasi(${data.length})`} key="1">
          <div className="h-48  overflow-x-auto">
            <List
              itemLayout="horizontal"
              dataSource={data}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar icon={<SoundOutlined />} />}
                    title={<Link to="/">{item.title}</Link>}
                    description={item.description}
                  />
                </List.Item>
              )}
            />
          </div>
        </TabPane>
        <TabPane tab="Pesan" key="2">
          <div className="h-48  flex justify-center flex-col items-center">
            <SoundOutlined style={{ fontSize: 50 }} />
            <Text>Tidak ada pesan</Text>
          </div>
        </TabPane>
      </Tabs>
    </div>
  );
};
