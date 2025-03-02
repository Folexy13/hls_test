import React, { useState } from "react";
import { UserOutlined,HomeOutlined, BankFilled, PhoneOutlined } from "@ant-design/icons";
import { Modal, Input, Select, Button } from "antd";

interface ProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
    const [username, setUsername] = useState<string>("");
    const [pharmacyName, setPharmacyName] = useState<string>("");
    const [pharmacyAddress, setPharmacyAddress] = useState<string>("");
    const [selectedBank, setSelectedBank] = useState<string>("");
    const [accountNumber, setAccountNumber] = useState<string>("");
    const [phone, setPhone] = useState<string>("");

    interface Bank {
        name: string;
    }

    const banks: Bank[] = [{ name: "Bank A" }, { name: "Bank B" }];

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("Form submitted");
    };

    return (
        <Modal  open={isOpen} onCancel={onClose} footer={null} title={"Update Profile"}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input prefix={<UserOutlined />} value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" required />

                    <div>
                        <Input prefix={<HomeOutlined />} value={pharmacyName} onChange={(e) => setPharmacyName(e.target.value)} placeholder="Pharmacy Name" required />
                        <Input prefix={<HomeOutlined />} value={pharmacyAddress} onChange={(e) => setPharmacyAddress(e.target.value)} placeholder="Pharmacy Address" />
                        <Select className="w-full" defaultValue={"Select bank"} value={selectedBank} onChange={(value) => setSelectedBank(value)} placeholder="Select Bank">
                            <Select.Option disabled >Select bank</Select.Option>
                            {banks.map((bank) => (
                                <Select.Option key={bank.name} value={bank.name}>{bank.name}</Select.Option>
                            ))}
                        </Select>
                        <Input prefix={<BankFilled />} value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} placeholder="Account Number" required />
                        <Input value={"accountName"} readOnly className="bg-gray-100" placeholder="Account Name" />
                        <Input prefix={<PhoneOutlined />} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone Number" required />
                    </div>
                <Button type="primary" htmlType="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                  Update
                </Button>
            </form>
        </Modal>
    );
}
