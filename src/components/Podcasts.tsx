import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Upload, Button, List, Modal, Form, Input } from "antd";
import { UploadOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { api, apiBaseUrl } from "../service/apiService";

function Podcasts() {
    const navigate = useNavigate();
    const [fileList, setFileList] = useState<any[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentFile, setCurrentFile] = useState<any>(null);
    const [form] = Form.useForm();

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleModalOk = () => {
        form.validateFields().then(async (values) => {
            // Log the form values
            console.log("Podcast Details:", values);

            // Add the new podcast to the fileList
            const newPodcast = {
                uid: Date.now().toString(), // Unique ID for the podcast
                title: values.title,
                description: values.description,
                thumbnail: values.thumbnail, // Captured thumbnail
                audio_file: values.audioFile?.[0], // Store the uploaded audio file
            };
            const formData = new FormData();
            formData.append("title", values.title);
            formData.append("description", values.description);
                formData.append("audio_file", values.audioFile?.[0].originFileObj);
            if (values.thumbnail) {
                formData.append("thumbnail", values.thumbnail);
            }
            
            // await api.post(`${apiBaseUrl}/podcasts`, newPodcast);
            await api.post(`${apiBaseUrl}/podcasts/`, formData);
            setFileList([...fileList, newPodcast]);

            // Reset the form and close the modal
            form.resetFields();
            setIsModalVisible(false);
        });
    };

    const handleModalCancel = () => {
        form.resetFields();
        setIsModalVisible(false);
    };

    const handleDelete = (file: any) => {
        const updatedFileList = fileList.filter((f) => f.uid !== file.uid);
        setFileList(updatedFileList);
    };

    const handleEdit = (file: any) => {
        setCurrentFile(file);
        setIsModalVisible(true);
        form.setFieldsValue({
            title: file.title,
            description: file.description,
            thumbnail: file.thumbnail,
            audioFile: file.audioFile ? [file.audioFile] : [],
        });
    };

    const captureThumbnail = (file: File) => {
        return new Promise<string>((resolve, reject) => {
            const video = document.createElement("video");
            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");

            // Set up the video element
            video.src = URL.createObjectURL(file);
            video.addEventListener("loadedmetadata", () => {
                // Set canvas dimensions to match video dimensions
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;

                // Seek to a specific time (e.g., 1 second) and capture the frame
                video.currentTime = 1;
            });

            video.addEventListener("seeked", () => {
                if (context) {
                    // Draw the video frame onto the canvas
                    context.drawImage(video, 0, 0, canvas.width, canvas.height);

                    // Convert the canvas image to a data URL (base64)
                    const thumbnail = canvas.toDataURL("image/jpeg");
                    resolve(thumbnail);
                } else {
                    reject(new Error("Canvas context not available"));
                }
            });

            video.addEventListener("error", (error) => {
                reject(error);
            });
        });
    };

    const handleAudioUpload = async (file: File) => {
        try {
            // Capture thumbnail from the video
            const thumbnail = await captureThumbnail(file);

            // Set the thumbnail in the form
            form.setFieldsValue({
                thumbnail,
            });

            // Return false to prevent automatic upload
            return false;
        } catch (error) {
            console.error("Error capturing thumbnail:", error);
            return false;
        }
    };

    return (
        <div className="min-h-screen sm:block flex items-center justify-center bg-gray-100 p-4">
            <div className="md:max-w-7xl w-11/12 mx-auto">
                <button
                    onClick={() => navigate("/dashboard")}
                    className="mb-6 flex items-center gap-2 text-white rounded bg-green-400 px-6 py-1 hover:text-gray-900"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back to Dashboard
                </button>

                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h1 className="text-2xl font-bold mb-6">Podcasts</h1>

                    {/* Add Podcast Button */}
                    <Button type="primary" icon={<UploadOutlined />} onClick={showModal}>
                        Add Podcast
                    </Button>

                    {/* List of Uploaded Podcasts */}
                    {fileList.length > 0 && (
                        <List
                            className="mt-4"
                            bordered
                            dataSource={fileList}
                            renderItem={(file: any) => (
                                <List.Item>
                                    <div className="flex items-center justify-between w-full">
                                        {/* Podcast Thumbnail and Name */}
                                        <div className="flex items-center space-x-4">
                                            {file.thumbnail && (
                                                <img
                                                    src={file.thumbnail}
                                                    alt="Thumbnail"
                                                    className="w-10 h-10 sm:w-24 sm:h-16 object-cover rounded"
                                                />
                                            )}
                                            <div>
                                                <h3 className="font-bold">{file.title}</h3>
                                                <p className="text-sm text-gray-600">{file.description}</p>
                                            </div>
                                        </div>

                                        {/* Edit and Delete Buttons */}
                                        <div className="flex items-center space-x-4">
                                            <Button
                                                type="text"
                                                icon={<EditOutlined />}
                                                onClick={() => handleEdit(file)}
                                            />
                                            <Button
                                                type="text"
                                                danger
                                                icon={<DeleteOutlined />}
                                                onClick={() => handleDelete(file)}
                                            />
                                        </div>
                                    </div>
                                </List.Item>
                            )}
                        />
                    )}
                </div>
            </div>

            {/* Modal for Adding/Editing Podcast */}
            <Modal
                title={currentFile ? "Edit Podcast" : "Add Podcast"}
                visible={isModalVisible}
                onOk={handleModalOk}
                onCancel={handleModalCancel}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="title"
                        label="Title"
                        rules={[{ required: true, message: "Please input the title!" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="description"
                        label="Description"
                        rules={[{ required: true, message: "Please input the description!" }]}
                    >
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item
                        name="audioFile"
                        label="Audio File"
                        rules={[{ required: true, message: "Please upload an audio file!" }]}
                        valuePropName="fileList"
                        getValueFromEvent={(e) => e.fileList}
                    >
                        <Upload
                            beforeUpload={handleAudioUpload}
                            accept="video/*"
                            maxCount={1}
                        >
                            <Button icon={<UploadOutlined />}>Upload Audio</Button>
                        </Upload>
                    </Form.Item>
                    <Form.Item name="thumbnail" hidden>
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

export default Podcasts;