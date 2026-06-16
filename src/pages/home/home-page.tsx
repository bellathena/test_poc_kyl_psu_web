import { useNavigate } from "react-router-dom";
import { Card, Row, Col, Typography, Button, Space } from "antd";
import {
    UnorderedListOutlined,
    SettingOutlined,
    PlusOutlined,
    LoginOutlined,
    UserAddOutlined,
    DatabaseOutlined,
} from "@ant-design/icons";
import { useAuth } from "../../contexts/auth-context";

const { Title, Text, Paragraph } = Typography;

export default function Homepage() {
    const navigate = useNavigate();
    const { isAuthenticated, isAdmin } = useAuth();

    return (
        <div style={{ padding: "24px", background: "#f0f2f5", minHeight: "100vh" }}>
            <div style={{
                textAlign: "center",
                padding: "48px 24px 32px",
            }}>
                <div style={{
                    width: 72,
                    height: 72,
                    borderRadius: 18,
                    background: "linear-gradient(135deg, #1677ff 0%, #0958d9 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 20px",
                }}>
                    <DatabaseOutlined style={{ color: "#fff", fontSize: 36 }} />
                </div>
                <Title level={2} style={{ margin: 0 }}>
                    ระบบจัดการคำขอบริการห้องสมุด
                </Title>
                <Paragraph style={{ color: "#8c8c8c", fontSize: 16, marginTop: 8 }}>
                    Library Request Management System — PSU
                </Paragraph>
            </div>

            <Row gutter={[24, 24]} justify="center" style={{ maxWidth: 800, margin: "0 auto" }}>
                {isAuthenticated ? (
                    <>
                        <Col xs={24} sm={12}>
                            <Card
                                hoverable
                                style={{
                                    borderRadius: 12,
                                    border: "none",
                                    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                                }}
                                onClick={() => navigate("/request")}
                            >
                                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                                    <div style={{
                                        width: 48, height: 48, borderRadius: 12,
                                        background: "linear-gradient(135deg, #1677ff 0%, #0958d9 100%)",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                    }}>
                                        <UnorderedListOutlined style={{ color: "#fff", fontSize: 24 }} />
                                    </div>
                                    <div>
                                        <Title level={4} style={{ margin: 0 }}>รายการคำขอ</Title>
                                        <Text style={{ color: "#8c8c8c" }}>ดูและจัดการคำขอบริการ</Text>
                                    </div>
                                </div>
                            </Card>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Card
                                hoverable
                                style={{
                                    borderRadius: 12,
                                    border: "none",
                                    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                                }}
                                onClick={() => navigate("/request/add")}
                            >
                                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                                    <div style={{
                                        width: 48, height: 48, borderRadius: 12,
                                        background: "linear-gradient(135deg, #52c41a 0%, #389e0d 100%)",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                    }}>
                                        <PlusOutlined style={{ color: "#fff", fontSize: 24 }} />
                                    </div>
                                    <div>
                                        <Title level={4} style={{ margin: 0 }}>สร้างคำขอใหม่</Title>
                                        <Text style={{ color: "#8c8c8c" }}>ส่งคำขอบริการห้องสมุด</Text>
                                    </div>
                                </div>
                            </Card>
                        </Col>
                        {isAdmin && (
                            <Col xs={24} sm={12}>
                                <Card
                                    hoverable
                                    style={{
                                        borderRadius: 12,
                                        border: "none",
                                        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                                    }}
                                    onClick={() => navigate("/admin/requests")}
                                >
                                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                                        <div style={{
                                            width: 48, height: 48, borderRadius: 12,
                                            background: "linear-gradient(135deg, #fa8c16 0%, #d46b08 100%)",
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                        }}>
                                            <SettingOutlined style={{ color: "#fff", fontSize: 24 }} />
                                        </div>
                                        <div>
                                            <Title level={4} style={{ margin: 0 }}>จัดการคำขอ (Admin)</Title>
                                            <Text style={{ color: "#8c8c8c" }}>อัปเดตสถานะและตอบกลับ</Text>
                                        </div>
                                    </div>
                                </Card>
                            </Col>
                        )}
                    </>
                ) : (
                    <Col xs={24} sm={16}>
                        <Card
                            style={{
                                borderRadius: 12,
                                border: "none",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                            }}
                        >
                            <div style={{ textAlign: "center", padding: "16px 0" }}>
                                <Text style={{ color: "#595959", fontSize: 15 }}>
                                    กรุณาเข้าสู่ระบบเพื่อใช้งานระบบจัดการคำขอ
                                </Text>
                                <Space style={{ marginTop: 16, display: "flex", justifyContent: "center" }}>
                                    <Button
                                        type="primary"
                                        size="large"
                                        icon={<LoginOutlined />}
                                        onClick={() => navigate("/login")}
                                        style={{
                                            borderRadius: 8,
                                            height: 44,
                                            paddingInline: 24,
                                        }}
                                    >
                                        เข้าสู่ระบบ
                                    </Button>
                                    <Button
                                        size="large"
                                        icon={<UserAddOutlined />}
                                        onClick={() => navigate("/register")}
                                        style={{ borderRadius: 8, height: 44, paddingInline: 24 }}
                                    >
                                        สมัครสมาชิก
                                    </Button>
                                </Space>
                            </div>
                        </Card>
                    </Col>
                )}
            </Row>
        </div>
    );
}
