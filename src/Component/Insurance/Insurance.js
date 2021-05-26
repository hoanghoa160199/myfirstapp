import { Form, Table, Input, Button, Space, Modal, Dropdown, Menu } from "antd";
import { MenuOutlined, SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import React from "react";

class Insurance extends React.Component {
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
      isLoading: false,
    };
    this.formRef = React.createRef();
  }

  loadData() {
    return fetch("http://127.0.0.1:8081/insurance/")
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

  componentDidMount() {
    this.loadData();
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

  updateInsurance = (values) => {
    console.log(values);
    this.setState({ isLoading: true });
    fetch("http://127.0.0.1:8081/insurance/update", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: this.state.currentRecord.id, ...values }),
    }).finally(() =>
      this.loadData().finally(() =>
        this.setState({ isModalVisible: false, isLoading: false })
      )
    );
  };

  columns = [
    // {
    //   title: "Số",
    //   dataIndex: "id",
    //   key: "id",
    //   ...this.getColumnSearchProps("id"),
    // },
    {
      title: "Tên Bảo Hiểm",
      dataIndex: "nametype",
      key: "nametype",
      ...this.getColumnSearchProps("nametype"),
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      ...this.getColumnSearchProps("price"),
    },
    {
      key: "actions",
      width: 70,
      render: (record) => (
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item>
                <a
                  onClick={() => {
                    if (this.formRef.current) {
                      this.formRef.current.setFieldsValue({
                        price: record.price,
                        nametype: record.nametype,
                      });
                    }
                    this.setState({
                      currentRecord: record,
                      isModalVisible: true,
                    });
                  }}
                >
                  Sửa
                </a>
              </Menu.Item>
              <Menu.Item>
                <a
                  onClick={() => {
                    this.setState({
                      currentRecord: record,
                      isModalVisible: true,
                    });
                  }}
                >
                  Xóa
                </a>
              </Menu.Item>
            </Menu>
          }
        >
          <MenuOutlined />
        </Dropdown>
      ),
    },
  ];

  render() {
    const { error, isLoaded, data } = this.state;

    return (
      <>
        <Modal
          onCancel={() => this.setState({ isModalVisible: false })}
          visible={this.state.isModalVisible}
          onOk={() => this.formRef.current.submit()}
        >
          <Form
            ref={this.formRef}
            onFinish={(values) => this.updateInsurance(values)}
            initialValues={{
              price: this.state.currentRecord?.price,
              nametype: this.state.currentRecord?.nametype,
            }}
          >
            <Form.Item label="Tên bảo hiểm" name="nametype">
              <Input placeholder="Tên bảo hiểm" />
            </Form.Item>
            <Form.Item label="Giá" name="price">
              <Input placeholder="Giá" />
            </Form.Item>
          </Form>
        </Modal>
        <Table columns={this.columns} dataSource={data} />;
      </>
    );
  }
}
export default Insurance;
