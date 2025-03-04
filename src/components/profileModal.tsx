import React, {useEffect, useState} from "react";
import { HomeOutlined, BankFilled, PhoneOutlined} from "@ant-design/icons";
import {Modal, Input, Select, Button, notification} from "antd";
import axios from "axios";
import {jwtDecode} from "jwt-decode";
import {api, apiBaseUrl} from "../service/apiService.ts";

interface ProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    userProfile: {
        username: string;
        name: string;
        address: string;
        bank_name: string;
        account_name: string;
        account_number: string;
        phone: string;
    } | null;
}

export default function ProfileModal({isOpen, onClose, userProfile}: ProfileModalProps) {

    const [pharmacyName, setPharmacyName] = useState("");
    const [pharmacyAddress, setPharmacyAddress] = useState("");
    const [selectedBank, setSelectedBank] = useState<any>({});
    const [accountNumber, setAccountNumber] = useState("");
    const [accountName, setAccountName] = useState("");
    const [phone, setPhone] = useState("");
    const [banks, setBanks] = useState<{ name: string }[]>([]);
    useEffect(() => {
        // Fetch bank list
        if (userProfile) {
            const fetchBanks = async () => {
                try {
                    const response = await axios.get("https://api.paystack.co/bank");
                    setSelectedBank(response.data.data.find((b: any) => userProfile.bank_name === b.code));
                    setBanks(response.data.data);
                } catch (error) {
                    console.error("Error fetching banks:", error);
                }
            };

            fetchBanks();
        }
    }, []);

    useEffect(() => {
        // Prefill data when modal opens
        if (isOpen && userProfile) {
            setPharmacyName(userProfile.name || "");
            setPharmacyAddress(userProfile.address || "");
            setAccountNumber(userProfile.account_number || "");
            setPhone(userProfile.phone || "");
        }
    }, [isOpen, userProfile]);

    // Fetch account name when account number changes
    useEffect(() => {
        const resolveAccount = async () => {
            if (accountNumber.length === 10 && selectedBank) {
                try {
                    const response = await axios.get(
                        `https://api.paystack.co/bank/resolve?account_number=${accountNumber}&bank_code=${userProfile?.bank_name}`,
                        {headers: {Authorization: `Bearer sk_test_accd9e759dcf29e72d8ed562fa0d972265e5861a`}}
                    );
                    setAccountName(response.data.data.account_name);
                } catch (error) {
                    console.error("Error fetching account name:", error);
                    setAccountName("Invalid account details");
                }
            }
        };

        resolveAccount();
    }, [accountNumber, selectedBank]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const authToken = localStorage.getItem("authToken") ?? "";
            const decoded: { user_id: string } = jwtDecode(authToken);
            // Assuming `endpoint.updateProfile` exists for updating profile
            await api.put(apiBaseUrl + "/customers/" + decoded.user_id + "/", {
                name: pharmacyName,
                address: pharmacyAddress,
                bank_name: selectedBank.code,
                account_number: accountNumber,
                account_name: accountName,
                phone,
                user:decoded.user_id
            });

            notification.success({message: "Profile updated successfully"});
            onClose(); // Close modal after submission
        } catch (error: any) {
            notification.error({
                message: error.response?.data?.error || "Failed to update profile",
            });
        }
    };

    return (
        <Modal open={isOpen} onCancel={onClose} footer={null} title="Update Profile" centered>
            <form onSubmit={handleSubmit} className="space-y-4">

                <Input
                    prefix={<HomeOutlined/>}
                    value={pharmacyName}
                    onChange={(e) => setPharmacyName(e.target.value)}
                    placeholder="Pharmacy Name"
                    required
                />
                <Input
                    prefix={<HomeOutlined/>}
                    value={pharmacyAddress}
                    onChange={(e) => setPharmacyAddress(e.target.value)}
                    placeholder="Pharmacy Address"
                />
                <Select
                    className="w-full"
                    value={selectedBank?.name}
                    onChange={(value) => setSelectedBank(value)}
                    placeholder="Select Bank"
                >
                    <Select.Option disabled>Select Bank</Select.Option>
                    {banks.map((bank) => (
                        <Select.Option key={bank.name} value={bank.name}>
                            {bank.name}
                        </Select.Option>
                    ))}
                </Select>
                <Input
                    prefix={<BankFilled/>}
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    placeholder="Account Number"
                    required
                />
                <Input value={accountName} readOnly className="bg-gray-100" placeholder="Account Name"/>
                <Input
                    prefix={<PhoneOutlined/>}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Phone Number"
                    required
                />
                <Button type="primary" htmlType="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                    Update
                </Button>
            </form>
        </Modal>
    );
}
