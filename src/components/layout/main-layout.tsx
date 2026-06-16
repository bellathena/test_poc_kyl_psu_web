import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Layout, Menu, Button, Typography, Dropdown, Space } from "antd";
import {
    DatabaseOutlined,
    LoginOutlined,
    LogoutOutlined,
    UserOutlined,
    UnorderedListOutlined,
    SettingOutlined,
    HomeOutlined,
    UserAddOutlined,
} from "@ant-design/icons";
import { useAuth } from "../../contexts/auth-context";
import { UserRole } from "../../const/enum/user-role";

const { Header, Content } = Layout;
const { Text } = Typography;

export default function MainLayout() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, isAuthenticated, isAdmin, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const menuItems = [
        {
            key: "/",
            icon: <HomeOutlined />,
            label: "หน้าแรก",
        },
        {
            key: "/request",
            icon: <UnorderedListOutlined />,
            label: "รายการคำขอ",
        },
        ...(isAdmin
            ? [
                  {
                      key: "/admin/requests",
                      icon: <SettingOutlined />,
                      label: "จัดการคำขอ (Admin)",
                  },
              ]
            : []),
    ];

    const userMenuItems = [
        {
            key: "logout",
            icon: <LogoutOutlined />,
            label: "ออกจากระบบ",
            onClick: handleLogout,
        },
    ];

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Header
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    background: "linear-gradient(135deg, #1677ff 0%, #0958d9 100%)",
                    padding: "0 24px",
                    height: 56,
                    position: "sticky",
                    top: 0,
                    zIndex: 100,
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
                    <div
                        style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}
                        onClick={() => navigate("/")}
                    >
                        <DatabaseOutlined style={{ color: "#fff", fontSize: 22 }} />
                        <Text strong style={{ color: "#fff", fontSize: 16 }}>
                            Library Request
                        </Text>
                    </div>
                    {isAuthenticated && (
                        <Menu
                            theme="dark"
                            mode="horizontal"
                            selectedKeys={[location.pathname]}
                            items={menuItems}
                            onClick={({ key }) => navigate(key)}
                            style={{
                                background: "transparent",
                                borderBottom: "none",
                                minWidth: 400,
                            }}
                        />
                    )}
                </div>

                <div>
                    {isAuthenticated ? (
                        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
                            <Button
                                type="text"
                                icon={<UserOutlined />}
                                style={{ color: "#fff" }}
                            >
                                <Space>
                                    <span style={{ color: "#fff" }}>
                                        {user?.first_name} {user?.last_name || user?.username}
                                    </span>
                                    <span
                                        style={{
                                            background: isAdmin ? "#fff" : "rgba(255,255,255,0.2)",
                                            color: isAdmin ? "#1677ff" : "#fff",
                                            padding: "2px 8px",
                                            borderRadius: 10,
                                            fontSize: 11,
                                            fontWeight: 600,
                                        }}
                                    >
                                        {isAdmin ? "ADMIN" : "USER"}
                                    </span>
                                </Space>
                            </Button>
                        </Dropdown>
                    ) : (
                        <Space>
                            <Button
                                type="text"
                                icon={<LoginOutlined />}
                                onClick={() => navigate("/login")}
                                style={{ color: "#fff" }}
                            >
                                เข้าสู่ระบบ
                            </Button>
                            <Button
                                ghost
                                icon={<UserAddOutlined />}
                                onClick={() => navigate("/register")}
                            >
                                สมัครสมาชิก
                            </Button>
                        </Space>
                    )}
                </div>
            </Header>

            <Content>
                <Outlet />
            </Content>
        </Layout>
    );
}
