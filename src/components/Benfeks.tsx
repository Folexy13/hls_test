import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import {
  Table,
  Modal,
  Button,
  Form,
  Input,
  Radio,
  notification,
  Dropdown,
  Menu,
} from "antd";
import { api, apiBaseUrl } from "../service/apiService";
import { MoreOutlined } from "@ant-design/icons";

// Utility to generate random phone numbers
const generatePhoneNumber = () => {
  const phonePrefix = "080"; // Nigerian phone number prefix
  const randomDigits = Math.floor(100000000 + Math.random() * 900000000);
  return phonePrefix + randomDigits.toString();
};

// Utility to generate random code (e.g., alphanumeric)
const generateRandomCode = () => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 8; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

const BenfeksPage = () => {
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [benfeksData, setBenfeksData] = useState<any[]>([]);

  useEffect(() => {
    // Fetch existing data from the backend
    api
      .get(`${apiBaseUrl}/health-conditions/`)
      .then((response) => setBenfeksData(response.data))
      .catch((error) => console.error("Error fetching benfeks data:", error));
  }, []);

  const handleAddAccount = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSubmit = (values: any) => {
    const newBenfek = {
      code: generateRandomCode(),
      benfek: values.name,
      phone: generatePhoneNumber(),
      have_health_condition: values.HavehealthCondition,
      health_condition: values.healthCondition,
      current_medication: values.currentMedication,
      family_condition: values.familyHealthCondition,
      allergies: values.allergies,
      scary_issue: values.healthFear,
    };

    // Add new Benfek to the backend
    api
      .post(`${apiBaseUrl}/health-conditions/`, newBenfek)
      .then((response) => {
        setBenfeksData([...benfeksData, response.data]);
        notification.success({ message: "Benfek added successfully!" });
        form.resetFields();
        setIsModalVisible(false);
      })
      .catch((error: any) => {
        console.error("Error adding benfek:", error);
        notification.error({
          message: error.response.data.error || "Failed to add Benfek",
        });
      });
  };

  const handleEdit = (record: any) => {
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = (id: any) => {
    // Delete Benfek from the backend
    Modal.confirm({
      title: "Are you sure you want to delete this benfek?",
      onOk: async () => {
        await api.delete(`https://www.hls.com.ng/api/health-conditions/${id}/`);

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
              <Menu.Item disabled onClick={() => handleEdit(record)}>
                Edit
              </Menu.Item>
              <Menu.Item onClick={() => handleDelete(record.id)}>
                Delete
              </Menu.Item>
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
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate("/dashboard")}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </button>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h1 className="text-2xl font-bold mb-6">Benfeks</h1>
          <p className="text-gray-600 mb-4">
            Manage your Benfeks accounts below.
          </p>

          <Button type="primary" onClick={handleAddAccount}>
            Add Benfek
          </Button>

          <Table
            columns={columns}
            dataSource={benfeksData}
            pagination={false}
            className="mt-6"
            scroll={{ x: 800 }}
          />
        </div>
      </div>

      {/* Modal for adding or editing Benfek */}
      <Modal
        title="Add New Benfek"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Name"
            name="name"
            rules={[
              { required: true, message: "Please input the Benfek name!" },
            ]}
          >
            <Input placeholder="Enter name" />
          </Form.Item>
          <Form.Item
            label="Do you have a current health condition?"
            name="healthCondition"
            rules={[{ required: true, message: "Please select an option!" }]}
          >
            <Radio.Group>
              <Radio value="yes">Yes</Radio>
              <Radio value="no">No</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="Current Medication in Use" name="currentMedication">
            <Input placeholder="Enter current medication (if any)" />
          </Form.Item>
          <Form.Item
            label="Family Notable Health Condition"
            name="familyHealthCondition"
          >
            <Input placeholder="Enter family notable health condition" />
          </Form.Item>
          <Form.Item label="Allergies" name="allergies">
            <Input placeholder="Enter allergies (comma-separated)" />
          </Form.Item>
          <Form.Item
            label="What health issue scares you the most?"
            name="healthFear"
          >
            <Input placeholder="Enter your health fear" />
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
