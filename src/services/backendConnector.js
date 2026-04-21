import { v4 as uuidv4 } from 'uuid';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

export const getGuestId = () => {
    if (typeof window !== 'undefined') {
        let guestId = localStorage.getItem('hospital_guest_id'); 
        if (!guestId) {
            guestId = uuidv4();
            localStorage.setItem('hospital_guest_id', guestId);
        }
        return guestId;
    }
    return null;
};

const fetchAPI = async (endpoint, options = {}) => {
    const guestId = getGuestId();

    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
    };

    if (guestId) {
        headers['x-guest-id'] = guestId;
    }

    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('auth_token');
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || data.error || 'حدث خطأ غير متوقع');
    }

    return data;
};

export const AuthAPI = {
    register: (userData) => fetchAPI('/app/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
    login: (national_number, password) => fetchAPI('/app/auth/login', { method: 'POST', body: JSON.stringify({ national_number, password }) }),
    requestLogin: (national_number) => fetchAPI('/app/auth/login/request', { method: 'POST', body: JSON.stringify({ national_number }) }),
    verifyLogin: (national_number, password) => fetchAPI('/app/auth/login/verify', { method: 'POST', body: JSON.stringify({ national_number, password }) }),
    logout: () => fetchAPI('/app/auth/logout', { method: 'POST' }),
    getUser: () => fetchAPI('/app/user', { method: 'GET' }),
};

export const BackendConnector = {
    getHospitals: (typeId = null) => {
        const url = typeId ? `/hospital?type_id=${typeId}` : '/hospital';
        return fetchAPI(url);
    },
        getHospitalDetails: (id) => fetchAPI(`/hospital/${id}`),
    getClinics: () => fetchAPI('/clinics'),
    joinQueue: (clinicId) => fetchAPI('/queue/join', { method: 'POST', body: JSON.stringify({ clinic_id: clinicId }) }),
    
    getDepartmentSchedule: (deptId) => fetchAPI(`/department/schedule?department_id=${deptId}`),
    joinQueue: (clinicId) => fetchAPI('/queue/join', { method: 'POST', body: JSON.stringify({ clinic_id: clinicId }) }),
    getQueueStatus: () => fetchAPI('/queue/status'),
};