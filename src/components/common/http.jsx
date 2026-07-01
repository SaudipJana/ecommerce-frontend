export const apiUrl = "http://localhost:8000/api";
export const adminToken = () => {
    const data = JSON.parse(localStorage.getItem('adminInfo'));
    return data.token;
}
export const userToken = () => {
    const data = JSON.parse(localStorage.getItem('userInfo'));
    return data.token;
}

export const STRIPE_PUBLIC_KEY = 'pk_test_51RtQsD4KHCLFXKeBQbOBICfw8IIqPA5BPg9dFhDILBnVUhVYlb2EhXTDrritn3VF7Ikfi5f8Kzbw5ppE9Zwf1WQd00lKo0VFfE';