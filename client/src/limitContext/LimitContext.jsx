
import { useEffect, useState, createContext, useContext } from "react";
import { useUser, useAuth } from '@clerk/clerk-react';
import axios from 'axios';

export const PremiumLimitContext = createContext()

export const LimitProvider = ({ children }) => {
    const [limit, setLimit] = useState(0);
    const [isPremium, setIsPremium] = useState(false);
    const [loading, setLoading] = useState(true);
    const { user, isSignedIn } = useUser();
    const { getToken } = useAuth();

    const API_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:5000';

    // Fetch user's subscription and usage from backend
    const fetchUserLimit = async () => {
        if (!isSignedIn || !user) {
            setLoading(false);
            return;
        }

        try {
            const token = await getToken();
            
            // Get subscription status
            const subResponse = await axios.get(`${API_URL}/api/subscription/my-subscription`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            if (subResponse.data.success) {
                const subscription = subResponse.data.subscription;
                const isUserPremium = subscription.plan === 'pro';
                setIsPremium(isUserPremium);
                
                if (!isUserPremium) {
                    // Get free usage from backend
                    const usageResponse = await axios.get(`${API_URL}/api/user/free-usage`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    
                    if (usageResponse.data.success) {
                        setLimit(usageResponse.data.usage);
                        localStorage.setItem('limit', usageResponse.data.usage);
                    } else {
                        // Fallback to localStorage
                        const savedLimit = localStorage.getItem('limit');
                        setLimit(savedLimit ? Number(savedLimit) : 0);
                    }
                } else {
                    // Premium users have no limit
                    setLimit(0);
                }
            }
        } catch (error) {
            console.error('Error fetching limit:', error);
            // Fallback to localStorage
            const savedLimit = localStorage.getItem('limit');
            setLimit(savedLimit ? Number(savedLimit) : 0);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserLimit();
    }, [isSignedIn, user]);

    const setPremiumLimit = async () => {
        if (isPremium) return; // Premium users don't have limits
        
        try {
            const token = await getToken();
            const response = await axios.post(`${API_URL}/api/user/increment-free-usage`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            if (response.data.success) {
                const newLimit = response.data.usage;
                setLimit(newLimit);
                localStorage.setItem('limit', newLimit);
            } else {
                // Fallback to local
                const newLimit = limit + 1;
                setLimit(newLimit);
                localStorage.setItem('limit', newLimit);
            }
        } catch (error) {
            // Fallback to local if backend fails
            const newLimit = limit + 1;
            setLimit(newLimit);
            localStorage.setItem('limit', newLimit);
        }
    };

    const checkFeatureAccess = (feature) => {
        if (isPremium) return { hasAccess: true, remaining: Infinity };
        
        const limits = {
            'article': 10,
            'blog-title': 20,
            'image': 0,
            'background-removal': 0,
            'object-removal': 0,
            'resume-review': 0
        };
        
        const maxLimit = limits[feature] || 0;
        const remaining = Math.max(0, maxLimit - limit);
        const hasAccess = remaining > 0;
        
        return { hasAccess, remaining, maxLimit };
    };

    return (
        <PremiumLimitContext.Provider value={{ 
            limit, 
            setPremiumLimit, 
            isPremium, 
            loading,
            checkFeatureAccess,
            refreshLimit: fetchUserLimit 
        }}>
            {children}
        </PremiumLimitContext.Provider>
    );
};