import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  Button,
  Tag,
  Space,
  Typography,
  Card,
  Tooltip,
  Input,
  Select,
  Row,
  Col,
  Popconfirm,
  message,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  ReloadOutlined,
  FileSearchOutlined,
  SafetyCertificateOutlined,
  BookOutlined,
  DatabaseOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { format } from "date-fns";
import { useLoadInitialData } from "./hooks/use-load-initialdata";
import type { RequestItem } from "../../services/request/types/response";
import { requestService } from "../../services/request";
import { RequestType } from "../../const/enum/request-type";
import { REQUEST_TYPE_LABELS, REQUEST_TYPE_COLORS } from "../../const/enum/request-type-labels";

const { Title, Text } = Typography;
const { Search } = Input;

const Requestpage = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [filterType, setFilterType] = useState<RequestType | undefined>(undefined);

  const { data, totalCount, isLoading, refetch } = useLoadInitialData({
    page,
    limit,
    search: searchText,
    request_type: filterType,
  });

  const stats = {
    total: totalCount,
    find_fulltext: data.filter((r) => r.request_type === RequestType.FIND_FULLTEXT_4U).length,
    ithenticate: data.filter((r) => r.request_type === RequestType.ITHENTICATE).length,
    book_delivery: data.filter((r) => r.request_type === RequestType.BOOK_DELIVERY).length,
  };

  const columns: ColumnsType<RequestItem> = [
    {
      title: "#",
      key: "index",
      width: 60,
      render: (_, __, index) => (
        <Text style={{ color: "#8c8c8c" }}>{(page - 1) * limit + index + 1}</Text>
      ),
    },
    {
      title: "หัวข้อคำขอ",
      dataIndex: "title",
      key: "title",
      ellipsis: { showTitle: false },
      render: (text: string) => (
        <Tooltip placement="topLeft" title={text}>
          <Text strong style={{ fontSize: 13 }}>{text}</Text>
        </Tooltip>
      ),
    },
    {
      title: "หมายเลขคำขอ",
      dataIndex: "request_number",
      key: "request_number",
      width: 160,
      render: (text: string) => <Text style={{ fontSize: 13 }}>{text}</Text>,
    },
    {
      title: "ประเภทบริการ",
      dataIndex: "request_type",
      key: "request_type",
      width: 160,
      render: (type: RequestType) => (
        <Tag color={REQUEST_TYPE_COLORS[type]} style={{ borderRadius: 12, padding: "2px 10px" }}>
          {REQUEST_TYPE_LABELS[type]}
        </Tag>
      ),
    },
    {
      title: "ชื่อผู้ส่งคำขอ",
      dataIndex: "requester_name",
      key: "requester_name",
      width: 180,
      render: (name: string) => <Text style={{ fontSize: 13 }}>{name}</Text>,
    },
    {
      title: "อีเมล",
      dataIndex: "requester_email",
      key: "requester_email",
      width: 220,
      render: (email: string) => (
        <a href={`mailto:${email}`} style={{ color: "#1677ff", fontSize: 13 }}>{email}</a>
      ),
    },
    {
      title: "วันที่สร้าง",
      dataIndex: "created_at",
      key: "created_at",
      width: 140,
      render: (date: string) => (
        <Text style={{ fontSize: 13, color: "#595959" }}>
          {format(new Date(date), "dd/MM/yyyy HH:mm")}
        </Text>
      ),
      sorter: (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
      defaultSortOrder: "descend",
    },
    {
      title: "จัดการ",
      key: "action",
      width: 140,
      fixed: "right",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => navigate(`/request/${record.request_id}/edit`)}
            style={{ borderRadius: 6 }}
          >
            แก้ไข
          </Button>
          <Popconfirm
            title="ยืนยันการลบ"
            description="คุณแน่ใจหรือไม่ว่าต้องการลบคำขอนี้?"
            onConfirm={() => handleDelete(record.request_id)}
            okText="ลบ"
            cancelText="ยกเลิก"
            okButtonProps={{ danger: true }}
          >
            <Button
              danger
              size="small"
              icon={<DeleteOutlined />}
              style={{ borderRadius: 6 }}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleFilterChange = (value: string) => {
    setFilterType(value === "all" ? undefined : (value as RequestType));
    setPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
    setPage(1);
  };

  const handleDelete = async (request_id: string) => {
    try {
      await requestService.deleteRequest({ request_id });
      message.success("ลบคำขอเรียบร้อยแล้ว");
      refetch();
    } catch {
      message.error("ไม่สามารถลบคำขอได้");
    }
  };

  return (
    <div style={{ padding: "24px", background: "#f0f2f5", minHeight: "100vh" }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap", gap: 16,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: "linear-gradient(135deg, #1677ff 0%, #0958d9 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <DatabaseOutlined style={{ color: "#fff", fontSize: 20 }} />
            </div>
            <div>
              <Title level={4} style={{ margin: 0, color: "#1a1a2e" }}>ระบบจัดการคำขอบริการ</Title>
              <Text style={{ color: "#8c8c8c", fontSize: 13 }}>Library Request Management System</Text>
            </div>
          </div>
          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={() => navigate("/request/add")}
            style={{
              borderRadius: 8,
              background: "linear-gradient(135deg, #1677ff 0%, #0958d9 100%)",
              border: "none",
              height: 44,
              paddingInline: 24,
              boxShadow: "0 4px 12px rgba(22, 119, 255, 0.3)",
            }}
          >
            สร้างคำขอใหม่
          </Button>
        </div>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {[
          { title: "คำขอทั้งหมด", value: stats.total, color: "#1677ff", bg: "#e6f4ff", icon: <DatabaseOutlined style={{ fontSize: 20, color: "#1677ff" }} /> },
          { title: "Find Fulltext 4U", value: stats.find_fulltext, color: "#0958d9", bg: "#dbeafe", icon: <FileSearchOutlined style={{ fontSize: 20, color: "#0958d9" }} /> },
          { title: "iThenticate", value: stats.ithenticate, color: "#d46b08", bg: "#fff7e6", icon: <SafetyCertificateOutlined style={{ fontSize: 20, color: "#d46b08" }} /> },
          { title: "Book Delivery", value: stats.book_delivery, color: "#389e0d", bg: "#f6ffed", icon: <BookOutlined style={{ fontSize: 20, color: "#389e0d" }} /> },
        ].map((s) => (
          <Col xs={12} sm={6} key={s.title}>
            <Card
              style={{ borderRadius: 12, border: "none", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
              styles={{ body: { padding: "16px 20px" } }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 10,
                  background: s.bg, display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {s.icon}
                </div>
                <div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: s.color, lineHeight: 1.2 }}>{s.value}</div>
                  <div style={{ fontSize: 12, color: "#8c8c8c", marginTop: 2 }}>{s.title}</div>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Card
        style={{ borderRadius: 12, border: "none", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
        styles={{ body: { padding: 0 } }}
      >
        <div style={{
          padding: "16px 24px", borderBottom: "1px solid #f0f0f0",
          display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center",
        }}>
          <Search
            placeholder="ค้นหาหัวข้อ, ชื่อ, อีเมล..."
            allowClear
            style={{ width: 280 }}
            prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
            onChange={handleSearchChange}
          />
          <Select
            value={filterType ?? "all"}
            onChange={handleFilterChange}
            style={{ width: 180 }}
            options={[
              { value: "all", label: "ทุกประเภทบริการ" },
              { value: RequestType.FIND_FULLTEXT_4U, label: "Find Fulltext 4U" },
              { value: RequestType.ITHENTICATE, label: "iThenticate" },
              { value: RequestType.BOOK_DELIVERY, label: "Book Delivery" },
            ]}
          />
          <Button icon={<ReloadOutlined />} onClick={refetch} style={{ borderRadius: 6 }}>
            รีเฟรช
          </Button>
          <div style={{ marginLeft: "auto" }}>
            <Text style={{ color: "#8c8c8c", fontSize: 13 }}>
              แสดง {data.length} จาก {totalCount} รายการ
            </Text>
          </div>
        </div>

        <Table
          columns={columns}
          dataSource={data}
          rowKey="request_number"
          loading={isLoading}
          scroll={{ x: 900 }}
          pagination={{
            current: page,
            pageSize: limit,
            total: totalCount,
            showSizeChanger: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} จาก ${total} รายการ`,
            onChange: (p, ps) => {
              setPage(p);
              setLimit(ps);
            },
            style: { padding: "16px 24px", margin: 0 },
          }}
          style={{ borderRadius: 0 }}
          rowClassName={() => "table-row-hover"}
          onChange={(_pagination, _filters, sorter) => {
            if (!Array.isArray(sorter) && sorter.order === "descend") {
              // Server-side sorting would go here
            }
          }}
        />
      </Card>
    </div>
  );
};

export default Requestpage;
