import {
  Card,
  Col,
  DatePicker,
  Row,
  Statistic,
  Tooltip,
  Typography,
} from "antd";
import moment from "moment";
import QueueAnim from "rc-queue-anim";
import React, { useEffect, useState } from "react";

const { RangePicker } = DatePicker;
const dateFormat = "Y-MM-DD";
const { Text, Paragraph } = Typography;

export default function ReportPage(): JSX.Element {
  const [isLoading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([] as any[]);

  async function getReport([startDate, endDate]: any) {
    setLoading(true);
    try {
      const response = await fetch(
        `http://127.0.0.1:8081/deals/get?startDate=${startDate.format(
          dateFormat
        )}&endDate=${endDate.format(dateFormat)}`
      );
      const data = await response.json();
      setSearchResults(data);
    } finally {
      setLoading(false);
    }
  }

  const animationConfigs = { delay: 250, duration: 500 };

  useEffect(() => {
    return () => {
      setLoading(false);
      setSearchResults([]);
    };
  }, []);

  return (
    <QueueAnim {...animationConfigs} style={{ overflow: "initial" }}>
      <p key="title">Chọn khoảng thời gian muốn xem báo cáo</p>
      <RangePicker
        key="range-picker"
        style={{ width: 300 }}
        disabled={isLoading}
        onChange={(range: any) => range && getReport(range)}
      />
      <QueueAnim
        component={Row}
        componentProps={{ gutter: 16 }}
        key="statistic"
        {...animationConfigs}
      >
        <Col key="statistic-count" span={8}>
          <Statistic
            title="Giao dịch tìm thấy"
            value={searchResults.length}
            precision={0}
            suffix="giao dịch"
          />
        </Col>
        <Col key="statistic-price" span={8}>
          <Statistic
            title="Tổng tiền"
            value={searchResults
              .map((r) => r.insuranceDto.price)
              .reduce((a, b) => a + b, 0)}
            precision={0}
            suffix="VNĐ"
            valueStyle={{ color: "green" }}
          />
        </Col>
      </QueueAnim>
      <QueueAnim
        key="results"
        component={Row}
        componentProps={{ gutter: { xs: 8, sm: 8, md: 8, lg: 8 } }}
        {...animationConfigs}
      >
        {searchResults.map((result: any, index: number) => (
          <Col key={`result-${index}`} span={6} style={{ marginBottom: 4 }}>
            <Card key={`result-comment-${index}`} size="small">
              <Card.Meta
                title={`Tên: ${result.userDto.fullname}`}
                description={
                  <>
                    <Statistic
                      value={result.insuranceDto.price}
                      precision={0}
                      suffix="VNĐ"
                      valueStyle={{ fontSize: 16, color: "green" }}
                    />
                    <Paragraph>
                      <Text strong>Loại bảo hiểm:</Text>{" "}
                      {result.insuranceDto.nametype}
                      <br />
                      <Text strong>Ngày hoàn thành:</Text>{" "}
                      <Tooltip title={moment(result.timeComplete).fromNow()}>
                        {moment(result.timeComplete)
                          .local()
                          .format("YYYY-MM-DD")}
                      </Tooltip>
                    </Paragraph>
                  </>
                }
              />
            </Card>
          </Col>
        ))}
      </QueueAnim>
    </QueueAnim>
  );
}
