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
    message,
} from "antd";
import {
    SearchOutlined,
    ReloadOutlined,
    FileSearchOutlined,
    SafetyCertificateOutlined,
    BookOutlined,
    DatabaseOutlined,
    SettingOutlined,
    HistoryOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { format } from "date-fns";
import { useLoadInitialData } from "../request/hooks/use-load-initialdata";
import type { RequestItem } from "../../services/request/types/response";
import { RequestType } from "../../const/enum/request-type";
import { REQUEST_TYPE_LABELS, REQUEST_TYPE_COLORS } from "../../const/enum/request-type-labels";
import { StatusRequest, STATUS_REQUEST_LABELS, STATUS_REQUEST_COLORS } from "../../const/enum/status-request";
import StatusUpdateModal from "./components/status-update-modal";
import StatusHistoryDrawer from "./components/status-history-drawer";

const { Title, Text } = Typography;
const { Search } = Input;

export default function AdminRequestPage() {
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

    // Modal / Drawer state
    const [statusModalOpen, setStatusModalOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState<RequestItem | null>(null);
    const [historyDrawerOpen, setHistoryDrawerOpen] = useState(false);
    const [historyRequestId, setHistoryRequestId] = useState<string | null>(null);
    const [historyRequestNumber, setHistoryRequestNumber] = useState("");

    const stats = {
        total: totalCount,
        pending: data.filter((r) => r.status === StatusRequest.PENDING).length,
        in_progress: data.filter((r) => r.status === StatusRequest.IN_PROGRESS).length,
        resolved: data.filter((r) => r.status === StatusRequest.RESOLVED).length,
        rejected: data.filter((r) => r.status === StatusRequest.REJECTED).length,
    };

    const columns: ColumnsType<RequestItem> = [
        {
            title: "#",
            key: "index",
            width: 50,
            render: (_, __, index) => (
                <Text style={{ color: "#8c8c8c" }}>{(page - 1) * limit + index + 1}</Text>
            ),
        },
        {
            title: "สถานะ",
            dataIndex: "status",
            key: "status",
            width: 120,
            render: (status: StatusRequest) => (
                <Tag color={STATUS_REQUEST_COLORS[status]} style={{ borderRadius: 12, padding: "2px 10px" }}>
                    {STATUS_REQUEST_LABELS[status]}
                </Tag>
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
            width: 170,
            render: (text: string) => <Text style={{ fontSize: 13 }}>{text}</Text>,
        },
        {
            title: "ประเภทบริการ",
            dataIndex: "request_type",
            key: "request_type",
            width: 140,
            render: (type: RequestType) => (
                <Tag color={REQUEST_TYPE_COLORS[type]} style={{ borderRadius: 12, padding: "2px 10px" }}>
                    {REQUEST_TYPE_LABELS[type]}
                </Tag>
            ),
        },
        {
            title: "ผู้ส่งคำขอ",
            dataIndex: "requester_name",
            key: "requester_name",
            width: 150,
            render: (name: string) => <Text style={{ fontSize: 13 }}>{name}</Text>,
        },
        {
            title: "อีเมล",
            dataIndex: "requester_email",
            key: "requester_email",
            width: 200,
            render: (email: string) => (
                <a href={`mailto:${email}`} style={{ color: "#1677ff", fontSize: 13 }}>{email}</a>
            ),
        },
        {
            title: "คำตอบกลับ",
            dataIndex: "admin_response",
            key: "admin_response",
            width: 180,
            ellipsis: { showTitle: false },
            render: (text: string | null) => (
                text ? (
                    <Tooltip placement="topLeft" title={text}>
                        <Text style={{ fontSize: 12, color: "#595959" }}>{text}</Text>
                    </Tooltip>
                ) : (
                    <Text style={{ fontSize: 12, color: "#bfbfbf" }}>-</Text>
                )
            ),
        },
        {
            title: "วันที่สร้าง",
            dataIndex: "created_at",
            key: "created_at",
            width: 130,
            render: (date: string) => (
                <Text style={{ fontSize: 12, color: "#595959" }}>
                    {format(new Date(date), "dd/MM/yyyy HH:mm")}
                </Text>
            ),
            sorter: (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
            defaultSortOrder: "descend",
        },
        {
            title: "จัดการ",
            key: "action",
            width: 200,
            fixed: "right",
            render: (_, record) => (
                <Space>
                    <Button
                        type="primary"
                        size="small"
                        icon={<SettingOutlined />}
                        onClick={() => {
                            setSelectedRequest(record);
                            setStatusModalOpen(true);
                        }}
                        style={{ borderRadius: 6 }}
                    >
                        จัดการสถานะ
                    </Button>
                    <Button
                        size="small"
                        icon={<HistoryOutlined />}
                        onClick={() => {
                            setHistoryRequestId(record.request_id);
                            setHistoryRequestNumber(record.request_number);
                            setHistoryDrawerOpen(true);
                        }}
                        style={{ borderRadius: 6 }}
                    >
                        ประวัติ
                    </Button>
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
                            background: "linear-gradient(135deg, #fa8c16 0%, #d46b08 100%)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                            <SettingOutlined style={{ color: "#fff", fontSize: 20 }} />
                        </div>
                        <div>
                            <Title level={4} style={{ margin: 0, color: "#1a1a2e" }}>
                                จัดการคำขอ (Admin Panel)
                            </Title>
                            <Text style={{ color: "#8c8c8c", fontSize: 13 }}>
                                อัปเดตสถานะและตอบกลับคำขอ
                            </Text>
                        </div>
                    </div>
                </div>
            </div>

            {/* Status Summary Cards */}
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                {[
                    { title: "คำขอทั้งหมด", value: stats.total, color: "#1677ff", bg: "#e6f4ff" },
                    { title: "รอดำเนินการ", value: stats.pending, color: "#8c8c8c", bg: "#fafafa" },
                    { title: "กำลังดำเนินการ", value: stats.in_progress, color: "#1677ff", bg: "#e6f4ff" },
                    { title: "เสร็จสิ้น", value: stats.resolved, color: "#389e0d", bg: "#f6ffed" },
                    { title: "ปฏิเสธ", value: stats.rejected, color: "#ff4d4f", bg: "#fff2f0" },
                ].map((s) => (
                    <Col xs={12} sm={4} md={4} lg={Math.floor(24 / 5)} key={s.title}>
                        <Card
                            style={{
                                borderRadius: 12,
                                border: "none",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                            }}
                            styles={{ body: { padding: "12px 16px" } }}
                        >
                            <div style={{ fontSize: 22, fontWeight: 700, color: s.color, lineHeight: 1.2 }}>
                                {s.value}
                            </div>
                            <div style={{ fontSize: 12, color: "#8c8c8c", marginTop: 2 }}>{s.title}</div>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* Main Table */}
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
                            { value: RequestType.ILL, label: "Interlibrary Loan" },
                            { value: RequestType.ACADEMIC_PUBLICATION_DISSEMINATION, label: "เผยแพร่งานวิชาการ" },
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
                    rowKey="request_id"
                    loading={isLoading}
                    scroll={{ x: 1400 }}
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
                />
            </Card>

            {/* Status Update Modal */}
            <StatusUpdateModal
                open={statusModalOpen}
                request={selectedRequest}
                onClose={() => {
                    setStatusModalOpen(false);
                    setSelectedRequest(null);
                }}
                onSuccess={refetch}
            />

            {/* History Drawer */}
            <StatusHistoryDrawer
                open={historyDrawerOpen}
                requestId={historyRequestId}
                requestNumber={historyRequestNumber}
                onClose={() => {
                    setHistoryDrawerOpen(false);
                    setHistoryRequestId(null);
                    setHistoryRequestNumber("");
                }}
            />
        </div>
    );
}
