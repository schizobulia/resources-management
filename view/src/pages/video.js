import React from 'react';
import HttpTool from '../until/httpclint';
import Tool from "../until/tool";
import { List, Card, Upload, Button, Modal, Pagination, Spin, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import PlayerComponent from '../component/PlayerComponent/index';


export default class IndexPage extends React.Component {
    state = {
        videoList: [],
        limit: 4,
        mark: 1,
        modalVisible: false,
        hlsVideoUrls: [],
        sourceVideoUrl: '',
        uploadLoading: false,
        total: 0 //file total
    }

    componentDidMount = () => {
        this.updateData();
    }

    updateData() {
        HttpTool.httpget(`/api/v1/video?limit=${this.state.limit}&mark=${this.state.mark}`, {}, (data) => {
            this.setState({
                videoList: data.data,
                total: data.mark
            });
        });
    }

    paginationChange = (page) => {
        this.setState({
            mark: page
        }, () => {
            this.updateData();
        })
    }

    /**
     * upload file
     * @param {*} info 
     */
    uploadFile = (info) => {
        this.setState({
            uploadLoading: true
        });
        HttpTool.uploadFileShard(info, '/api/v1/video', (res, index) => {
            if (parseInt(res.data.index) === parseInt(index)) {
                let arr = this.state.videoList;
                let lenSource = res.data.source.split('/');
                arr.push(lenSource[lenSource.length - 1]);
                arr = arr.sort((a, b) => {
                    return parseInt(b.split('.')[0]) - parseInt(a.split('.')[0]);
                });
                this.setState({
                    uploadLoading: false,
                    videoList: arr
                });
                message.info('上传成功');
            }
        });
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
                    <Spin spinning={this.state.uploadLoading} multiple={false}>
                        <Upload name="file" beforeUpload={this.uploadFile} accept="video/mp4">
                            <Button>
                                <UploadOutlined /> Click to Upload
                    </Button>
                        </Upload>
                    </Spin>
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
                <Pagination defaultCurrent={1} total={this.state.total} pageSize={4} onChange={this.paginationChange} />

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