import { useState, useEffect } from "react";
import { Drawer, Timeline, Typography, Spin, Empty, Tag } from "antd";
import { ClockCircleOutlined } from "@ant-design/icons";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import { requestHistoryService } from "../../../services/request-history";
import type { StatusHistoryItem } from "../../../services/request-history/types/response";
import { STATUS_REQUEST_LABELS, STATUS_REQUEST_COLORS } from "../../../const/enum/status-request";

const { Text } = Typography;

interface StatusHistoryDrawerProps {
    open: boolean;
    requestId: string | null;
    requestNumber: string;
    onClose: () => void;
}

export default function StatusHistoryDrawer({
    open,
    requestId,
    requestNumber,
    onClose,
}: StatusHistoryDrawerProps) {
    const [history, setHistory] = useState<StatusHistoryItem[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open && requestId) {
            setLoading(true);
            requestHistoryService
                .getRequestHistory(requestId)
                .then(setHistory)
                .catch(() => setHistory([]))
                .finally(() => setLoading(false));
        }
    }, [open, requestId]);

    return (
        <Drawer
            title={`ประวัติการดำเนินการ — ${requestNumber}`}
            open={open}
            onClose={onClose}
            width={480}
        >
            {loading ? (
                <div style={{ textAlign: "center", padding: 40 }}>
                    <Spin size="large" />
                </div>
            ) : history.length === 0 ? (
                <Empty description="ยังไม่มีประวัติการดำเนินการ" />
            ) : (
                <Timeline
                    items={history.map((item) => ({
                        dot: <ClockCircleOutlined style={{ fontSize: 16, color: "#1677ff" }} />,
                        children: (
                            <div>
                                <div style={{ marginBottom: 4 }}>
                                    <Tag color={STATUS_REQUEST_COLORS[item.old_status]}>
                                        {STATUS_REQUEST_LABELS[item.old_status]}
                                    </Tag>
                                    <span style={{ margin: "0 6px", color: "#8c8c8c" }}>→</span>
                                    <Tag color={STATUS_REQUEST_COLORS[item.new_status]}>
                                        {STATUS_REQUEST_LABELS[item.new_status]}
                                    </Tag>
                                </div>
                                {item.remark && (
                                    <div style={{ marginBottom: 4 }}>
                                        <Text style={{ fontSize: 13, color: "#595959" }}>
                                            หมายเหตุ: {item.remark}
                                        </Text>
                                    </div>
                                )}
                                <div>
                                    <Text style={{ fontSize: 12, color: "#8c8c8c" }}>
                                        {format(new Date(item.created_at), "dd MMMM yyyy HH:mm:ss", {
                                            locale: th,
                                        })}
                                    </Text>
                                </div>
                            </div>
                        ),
                    }))}
                />
            )}
        </Drawer>
    );
}
