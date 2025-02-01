import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import {
  Table,
  Modal,
  Button,
  Form,
  Input,
  DatePicker,
  notification,
  Upload,
  Dropdown,
  Menu,
} from "antd";
import { UploadOutlined, MoreOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { api, apiBaseUrl } from "../service/apiService";

const Supplements = () => {
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingSupplement, setEditingSupplement] = useState<any>(null); // Track the supplement being edited
  const [form] = Form.useForm();
  const [supplements, setSupplements] = useState<any[]>([]);

  useEffect(() => {
    const fetchSupplements = async () => {
      try {
        const response = await api.get(`${apiBaseUrl}/supplements/`);
        setSupplements(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchSupplements();
  }, []);

  const handleAddSupplement = () => {
    setEditingSupplement(null); // Clear previous data if adding a new supplement
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleSubmit = async (values: any) => {
    try {
      const formattedPrice = parseInt(values.price.replace(/,/g, ""), 10); // Remove commas and convert to number
      const imageFile = values.image && values.image[0]; // Directly access the file object

      if (!imageFile) {
        throw new Error("Please upload a valid image.");
      }

      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("price", formattedPrice.toString());
      formData.append("expiry", values.expiry.format("YYYY-MM-DD"));
      formData.append("image", imageFile); // Append the file directly

      let response;
      if (editingSupplement) {
        // Update existing supplement
        response = await api.put(
          `${apiBaseUrl}/supplements/${editingSupplement.key}/`,
          formData,
          {
            "Content-Type": "multipart/form-data",
          }
        );
      } else {
        // Add new supplement
        response = await api.post(`${apiBaseUrl}/supplements/`, formData, {
          "Content-Type": "multipart/form-data",
        });
      }

      if (!response.data)
        throw new Error("An error occurred while saving data.");

      // Update local state
      const updatedSupplements = editingSupplement
        ? supplements.map((supp) =>
            supp.key === editingSupplement.key ? response.data : supp
          )
        : [...supplements, response.data];
      setSupplements(updatedSupplements);

      notification.success({
        message: editingSupplement
          ? "Supplement updated successfully!"
          : "Supplement added successfully!",
      });

      form.resetFields();
      setIsModalVisible(false);
    } catch (error: any) {
      notification.error({ message: error.message || "An error occurred" });
    }
  };

  const handleDelete = (key: string) => {
    Modal.confirm({
      title: "Are you sure you want to delete this supplement?",
      onOk: async () => {
         await api.delete(`${apiBaseUrl}/supplements/${key}/`);

        // if (!response.data) throw new Error("Error deleting supplement");

        // Remove the deleted supplement from the local state
        const filteredSupplements = supplements.filter(
          (supp) => supp.key !== key
        );
        setSupplements(filteredSupplements);
        notification.success({ message: "Supplement deleted successfully!" });
      },
    });
  };

  const handleEdit = (supplement: any) => {
    setEditingSupplement(supplement); // Set the supplement to edit
    setIsModalVisible(true); // Show the modal
    form.setFieldsValue({
      name: supplement.name,
      price: supplement.price.toLocaleString(), // Format price with commas
      expiry: dayjs(supplement.expiry),
      image: null, // Can't prefill image in Form, but it will be visible in modal
    });
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (text: string) => (
        <img
          src={text}
          alt="Supplement"
          style={{ width: "50px", height: "50px", objectFit: "cover" }}
        />
      ),
    },
    { title: "Name", dataIndex: "name", key: "name" },
    {
      title: "Price (NGN)",
      dataIndex: "price",
      key: "price",
      render: (price: number) => price.toLocaleString(), // Format price with commas for display
    },
    {
      title: "Expiry Date",
      dataIndex: "expiry",
      key: "expiry",
      render: (expiry: string) => {
        const currentDate = dayjs();
        const expiryDate = dayjs(expiry);
        const isExpired = expiryDate.isBefore(currentDate, "day");
        const isExpiringSoon =
          expiryDate.isBefore(currentDate.add(3, "months"), "day") &&
          !isExpired;
    
        let color = "green"; // Default color
    
        if (isExpired) {
          color = "red"; // Expired
        } else if (isExpiringSoon) {
          color = "yellow"; // Expiring soon
        }
    
        return (
          <span
            style={{
              color,
              fontWeight: "bolder",
            }}
          >
            {expiryDate.format("MMM D, YYYY")} {/* Human-friendly date format */}
          </span>
        );
      },
    },
    
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => (
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item onClick={() => handleEdit(record)}>Edit</Menu.Item>
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
    <div className="min-h-screen sm:block flex items-center justify-center bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate("/dashboard")}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </button>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h1 className="text-2xl font-bold mb-6">Supplements</h1>
          <Button type="primary" onClick={handleAddSupplement} className="mb-4">
            Add Supplement
          </Button>
          <Table
            columns={columns}
            dataSource={supplements}
            pagination={false}
            className="mt-6"
            scroll={{ x: 800 }}
          />
        </div>
      </div>

      {/* Modal for adding or editing supplements */}
      <Modal
        title={editingSupplement ? "Edit Supplement" : "Add New Supplement"}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        destroyOnClose
      >
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item
            label="Name"
            name="name"
            rules={[
              { required: true, message: "Please input the supplement name!" },
            ]}
          >
            <Input placeholder="Enter name" />
          </Form.Item>

          <Form.Item
            label="Price (NGN)"
            name="price"
            rules={[
              { required: true, message: "Please input the supplement price!" },
            ]}
          >
            <Input
              placeholder="Enter price"
              value={form.getFieldValue("price")}
              onChange={(e) =>
                form.setFieldsValue({
                  price: e.target.value
                    .replace(/\D/g, "")
                    .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,"),
                })
              }
            />
          </Form.Item>

          <Form.Item
            label="Expiry Date"
            name="expiry"
            rules={[
              { required: true, message: "Please select the expiry date!" },
            ]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            label="Image"
            name="image"
            valuePropName="fileList"
            getValueFromEvent={(e) => (Array.isArray(e) ? e : e && [e.file])}
            rules={[
              {
                required: true,
                message: "Please upload an image or take a photo!",
              },
            ]}
          >
            <Upload
              listType="picture"
              maxCount={1}
              beforeUpload={() => false}
              customRequest={() => {}}
            >
              <Button icon={<UploadOutlined />}>Upload or Take Photo</Button>
            </Upload>
          </Form.Item>

          <div className="flex justify-end gap-2">
            <Button onClick={handleCancel}>Cancel</Button>
            <Button type="primary" htmlType="submit">
              {editingSupplement ? "Save Changes" : "Add Supplement"}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default Supplements;
