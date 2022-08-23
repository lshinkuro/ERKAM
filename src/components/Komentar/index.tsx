import React, { useState, useEffect } from "react";
import { useHistory, Link } from "react-router-dom";
import { BellIcon } from "../../icons";
import { Avatar, Badge, List } from 'antd';
import { MessageOutlined } from '@ant-design/icons';
import { Dropdown } from "@windmill/react-ui";
import * as commentService from "../../services/v2/notificationservice/comment";
let anchorRef: any = React.createRef();

export const Komentar = () => {
    const route = useHistory();
    const [isNotificationsMenuOpen, setIsNotificationsMenuOpen] = useState(false);
    const [isCheckNotif, setIsCheckNotif] = useState(false);
    const [listNotif, setListNotif] = useState<any>([]);
    const [countNotif, setcountNotif] = useState<number>(0);
    const [listPath, setListPath] = useState<any>([]);

    const handleNotificationsClick = () => {
        setIsNotificationsMenuOpen(!isNotificationsMenuOpen);
    }

    const getData = async () => {
        let params = {
            notificationStatus: 'NOT_READ'
        };

        let commentTmp: any = await commentService.getComments(params);
        let pathTmp: any = commentService.getMenuPage();
        setListPath(pathTmp);
        const total = commentTmp.length;
        // Check total notif and filter status true
        if (total > 0) {
            setcountNotif(total);
            setIsCheckNotif(true);
        } else {
            setcountNotif(total);
            setIsCheckNotif(false);
        }
        setListNotif(commentTmp);
    }

    useEffect(() => {
        getData();

    }, [localStorage.getItem("notification")!]);

    const handleLink = async (items) => {
        let path;
        listPath.filter(e => e.name === items.menuPage).map(e => {
            return path = e.path;
        });
        let payload = {
            id: items.id,
            notificationStatus: 'READ'
        }
        await commentService.changeStatusComment(payload);
        getData();
        setIsNotificationsMenuOpen(false);
        (path && route.push(path))
    }

    return (
        <>
            <Badge size="small" count={countNotif} aria-label="Notifications" aria-haspopup="true">
                <MessageOutlined style={{ fontSize: '20px', color: '#FFF' }} onClick={handleNotificationsClick} />
            </Badge>

            <Dropdown
                align="right"
                isOpen={isNotificationsMenuOpen}
                onClose={() => setIsNotificationsMenuOpen(false)}
            >
                <div className="display-block h-48 overflow-y-auto bg-gray-100">
                    {countNotif !== 0 ? (
                        <List
                            itemLayout="horizontal"
                            dataSource={listNotif}
                            className="p-2"
                            renderItem={(item: any) => {

                                return (

                                    <List.Item
                                        className="bg-grey-200 hover:bg-grey-700 "
                                        onClick={() => handleLink(item)}
                                    >
                                        <List.Item.Meta
                                            className="p-2"
                                            avatar={<MessageOutlined style={{ fontSize: '15px' }} />}
                                            title={item.menuPage}
                                            description={item.message}
                                        />
                                    </List.Item>

                                )
                            }}
                        />
                    ) : (
                        <div className="flex justify-center items-center h-full">
                            <div className="flex items-center">
                                <BellIcon className="w-5 h-5" aria-hidden="true" />
                                <span className="text-sm px-2">Tidak ada Komentar</span>
                            </div>
                        </div>
                    )}
                </div>
                <div className="text-sm p-2 text-center">Komentar <Badge className="" count={countNotif} /></div>
            </Dropdown>
        </>

    )
}
