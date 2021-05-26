import { MenuOutlined, SearchOutlined } from "@ant-design/icons";
import { Form, Button, Dropdown, Input, Menu, Modal, Space, Table } from "antd";
import React from "react";
import Highlighter from "react-highlight-words";
const abc = (data) => {
  return console.log({ data });
};

class UserManagement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      data: [],
      searchText: "",
      searchedColumn: "",
      isModalVisible: false,
      currentRecord: undefined,
    };
    this.formRef = React.createRef();
  }

  componentDidMount() {
    fetch("http://127.0.0.1:8081/users/")
      .then((res) => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            data: result,
          });
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error,
          });
        }
      );
  }
  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  handleReset = (clearFilters) => {
    clearFilters();
    this.setState({ searchText: "" });
  };

  getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            this.handleSearch(selectedKeys, confirm, dataIndex)
          }
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => this.handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              this.setState({
                searchText: selectedKeys[0],
                searchedColumn: dataIndex,
              });
            }}
          >
            Filter
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : "",
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => this.searchInput.select(), 100);
      }
    },
    render: (text) =>
      this.state.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[this.state.searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });
  getColumnSearchProps2 = (dataIndex, key) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            this.searchInput = node;
          }}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            this.handleSearch(selectedKeys, confirm, dataIndex[key])
          }
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() =>
              this.handleSearch(selectedKeys, confirm, dataIndex[key])
            }
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => this.handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              this.setState({
                searchText: selectedKeys[0],
                searchedColumn: dataIndex[key],
              });
            }}
          >
            Filter
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex][key]
        ? record[dataIndex][key]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : abc(record[dataIndex[key]]),
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => this.searchInput.select(), 100);
      }
    },
    render: (record) => {
      const text = (record[key] || "").toString();
      return this.state.searchedColumn === dataIndex[key] ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[this.state.searchText]}
          autoEscape
          textToHighlight={text}
        />
      ) : (
        text
      );
    },
  });
  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  handleReset = (clearFilters) => {
    clearFilters();
    this.setState({ searchText: "" });
  };

  render() {
    const { error, isLoaded, data} = this.state;
    const columns = [
      {
        title: "Tên",
        dataIndex: "fullname",
        key: "fullname",
        ...this.getColumnSearchProps("fullname"),
      },
      {
        title: "Loại người dùng",
        dataIndex: "typeuser",
        key: "typeuser",
        ...this.getColumnSearchProps("typeuser"),
      },
      {
        title: "Địa chỉ",
        dataIndex: "address",
        key: "address",
        ...this.getColumnSearchProps("address"),
      },
      {
        title: "Loại bảo hiểm",
        dataIndex: "insuranceDto",
        key: "nametype",
        ...this.getColumnSearchProps2("insuranceDto", "nametype"),
        // render: (i) => i.nametype,
      },
      // {
      //   key: "actions",
      //   width: 70,
      //   render: (record) => (
      //     <Dropdown
      //       overlay={
      //         <Menu>
      //           <Menu.Item>
      //             <a
      //               onClick={() => {
      //                 this.setState({
      //                   isModalVisible: true,
      //                   currentRecord: record,
      //                 });
      //               }}
      //             >
      //               Edit
      //             </a>
      //           </Menu.Item>
      //         </Menu>
      //       }
      //     >
      //       <MenuOutlined />
      //     </Dropdown>
      //   ),
      // },
    ];

    return (
      <>
        <Table columns={columns} dataSource={data} />
        {/* <Modal
          onCancel={() => this.setState({ isModalVisible: false })}
          visible={this.state.isModalVisible}
          onOk={() => this.formRef.current.submit()}
        >
          <Form
          initialValues={{}}
            ref={this.formRef}
            onFinish={(values) => {
              console.log(values);
            }}
          >
            <Form.Item
              label="Price"
              name="price"
              initialValue={this.state.currentRecord?.insuranceDto.price}
            >
              <Input placeholder="price" />
            </Form.Item>
          </Form>
        </Modal> */}
      </>
    );
  }
}
export default UserManagement;
