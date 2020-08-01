import React from 'react';
import styles from './login.css';
import { Form, Input, Button, Avatar, Spin } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import HttpTool from '../../until/httpclint';
import Tool from '../../until/tool';
import router from 'umi/router';

export default class Login extends React.Component {
    state = {
        spinning: false,
    }

    onFinish = (values) => {
        this.setState({
            spinning: true
        })
        HttpTool.httpPost(`/api/v1/login`, values, {}, (data) => {
            this.setState({
                spinning: false
            });
            if (data.code === 1) {
                Tool.setAuto('admin');
                Tool.setToken(data.data.token);
                router.push('/');
            }
        })
    }

    render() {
        return (
            <div className={styles.normal}>
                <Spin tip="Loading..." spinning={this.state.spinning}>
                    <Avatar size={64} src="https://lab508.gitee.io/medias/logo.png" />
                    <Form
                        name="normal_login"
                        className="login-form"
                        initialValues={{
                            remember: true,
                        }}
                        onFinish={this.onFinish}
                    >
                        <Form.Item
                            name="username"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your Username!',
                                },
                            ]}
                        >
                            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your Password!',
                                },
                            ]}
                        >
                            <Input
                                prefix={<LockOutlined className="site-form-item-icon" />}
                                type="password"
                                placeholder="Password"
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                Log in
                        </Button>
                        </Form.Item>
                    </Form>
                </Spin>
            </div>
        );
    }
}