import { SearchOutlined } from "@ant-design/icons";
import { Button, Input, Space, Table } from "antd";
import React from "react";
import Highlighter from "react-highlight-words";

class DealManagement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      data: [],
      searchText: "",
      searchedColumn: "",
      isLoading: true,
    };
  }
  componentDidMount() {
    fetch("http://127.0.0.1:8081/deals/")
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
      )
      .finally(() => this.setState({ isLoading: false }));
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
          {/* <Button
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
          </Button> */}
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
        : "",
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
    const { error, isLoaded, data } = this.state;
    const columns = [
      {
        title: "Tên người dùng",
        dataIndex: "userDto",
        key: "fullname",
        ...this.getColumnSearchProps2("userDto","fullname"),
        // render: u => u.fullname,
      },
      {
        title: "  Loại người dùng",
        dataIndex: "userDto",
        key: "typeuser",
        ...this.getColumnSearchProps2("userDto","typeuser"),
        // render: u => u.typeuser,
      },
      {
        title: "Địa chỉ người dùng",
        dataIndex: "userDto",
        key: "address",
        ...this.getColumnSearchProps2("userDto","address"),
        // render: u => u.address,
      },
      {
        title: "Loại bảo hiểm",
        dataIndex: "insuranceDto",
        key: "nametype",
        ...this.getColumnSearchProps2("insuranceDto", "nametype"),
        // render: i => i.nametype,
      },
      {
        title: "Giá bảo hiểm",
        dataIndex: "insuranceDto",
        key: "price",
        ...this.getColumnSearchProps2("insuranceDto","price"),
        // render: i => i.price,
      },
      {
        title: "Tổng tiền giao dịch",
        dataIndex: "totalBill",
        key: "totalBill",
        ...this.getColumnSearchProps("totalBill"),
      },
    ];
    return (
      <Table
        disabled={this.state.isLoading}
        columns={columns}
        dataSource={data}
        rowKey={(_, index) => index}
      />
    );
  }
}

export default DealManagement;
//  Dealmanagement
// {title: 'ID', key: 'id', dataIndex: 'id'},
// {title: 'Total', key: 'totalBill', dataIndex: 'totalBill'},
// {title: 'Status', key: 'status', dataIndex: 'status'},
// {title: 'Nametype', key: 'nametype', dataIndex: 'insuranceDto', render: i => i.nametype},
// {title: 'Price', key: 'price', dataIndex: 'insuranceDto', render: i => i.price},
// {title: 'Fullname', key: 'fullname', dataIndex: 'userDto', render: u => u.fullname},
// {title: 'Type', key: 'typeuser', dataIndex: 'userDto', render: u => u.typeuser},
// {title: 'Address', key: 'address', dataIndex: 'userDto', render: u => u.address},
