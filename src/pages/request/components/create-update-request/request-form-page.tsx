import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Form,
  Input,
  Select,
  Button,
  Card,
  Typography,
  Breadcrumb,
  Divider,
  Alert,
  Row,
  Col,
  Spin,
  message,
} from "antd";
import {
  ArrowLeftOutlined,
  SaveOutlined,
  PlusCircleOutlined,
  EditOutlined,
  HomeOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { requestService } from "../../../../services/request";
import type { CreateRequest, UpdateRequest } from "../../../../services/request/types/request";
import { RequestType } from "../../../../const/enum/request-type";
import { REQUEST_TYPE_LABELS } from "../../../../const/enum/request-type-labels";
import { useLoadRequestData } from "./hook/use-load-initial-data";

const { Title, Text } = Typography;
const { TextArea } = Input;

const RequestFormPage = () => {
  const navigate = useNavigate();
  const { request_id } = useParams<{ request_id: string }>();
  const mode: "add" | "edit" = request_id ? "edit" : "add";

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const {
    data: currentRequest,
    isLoading: fetchLoading,
    error: fetchError,
  } = useLoadRequestData(mode === "edit" ? request_id : undefined);

  useEffect(() => {
    if (fetchError) {
      message.error("ไม่พบข้อมูลคำขอนี้");
      navigate("/request");
    }
  }, [fetchError, navigate]);

  useEffect(() => {
    if (!fetchLoading && currentRequest) {
      form.setFieldsValue({
        title: currentRequest.title,
        request_type: currentRequest.request_type,
        requester_name: currentRequest.requester_name,
        requester_email: currentRequest.requester_email,
        detail: currentRequest.detail ?? "",
      });
    }
  }, [fetchLoading, currentRequest, form]);

  const handleSubmit = async (values: {
    title: string;
    request_type: RequestType;
    requester_name: string;
    requester_email: string;
    detail: string;
  }) => {
    setLoading(true);
    try {
      if (mode === "add") {
        const data: CreateRequest = values;
        await requestService.createRequest(data);
        message.success("สร้างคำขอใหม่เรียบร้อยแล้ว");
      } else if (request_id) {
        const data: UpdateRequest = { request_id, ...values };
        await requestService.updateRequest(data);
        message.success("บันทึกการเปลี่ยนแปลงเรียบร้อยแล้ว");
      }
      navigate("/request");
    } catch {
      message.error("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    } finally {
      setLoading(false);
    }
  };

  

  const typeOptions = (Object.keys(REQUEST_TYPE_LABELS) as RequestType[]).map((key) => ({
    value: key,
    label: REQUEST_TYPE_LABELS[key],
  }));

  const labelStyle = { fontWeight: 500, color: "#262626" };

  const serviceTypes = [
    {
      key: RequestType.FIND_FULLTEXT_4U,
      color: "#1677ff",
      bg: "#e6f4ff",
      border: "#1677ff22",
      title: "Find Fulltext 4U",
      desc: "ค้นหาและขอรับบทความวิชาการฉบับเต็ม",
    },
    {
      key: RequestType.ITHENTICATE,
      color: "#d46b08",
      bg: "#fff7e6",
      border: "#d46b0822",
      title: "iThenticate",
      desc: "ตรวจสอบความซ้ำซ้อนของงานวิจัยก่อนตีพิมพ์",
    },
    {
      key: RequestType.BOOK_DELIVERY,
      color: "#389e0d",
      bg: "#f6ffed",
      border: "#389e0d22",
      title: "Book Delivery",
      desc: "ขอรับหนังสือจากห้องสมุดหรือสาขาอื่น",
    },
  ];

  return (
    <div style={{ padding: "24px", background: "#f0f2f5", minHeight: "100vh" }}>
      <Breadcrumb
        style={{ marginBottom: 16 }}
        items={[
          {
            key: "home",
            title: (
              <span onClick={() => navigate("/request")} style={{ cursor: "pointer", color: "#1677ff" }}>
                <HomeOutlined /> หน้าแรก
              </span>
            ),
          },
          {
            key: "list",
            title: (
              <span onClick={() => navigate("/request")} style={{ cursor: "pointer", color: "#1677ff" }}>
                <UnorderedListOutlined /> รายการคำขอ
              </span>
            ),
          },
          {
            key: "current",
            title: mode === "add" ? "เพิ่มคำขอใหม่" : "แก้ไขคำขอ",
          },
        ]}
      />

      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/request")}
          style={{ borderRadius: 8, height: 40 }}
        >
          กลับ
        </Button>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 8,
            background: mode === "add"
              ? "linear-gradient(135deg, #52c41a 0%, #389e0d 100%)"
              : "linear-gradient(135deg, #1677ff 0%, #0958d9 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {mode === "add"
              ? <PlusCircleOutlined style={{ color: "#fff", fontSize: 18 }} />
              : <EditOutlined style={{ color: "#fff", fontSize: 18 }} />
            }
          </div>
          <div>
            <Title level={4} style={{ margin: 0 }}>
              {mode === "add" ? "เพิ่มคำขอใหม่" : "แก้ไขคำขอ"}
            </Title>
            <Text style={{ color: "#8c8c8c", fontSize: 13 }}>
              {mode === "add"
                ? "กรอกข้อมูลคำขอบริการห้องสมุด"
                : "แก้ไขข้อมูลคำขอที่มีอยู่"
              }
            </Text>
          </div>
        </div>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Card
            style={{ borderRadius: 12, border: "none", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
          >
            {fetchLoading ? (
              <div style={{ textAlign: "center", padding: 60 }}>
                <Spin size="large" />
              </div>
            ) : (
              <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                requiredMark={false}
                size="large"
              >
                <Form.Item
                  name="title"
                  label={<span style={labelStyle}>หัวข้อคำขอ <span style={{ color: "#ff4d4f" }}>*</span></span>}
                  rules={[
                    { required: true, message: "กรุณากรอกหัวข้อคำขอ" },
                    { min: 5, message: "หัวข้อต้องมีอย่างน้อย 5 ตัวอักษร" },
                  ]}
                >
                  <Input
                    placeholder="ระบุหัวข้อหรือชื่อบทความ/หนังสือที่ต้องการ"
                    style={{ borderRadius: 8 }}
                  />
                </Form.Item>

                <Row gutter={16}>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="request_type"
                      label={<span style={labelStyle}>ประเภทบริการ <span style={{ color: "#ff4d4f" }}>*</span></span>}
                      rules={[{ required: true, message: "กรุณาเลือกประเภทบริการ" }]}
                    >
                      <Select
                        placeholder="เลือกประเภทบริการ"
                        style={{ borderRadius: 8 }}
                        options={typeOptions}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="requester_name"
                      label={<span style={labelStyle}>ชื่อผู้ส่งคำขอ <span style={{ color: "#ff4d4f" }}>*</span></span>}
                      rules={[{ required: true, message: "กรุณากรอกชื่อผู้ส่งคำขอ" }]}
                    >
                      <Input
                        placeholder="ชื่อ-นามสกุล"
                        style={{ borderRadius: 8 }}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  name="requester_email"
                  label={<span style={labelStyle}>อีเมล <span style={{ color: "#ff4d4f" }}>*</span></span>}
                  rules={[
                    { required: true, message: "กรุณากรอกอีเมล" },
                    { type: "email", message: "รูปแบบอีเมลไม่ถูกต้อง (ต้องมี @ และ โดเมน)" },
                  ]}
                >
                  <Input
                    placeholder="example@university.ac.th"
                    style={{ borderRadius: 8 }}
                  />
                </Form.Item>

                <Form.Item
                  name="detail"
                  label={<span style={labelStyle}>รายละเอียด <span style={{ color: "#ff4d4f" }}>*</span></span>}
                  rules={[
                    { required: true, message: "กรุณากรอกรายละเอียด" },
                    { min: 10, message: "รายละเอียดต้องมีอย่างน้อย 10 ตัวอักษร" },
                  ]}
                >
                  <TextArea
                    placeholder="อธิบายรายละเอียดคำขอ วัตถุประสงค์ หรือข้อมูลเพิ่มเติม..."
                    rows={5}
                    style={{ borderRadius: 8, resize: "vertical" }}
                    showCount
                    maxLength={1000}
                  />
                </Form.Item>

                <Divider style={{ margin: "8px 0 20px" }} />

                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 12,
                }}>
                  <div></div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <Button
                      size="large"
                      onClick={() => navigate("/request")}
                      style={{ borderRadius: 8, minWidth: 100 }}
                    >
                      ยกเลิก
                    </Button>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={loading}
                      icon={<SaveOutlined />}
                      size="large"
                      style={{
                        borderRadius: 8,
                        minWidth: 180,
                        background: mode === "add"
                          ? "linear-gradient(135deg, #52c41a 0%, #389e0d 100%)"
                          : "linear-gradient(135deg, #1677ff 0%, #0958d9 100%)",
                        border: "none",
                        boxShadow: mode === "add"
                          ? "0 4px 12px rgba(82, 196, 26, 0.3)"
                          : "0 4px 12px rgba(22, 119, 255, 0.3)",
                      }}
                    >
                      {mode === "add" ? "บันทึกคำขอ" : "บันทึกการเปลี่ยนแปลง"}
                    </Button>
                  </div>
                </div>
              </Form>
            )}
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card
            style={{ borderRadius: 12, border: "none", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", marginBottom: 16 }}
            title={<Text strong>ประเภทบริการที่รองรับ</Text>}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {serviceTypes.map((item) => (
                <div
                  key={item.key}
                  style={{
                    display: "flex", gap: 10, padding: "10px 12px",
                    background: item.bg, borderRadius: 8,
                    border: `1px solid ${item.border}`,
                  }}
                >
                  <div style={{
                    width: 8, borderRadius: 4, flexShrink: 0,
                    background: item.color, alignSelf: "stretch",
                  }} />
                  <div>
                    <Text strong style={{ color: item.color, fontSize: 13 }}>{item.title}</Text>
                    <br />
                    <Text style={{ fontSize: 12, color: "#595959" }}>{item.desc}</Text>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {mode === "edit" && currentRequest && (
            <Card
              style={{ borderRadius: 12, border: "none", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
              title={<Text strong>ข้อมูลระบบ</Text>}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div>
                  <Text style={{ fontSize: 12, color: "#8c8c8c" }}>รหัสคำขอ</Text>
                  <br />
                  <Text style={{ fontFamily: "monospace", fontSize: 13 }}>#{currentRequest.request_number}</Text>
                </div>
                <div>
                  <Text style={{ fontSize: 12, color: "#8c8c8c" }}>วันที่สร้าง</Text>
                  <br />
                  <Text style={{ fontSize: 13 }}>
                    {new Date(currentRequest.created_at).toLocaleString("th-TH")}
                  </Text>
                </div>
              </div>
            </Card>
          )}

          {mode === "add" && (
            <Alert
              type="info"
              showIcon
              title="คำแนะนำ"
              description="กรอกข้อมูลให้ครบถ้วนในช่องที่มีเครื่องหมาย * เพื่อให้เจ้าหน้าที่ดำเนินการได้รวดเร็ว"
              style={{ borderRadius: 12 }}
            />
          )}
        </Col>
      </Row>
    </div>
  );
};

export default RequestFormPage;
