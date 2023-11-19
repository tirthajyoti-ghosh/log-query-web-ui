// @ts-nocheck
import {
    Button,
    Col,
    DatePicker,
    Form,
    Input,
    Row,
    Select,
    Space,
    Table,
} from "antd";
import "antd/dist/reset.css";
import { useState } from "react";
import axios from "axios";
import dayjs from "dayjs";

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Item, List } = Form;

interface Log {
    level: string;
    message: string;
    resourceId: string;
    timestamp: string;
    traceId: string;
    spanId: string;
    commit: string;
    metadata: {
        parentResourceId: string;
    };
}

const conditionOptions = [
    { label: "Equals", value: "=" },
    { label: "Not Equals", value: "!=" },
    { label: "Contains", value: "~" },
    { label: "Does Not Contain", value: "!~" },
];

const columns = [
    { title: "Level", dataIndex: "level", key: "level" },
    { title: "Message", dataIndex: "message", key: "message", ellipsis: true },
    { title: "Resource ID", dataIndex: "resourceId", key: "resourceId" },
    { title: "Timestamp", dataIndex: "timestamp", key: "timestamp" },
    { title: "Trace ID", dataIndex: "traceId", key: "traceId" },
    { title: "Span ID", dataIndex: "spanId", key: "spanId" },
    { title: "Commit", dataIndex: "commit", key: "commit" },
    {
        title: "Parent Resource ID",
        dataIndex: ["metadata", "parentResourceId"],
        key: "parentResourceId",
    },
];

const App: React.FC = () => {
    const [logs, setLogs] = useState<Log[]>([]);
    const [form] = Form.useForm();

    const handleSearch = async () => {
        const formValues = form.getFieldsValue();
        console.log(formValues);
        
        const formattedFilters = formValues.filters.filter((filter) => filter.field && filter.value);
    
        let startDate;
        let endDate;
        if (formValues.dateRange && formValues.dateRange[0] && formValues.dateRange[1]) {
            startDate = dayjs(formValues.dateRange[0]).format();
            endDate = dayjs(formValues.dateRange[1]).format();
        }

        const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/.netlify/functions/query`, {
            filters: formattedFilters,
            startDate,
            endDate,
        });

        setLogs(data);
    };

    const handleReset = () => {
        form.resetFields();
    };

    return (
        <>
        <div style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
            <Form
                form={form}
                onFinish={handleSearch}
                initialValues={{
                    filters: [{ field: "", operator: "", value: "" }],
                    dateRange: { value: [] },
                }}
            >
                <List
                    name="filters"
                    initialValue={{ field: "", operator: "", value: "" }}
                    rules={[
                        {
                            validator(_, value) {
                                if (!value || value.length >= 3) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(
                                    new Error(
                                        "Filter configuration is incomplete."
                                    )
                                );
                            },
                        },
                    ]}
                >
                    {(fields, { add, remove }) => (
                        <>
                            {fields.map(
                                ({ key, name, fieldKey, ...restField }) => (
                                    <Row
                                        key={key}
                                        gutter={16}
                                        style={{ marginBottom: "20px" }}
                                    >
                                        <Col span={6}>
                                            <Item
                                                {...restField}
                                                name={[name, "field"]}
                                                fieldKey={[fieldKey, "field"]}
                                                rules={[
                                                    {
                                                        required: true,
                                                        message:
                                                            "Field is required",
                                                    },
                                                ]}
                                            >
                                                <Select placeholder="Select Field">
                                                    <Option value="level">
                                                        Level
                                                    </Option>
                                                    <Option value="message">
                                                        Message
                                                    </Option>
                                                    <Option value="resourceId">
                                                        Resource ID
                                                    </Option>
                                                    <Option value="timestamp">
                                                        Timestamp
                                                    </Option>
                                                    <Option value="traceId">
                                                        Trace ID
                                                    </Option>
                                                    <Option value="spanId">
                                                        Span ID
                                                    </Option>
                                                    <Option value="commit">
                                                        Commit
                                                    </Option>
                                                    <Option value="metadata.parentResourceId">
                                                        Parent Resource ID
                                                    </Option>
                                                </Select>
                                            </Item>
                                        </Col>
                                        <Col span={6}>
                                            <Item
                                                {...restField}
                                                name={[name, "operator"]}
                                                fieldKey={[
                                                    fieldKey,
                                                    "operator",
                                                ]}
                                                rules={[
                                                    {
                                                        required: true,
                                                        message:
                                                            "Condition is required",
                                                    },
                                                ]}
                                            >
                                                <Select placeholder="Select Condition">
                                                    {conditionOptions.map(
                                                        ({ label, value }) => (
                                                            <Option
                                                                key={value}
                                                                value={value}
                                                            >
                                                                {label}
                                                            </Option>
                                                        )
                                                    )}
                                                </Select>
                                            </Item>
                                        </Col>
                                        <Col span={6}>
                                            {restField.name &&
                                            restField.name[0] ===
                                                "timestamp" ? (
                                                <Item
                                                    {...restField}
                                                    name={[name, "value"]}
                                                    fieldKey={[
                                                        fieldKey,
                                                        "value",
                                                    ]}
                                                >
                                                    <RangePicker />
                                                </Item>
                                            ) : (
                                                <Item
                                                    {...restField}
                                                    name={[name, "value"]}
                                                    fieldKey={[
                                                        fieldKey,
                                                        "value",
                                                    ]}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message:
                                                                "Value is required",
                                                        },
                                                    ]}
                                                >
                                                    <Input placeholder="Value" />
                                                </Item>
                                            )}
                                        </Col>
                                        <Col span={6}>
                                            <Space>
                                                <Button
                                                    type="dashed"
                                                    onClick={() => add()}
                                                    icon={
                                                        <i className="anticon anticon-plus" />
                                                    }
                                                    style={{ width: "100%" }}
                                                >
                                                    Add Filter
                                                </Button>
                                                {fields.length > 1 && (
                                                    <Button
                                                        type="danger"
                                                        onClick={() =>
                                                            remove(name)
                                                        }
                                                        icon={
                                                            <i className="anticon anticon-minus" />
                                                        }
                                                        style={{
                                                            width: "100%",
                                                        }}
                                                    >
                                                        Remove
                                                    </Button>
                                                )}
                                            </Space>
                                        </Col>
                                    </Row>
                                )
                            )}
                        </>
                    )}
                </List>
                {/* Date Range Filter */}
                <Row gutter={16} style={{ marginBottom: "20px" }}>
                    <Col span={16}>
                        <Item
                            name={["dateRange", "value"]}
                            fieldKey={["dateRange", "value"]}
                        >
                            <RangePicker showTime onChange={(_, dateStr) => {                                
                                form.setFieldsValue({ startDate: dateStr[0], endDate: dateStr[1] });
                            }} />
                        </Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Space>
                            <Button
                                type="primary"
                                htmlType="submit"
                                onClick={handleSearch}
                            >
                                Search
                            </Button>
                            <Button onClick={handleReset}>Reset</Button>
                        </Space>
                    </Col>
                </Row>
            </Form>
            </div>

            <Table
                dataSource={logs}
                columns={columns}
                style={{ marginTop: "20px" }}
            />
        </>
    );
};

export default App;
