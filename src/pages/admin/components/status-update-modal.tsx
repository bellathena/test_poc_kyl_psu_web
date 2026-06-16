import { useState, useEffect } from "react";
import { Modal, Form, Select, Input, message } from "antd";
import { requestService } from "../../../services/request";
import { StatusRequest, STATUS_REQUEST_LABELS } from "../../../const/enum/status-request";
import type { RequestItem } from "../../../services/request/types/response";

const { TextArea } = Input;

interface StatusUpdateModalProps {
    open: boolean;
    request: RequestItem | null;
    onClose: () => void;
    onSuccess: () => void;
}

export default function StatusUpdateModal({
    open,
    request,
    onClose,
    onSuccess,
}: StatusUpdateModalProps) {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open && request) {
            form.setFieldsValue({
                new_status: request.status,
                admin_response: request.admin_response ?? "",
            });
        }
    }, [open, request, form]);

    const handleSubmit = async (values: {
        new_status: StatusRequest;
        admin_response?: string;
    }) => {
        if (!request) return;
        setLoading(true);
        try {
            await requestService.adminUpdateStatus({
                request_id: request.request_id,
                new_status: values.new_status,
                admin_response: values.admin_response || undefined,
            });
            message.success("อัปเดตสถานะเรียบร้อยแล้ว");
            onSuccess();
            onClose();
        } catch {
            message.error("ไม่สามารถอัปเดตสถานะได้");
        } finally {
            setLoading(false);
        }
    };

    // Determine allowed next statuses based on current status
    const getAllowedStatuses = (current: StatusRequest): StatusRequest[] => {
        switch (current) {
            case StatusRequest.PENDING:
                return [StatusRequest.IN_PROGRESS, StatusRequest.REJECTED];
            case StatusRequest.IN_PROGRESS:
                return [StatusRequest.RESOLVED, StatusRequest.REJECTED];
            case StatusRequest.RESOLVED:
                return [StatusRequest.RESOLVED];
            case StatusRequest.REJECTED:
                return [StatusRequest.PENDING, StatusRequest.IN_PROGRESS];
            default:
                return Object.values(StatusRequest);
        }
    };

    const allowedStatuses = request ? getAllowedStatuses(request.status) : [];

    return (
        <Modal
            title="จัดการสถานะคำขอ"
            open={open}
            onCancel={onClose}
            onOk={() => form.submit()}
            confirmLoading={loading}
            okText="บันทึก"
            cancelText="ยกเลิก"
            destroyOnClose
            styles={{ body: { padding: "24px" } }}
        >
            {request && (
                <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 13, color: "#8c8c8c" }}>
                        หมายเลขคำขอ: <strong>{request.request_number}</strong>
                    </div>
                    <div style={{ fontSize: 13, color: "#8c8c8c", marginTop: 4 }}>
                        หัวข้อ: <strong>{request.title}</strong>
                    </div>
                    <div style={{ fontSize: 13, color: "#8c8c8c", marginTop: 4 }}>
                        สถานะปัจจุบัน:{" "}
                        <strong>{STATUS_REQUEST_LABELS[request.status]}</strong>
                    </div>
                </div>
            )}

            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                requiredMark={false}
                size="large"
            >
                <Form.Item
                    name="new_status"
                    label="สถานะใหม่"
                    rules={[{ required: true, message: "กรุณาเลือกสถานะ" }]}
                >
                    <Select
                        placeholder="เลือกสถานะ"
                        style={{ borderRadius: 8 }}
                        options={allowedStatuses.map((s) => ({
                            value: s,
                            label: STATUS_REQUEST_LABELS[s],
                        }))}
                    />
                </Form.Item>

                <Form.Item name="admin_response" label="คำตอบกลับ (ไม่บังคับ)">
                    <TextArea
                        placeholder="ระบุคำตอบกลับหรือหมายเหตุถึงผู้ใช้..."
                        rows={4}
                        style={{ borderRadius: 8, resize: "vertical" }}
                        showCount
                        maxLength={500}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
}
