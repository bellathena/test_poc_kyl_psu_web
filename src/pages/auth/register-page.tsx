import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Form, Input, Button, Card, Typography, Alert, message } from "antd";
import { UserOutlined, LockOutlined, IdcardOutlined, UserAddOutlined } from "@ant-design/icons";
import { useAuth } from "../../contexts/auth-context";

const { Title, Text } = Typography;

export default function RegisterPage() {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (values: {
        username: string;
        password: string;
        fullname: string;
    }) => {
        setLoading(true);
        setError(null);
        try {
            await register(values);
            message.success("สมัครสมาชิกสำเร็จ กรุณาเข้าสู่ระบบ");
            navigate("/login", { replace: true });
        } catch (err: unknown) {
            const msg =
                err instanceof Error ? err.message : "ไม่สามารถสมัครสมาชิกได้";
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
                            background: "linear-gradient(135deg, #52c41a 0%, #389e0d 100%)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "0 auto 16px",
                        }}
                    >
                        <UserAddOutlined style={{ color: "#fff", fontSize: 28 }} />
                    </div>
                    <Title level={3} style={{ margin: 0 }}>
                        สมัครสมาชิก
                    </Title>
                    <Text style={{ color: "#8c8c8c" }}>สร้างบัญชีผู้ใช้ใหม่</Text>
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
                    initialValues={{ username: "", password: "", fullname: "" }}
                >
                    <Form.Item
                        name="username"
                        label="ชื่อผู้ใช้"
                        rules={[
                            { required: true, message: "กรุณากรอกชื่อผู้ใช้" },
                            { min: 3, message: "ชื่อผู้ใช้ต้องมีอย่างน้อย 3 ตัวอักษร" },
                        ]}
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
                        rules={[
                            { required: true, message: "กรุณากรอกรหัสผ่าน" },
                            { min: 8, message: "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร" },
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined style={{ color: "#bfbfbf" }} />}
                            placeholder="Password"
                            style={{ borderRadius: 8 }}
                        />
                    </Form.Item>

                    <Form.Item
                        name="fullname"
                        label="ชื่อ-นามสกุล"
                        rules={[{ required: true, message: "กรุณากรอกชื่อ-นามสกุล" }]}
                    >
                        <Input
                            prefix={<IdcardOutlined style={{ color: "#bfbfbf" }} />}
                            placeholder="ชื่อเต็ม เช่น สมชาย ใจดี"
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
                                background: "linear-gradient(135deg, #52c41a 0%, #389e0d 100%)",
                                border: "none",
                                boxShadow: "0 4px 12px rgba(82, 196, 26, 0.3)",
                            }}
                        >
                            สมัครสมาชิก
                        </Button>
                    </Form.Item>
                </Form>

                <div style={{ textAlign: "center" }}>
                    <Text style={{ color: "#8c8c8c" }}>
                        มีบัญชีอยู่แล้ว?{" "}
                        <Link to="/login" style={{ color: "#1677ff", fontWeight: 500 }}>
                            เข้าสู่ระบบ
                        </Link>
                    </Text>
                </div>
            </Card>
        </div>
    );
}
