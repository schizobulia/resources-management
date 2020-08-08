import React from 'react';
import ProLayout from '@ant-design/pro-layout';
import { Menu } from 'antd';
import { Link } from 'umi';
const { SubMenu } = Menu;

const ROUTERS = {
  '/': 'home',
  '/video': 'sub2-video',
};

export default class BasicLayout extends React.Component {


  rightContentRender = () => {
    return (
      <div>
        <Link to="/users/login">登录</Link>
      </div>
    )
  }

  menuItemRender = () => {
    return (
      <Menu
        selectedKeys={[ROUTERS[this.props.location.pathname]]}
        mode="inline"
        theme="dark"
      >
        <Menu.Item key="home"><Link to="/">首页</Link></Menu.Item>
        <SubMenu
          key="sub2"
          title={
            <span>
              <span>静态资源</span>
            </span>
          }
        >
          <Menu.Item key="sub2-video"><Link to="/video">视频</Link></Menu.Item>
        </SubMenu>
      </Menu>
    )
  }
  render() {
    let props = this.props;
    if (props.location.pathname === '/users/login') {
      return <div>{props.children}</div>
    }
    return (
      <ProLayout title="508lab"
        logo="https://lab508.gitee.io/favicon.png"
        menuContentRender={this.menuItemRender}
        rightContentRender={this.rightContentRender}>
        {props.children}
      </ProLayout>
    );
  }
};
