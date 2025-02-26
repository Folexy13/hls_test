import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Form, Input, Button, Radio, notification } from 'antd';
import { api, apiBaseUrl } from '../service/apiService';

function generateRandomCode() {
  return Math.random().toString(36).substr(2, 8).toUpperCase();
}

function AddBenfek() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [hasHealthCondition, setHasHealthCondition] = useState(false);

  const handleSubmit = async (values:any) => {
    setLoading(true);
    const newBenfek = { ...values, code: generateRandomCode() };
    try {
      await api.post(`${apiBaseUrl}/health-conditions/`, newBenfek);
      notification.success({ message: 'Benfek added successfully!' });
      navigate('/benfeks');
    } catch (error) {
      console.error('Error adding benfek:', error);
      notification.error({ message: 'Failed to add Benfek. Try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen sm:block flex items-center justify-center bg-gray-100 p-4">
      <div className="md:max-w-7xl w-11/12 mx-auto">
        <button
            onClick={() => navigate('/dashboard')}
            className="mb-6 flex items-center gap-2 text-white rounded bg-green-400 px-6 py-1 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </button>
        
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h1 className="text-2xl font-bold mb-6">Add Benfek</h1>
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Form.Item label="Name" name="benfek" rules={[{ required: true, message: 'Please enter the name' }]}> 
              <Input placeholder="Enter name" />
            </Form.Item>
            
            <Form.Item label="Phone Number" name="phone" rules={[{ required: true, message: 'Please enter phone number' }]}> 
              <Input placeholder="Enter phone number" />
            </Form.Item>

            <Form.Item label="Do you have any allergies?" name="allergies" > 
              <Input placeholder="Enter allergies (seperate values by commas)" />
            </Form.Item>

            <Form.Item label="What health issue scares you the most?" name="scary_issues" > 
              <Input placeholder="Enter issues (seperate values by commas)" />
            </Form.Item>
            <Form.Item label="What is your family's notable health condition?" name="family_condition" > 
              <Input placeholder="Enter family's condition" />
            </Form.Item>
            <Form.Item label="Current medication in use" name="current_medication" >
              <Input placeholder="Enter issues (seperate values by commas)" />
            </Form.Item>

            <Form.Item label="Do you have any current health condition?" name="have_health_condition" rules={[{ required: true, message: 'Please select an option' }]}> 
              <Radio.Group onChange={(e) => setHasHealthCondition(e.target.value === 'yes')}>
                <Radio value="yes">Yes</Radio>
                <Radio value="no">No</Radio>
              </Radio.Group>
            </Form.Item>
            
            {hasHealthCondition && (
              <Form.Item label="Health Condition" name="health_condition" rules={[{ required: true, message: 'Please enter your health condition' }]}> 
                <Input placeholder="Enter health condition" />
              </Form.Item>
            )}

            <div className="flex justify-end gap-2">
              <Button onClick={() => navigate('/benfeks')}>Cancel</Button>
              <Button type="primary" htmlType="submit" loading={loading}>Save</Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default AddBenfek;
