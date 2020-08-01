import React from 'react';
import HttpTool from '../until/httpclint';
import Tool from "../until/tool";
import { List, Card, Upload, Button, Modal, Pagination } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import PlayerComponent from '../component/PlayerComponent/index';


export default class IndexPage extends React.Component {
    state = {
        videoList: [],
        limit: 4,
        mark: 10,
        modalVisible: false,
        hlsVideoUrls: [],
        sourceVideoUrl: ''
    }

    componentDidMount = () => {
        this.updateData();
    }

    updateData(){
        HttpTool.httpget(`/api/v1/video?limit=${this.state.limit}&mark=${this.state.mark}`, {}, (data) => {
            this.setState({
                videoList: data.data
            })
        });
    }

    paginationChange = (page) => {
        this.setState({
            mark: page
        }, () => {
            this.updateData();
        })
    }

    uploadFile = (info) => {
        console.log(info.file);
    }

    showModal = (item) => {
        this.setState({
            hlsVideoUrls: Tool.getStaticVideoHlsUrl(item.split('.')[0]),
            sourceVideoUrl: Tool.getStaticVideoSourceUrl(item),
        }, () => {
            this.setState({
                modalVisible: true,
            });
        })

    };

    handleOk = e => {
        this.setState({
            modalVisible: false,
        });
    };

    handleCancel = e => {
        this.setState({
            modalVisible: false,
        });
    };

    render() {
        return (
            <div>
                <div style={{ marginBottom: "1rem", textAlign: "right" }}>
                    <Upload name="file" onChange={this.uploadFile} accept="video/mp4">
                        <Button>
                            <UploadOutlined /> Click to Upload
                    </Button>
                    </Upload>
                </div>
                <List
                    grid={{ gutter: 16, column: 4 }}
                    dataSource={this.state.videoList}
                    renderItem={item => (
                        <List.Item>
                            <Card title={item.split('.')[0]}>
                                <Button type="primary" onClick={this.showModal.bind(this, item)}>
                                    Open Video
                            </Button>
                            </Card>
                        </List.Item>
                    )}
                />
                <Pagination defaultCurrent={1} total={10} pageSize={4} onChange={this.paginationChange} />

                <Modal
                    title="Basic Modal"
                    visible={this.state.modalVisible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}>
                    <PlayerComponent sourceLink={this.state.sourceVideoUrl} hlsLinks={this.state.hlsVideoUrls}></PlayerComponent>
                </Modal>
            </div>
        );
    }
}