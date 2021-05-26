// import { ClockCircleTwoTone, SmileTwoTone } from "@ant-design/icons";
import { Layout, Tabs } from "antd";
import React from "react";
import DealManagement from "../../Component/Dealmanagement/Dealmanagementpage";
import Insurance from "../../Component/Insurance/Insurance";
import Usermanagement from "../../Component/Usermanagement/Usermanagementpage";
import Report from "../../Component/report/report";

const { TabPane } = Tabs;

const { Header, Content, Footer, Sider } = Layout;

class FlavorForm extends React.Component {
  constructor() {
    super();
    this.state = {
      collapsed: false,
      selectedKey: "1",
    };
  }

  onCollapse = (collapsed) => {
    this.setState({ collapsed });
  };

  handleClick = (key) => {
    this.setState({ selectedKey: key });
  };

  renderContent = () => {
    switch (this.state.selectedKey) {
      case "1":
        return <DealManagement />;
      case "2":
        return <Usermanagement />;
      case "3":
        return <Insurance />;
      case "4":
        return <Report />;
      default:
        return "Nope";
    }
  };

  render() {
    const { collapsed } = this.state;
    return (
      <Layout>
        <Sider
          style={{
            overflow: "auto",
            height: "100vh",
            position: "fixed",
            left: 0,
            zIndex: 1,
          }}
        >
          <Tabs
            defaultActiveKey="1"
            tabPosition="left"
            type="line"
            onChange={(key) => this.handleClick(key)}
          >
            <TabPane tab="Giao dịch" key="1" />
            <TabPane tab="Người dùng" key="2" />
            <TabPane tab="Bảo hiểm" key="3" />
            <TabPane tab="Báo cáo" key="4" />
          </Tabs>
        </Sider>
        <Layout style={{ marginLeft: 200 }}>
          <Header
            className="site-layout-background"
            style={{ position: "fixed", width: "100%", zIndex: 1 }}
          >
            <h1 className="headerbaohiem">BẢO HIỂM Y TẾ</h1>
          </Header>
          <Content style={{ margin: "24px 16px 0", overflow: "initial" }}>
            <div style={{ paddingTop: 50 }}>{this.renderContent()}</div>
          </Content>
        </Layout>
      </Layout>
    );
  }
}
export default FlavorForm;
