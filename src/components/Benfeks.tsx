import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import {
  Table,
  Modal,
  Button,
  Form,
  Input,
  notification,
  Dropdown,
  Menu,
  Collapse,
} from "antd";
import { api, apiBaseUrl } from "../service/apiService";
import { MoreOutlined } from "@ant-design/icons";

const { Panel } = Collapse;

const BenfeksPage = () => {
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [benfeksData, setBenfeksData] = useState<any[]>([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    api
      .get(`${apiBaseUrl}/health-conditions/`)
      .then((response) => setBenfeksData(response.data))
      .catch((error) => console.error("Error fetching benfeks data:", error));

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleAddAccount = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleDelete = (id: any) => {
    Modal.confirm({
      title: "Are you sure you want to delete this benfek?",
      onOk: async () => {
        await api.delete(`${apiBaseUrl}/health-conditions/${id}/`);
        setBenfeksData(benfeksData.filter((benfek) => benfek.id !== id));
        notification.success({ message: "Benfek deleted successfully!" });
      },
    });
  };

  const columns = [
    { title: "Code", dataIndex: "code", key: "code" },
    { title: "Name", dataIndex: "benfek", key: "benfek" },
    { title: "Phone Number", dataIndex: "phone", key: "phone" },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => (
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item onClick={() => handleDelete(record.id)}>Delete</Menu.Item>
            </Menu>
          }
        >
          <Button
            className="border-0 shadow-0 bg-transparent hover:bg-transparent"
            icon={<MoreOutlined />}
          />
        </Dropdown>
      ),
    },
  ];

  return (
    <div className="min-h-screen sm:block flex items-center justify-center bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto w-full">
        <button
          onClick={() => navigate("/dashboard")}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </button>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h1 className="text-2xl font-bold mb-6">Benfeks</h1>
          <p className="text-gray-600 mb-4">Manage your Benfeks accounts below.</p>

          <Button type="primary" onClick={handleAddAccount}>
            Add Benfek
          </Button>

          {/* Show Table on Large Screens and Collapse on Small Screens */}
          {isMobile ? (
            <Collapse accordion className="mt-6">
              {benfeksData.map((benfek) => (
                <Panel key={benfek.id} header={benfek.benfek}>
                  <p>
                    <strong>Code:</strong> {benfek.code}
                  </p>
                  <p>
                    <strong>Phone Number:</strong> {benfek.phone}
                  </p>
                  <div className="flex justify-end mt-2">
                    <Button danger onClick={() => handleDelete(benfek.id)}>
                      Delete
                    </Button>
                  </div>
                </Panel>
              ))}
            </Collapse>
          ) : (
            <Table columns={columns} dataSource={benfeksData} pagination={false} className="mt-6" />
          )}
        </div>
      </div>

      {/* Modal for adding a new Benfek */}
      <Modal title="Add New Benfek" open={isModalVisible} onCancel={handleCancel} footer={null}>
        <Form form={form} layout="vertical">
          <Form.Item label="Name" name="name" rules={[{ required: true, message: "Please input the Benfek name!" }]}>
            <Input placeholder="Enter name" />
          </Form.Item>
          <div className="flex justify-end gap-2">
            <Button onClick={handleCancel}>Cancel</Button>
            <Button type="primary" htmlType="submit">
              Save
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default BenfeksPage;
