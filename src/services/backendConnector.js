import { v4 as uuidv4 } from 'uuid';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://onlinemihna-technical-task-backend.onrender.com/api';

export const getGuestId = () => {
    if (typeof window !== 'undefined') {
        let guestId = localStorage.getItem('mihna_guest_id');
        if (!guestId) {
            guestId = uuidv4();
            localStorage.setItem('mihna_guest_id', guestId);
        }
        return guestId;
    }
    return null;
};


const fetchAPI = async (endpoint, options = {}) => {
    const guestId = getGuestId();
    
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };
    
    if (guestId) {
        headers['x-guest-id'] = guestId;
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
    }

    return data;
};


export const BackendConnector = {
    getTalents: (page = 1, limit = 10) => 
        fetchAPI(`/talents?page=${page}&limit=${limit}`),

    getJobs: () => 
        fetchAPI('/jobs'),
        
    createJob: (jobData) => 
        fetchAPI('/jobs', { 
            method: 'POST', 
            body: JSON.stringify(jobData) 
        }),

    getTrialStatus: () => 
        fetchAPI('/trial/status'),
};