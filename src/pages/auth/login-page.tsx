import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Form, Input, Button, Card, Typography, Alert, message } from "antd";
import { UserOutlined, LockOutlined, LoginOutlined } from "@ant-design/icons";
import { useAuth } from "../../contexts/auth-context";
import { UserRole } from "../../const/enum/user-role";

const { Title, Text } = Typography;

export default function LoginPage() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (values: { username: string; password: string }) => {
        setLoading(true);
        setError(null);
        try {
            const response = await login(values);
            message.success("เข้าสู่ระบบสำเร็จ");
            // Role-based redirect
            if (response) {
                // login() already sets user in context, use the returned user
                const user = response.user;
                if (user.role === UserRole.ADMIN) {
                    navigate("/admin/requests", { replace: true });
                } else {
                    navigate("/request", { replace: true });
                }
            }
        } catch (err: unknown) {
            const msg =
                err instanceof Error ? err.message : "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง";
            setError(msg);
            message.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, #f0f2f5 0%, #e6f4ff 100%)",
                padding: 24,
            }}
        >
            <Card
                style={{
                    width: 420,
                    borderRadius: 16,
                    border: "none",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                }}
                styles={{ body: { padding: "40px 32px" } }}
            >
                <div style={{ textAlign: "center", marginBottom: 32 }}>
                    <div
                        style={{
                            width: 56,
                            height: 56,
                            borderRadius: 14,
                            background: "linear-gradient(135deg, #1677ff 0%, #0958d9 100%)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "0 auto 16px",
                        }}
                    >
                        <LoginOutlined style={{ color: "#fff", fontSize: 28 }} />
                    </div>
                    <Title level={3} style={{ margin: 0 }}>
                        เข้าสู่ระบบ
                    </Title>
                    <Text style={{ color: "#8c8c8c" }}>Library Request Management System</Text>
                </div>

                {error && (
                    <Alert
                        type="error"
                        message={error}
                        showIcon
                        closable
                        onClose={() => setError(null)}
                        style={{ marginBottom: 24, borderRadius: 8 }}
                    />
                )}

                <Form
                    layout="vertical"
                    onFinish={handleSubmit}
                    requiredMark={false}
                    size="large"
                    initialValues={{ username: "", password: "" }}
                >
                    <Form.Item
                        name="username"
                        label="ชื่อผู้ใช้"
                        rules={[{ required: true, message: "กรุณากรอกชื่อผู้ใช้" }]}
                    >
                        <Input
                            prefix={<UserOutlined style={{ color: "#bfbfbf" }} />}
                            placeholder="Username"
                            style={{ borderRadius: 8 }}
                        />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label="รหัสผ่าน"
                        rules={[{ required: true, message: "กรุณากรอกรหัสผ่าน" }]}
                    >
                        <Input.Password
                            prefix={<LockOutlined style={{ color: "#bfbfbf" }} />}
                            placeholder="Password"
                            style={{ borderRadius: 8 }}
                        />
                    </Form.Item>

                    <Form.Item style={{ marginBottom: 16 }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            block
                            style={{
                                height: 44,
                                borderRadius: 8,
                                background: "linear-gradient(135deg, #1677ff 0%, #0958d9 100%)",
                                border: "none",
                                boxShadow: "0 4px 12px rgba(22, 119, 255, 0.3)",
                            }}
                        >
                            เข้าสู่ระบบ
                        </Button>
                    </Form.Item>
                </Form>

                <div style={{ textAlign: "center" }}>
                    <Text style={{ color: "#8c8c8c" }}>
                        ยังไม่มีบัญชี?{" "}
                        <Link to="/register" style={{ color: "#1677ff", fontWeight: 500 }}>
                            สมัครสมาชิก
                        </Link>
                    </Text>
                </div>
            </Card>
        </div>
    );
}
