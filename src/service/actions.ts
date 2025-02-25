import axios from "axios";
import {apiBaseUrl} from "./apiService";

class Endpoint {
    private apiBaseUrl = apiBaseUrl;

    // Method to log in a user
    public async loginUser(username: string, password: string): Promise<void> {
        try {
            const response = await axios.post(`${apiBaseUrl}/auth/login`, {
                username,
                password,
            });

            // Assuming the backend sends back an access token
            const {access: token} = response.data;

            // Save the token in localStorage or another secure storage
            if (token) {
                localStorage.setItem("authToken", token);
            }

            return response.data;
        } catch (error) {
            console.error("Login failed:", error);
            throw error;
        }
    }

    // Method to register a new user
    public async registerUser(
        username: string,
        password: string,
        role: string,
        name: string,
        account_number: string, account_name: string,
        bank_name: string,
        address: string,
        phone: string
    ): Promise<void> {
        try {
            const response = await axios.post(
                `${this.apiBaseUrl}/auth/register`,
                {
                    username,
                    password,
                    role,
                    name,
                    account_number,
                    account_name,
                    bank_name,
                    address,
                    phone,

                }
            );

            return response.data;
        } catch (error) {
            console.error("Registration failed:", error);
            throw error;
        }
    }
}

export const endpoint = new Endpoint();
