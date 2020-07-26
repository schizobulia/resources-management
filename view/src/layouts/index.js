import ProLayout from '@ant-design/pro-layout';
import { Menu } from 'antd';
import { Link } from 'umi';
const { SubMenu } = Menu;

function menuItemRender(item, dom) {
  return (
    <Menu
      defaultSelectedKeys={['sub1']}
      mode="inline"
      theme="dark"
    >
      <Menu.Item key="sub1"><Link to="/">首页</Link></Menu.Item>
      <SubMenu
        key="sub2"
        title={
          <span>
            <span>静态资源</span>
          </span>
        }
      >
        <Menu.Item key="1"><Link to="/video">视频</Link></Menu.Item>
        <Menu.Item key="2"><Link to="/image">图片</Link></Menu.Item>
      </SubMenu>
    </Menu>
  )
}
function BasicLayout(props) {
  if (props.location.pathname === '/users/login') {
    return <div>{props.children}</div>
  }
  return (
    <ProLayout title="508lab" logo="https://lab508.gitee.io/favicon.png" menuContentRender={menuItemRender}>
      {props.children}
    </ProLayout>
  );
}


export default BasicLayout;
