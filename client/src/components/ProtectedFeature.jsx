
import { useContext } from 'react';
import { PremiumLimitContext } from '../limitContext/LimitContext';
import { Crown, AlertCircle } from 'lucide-react';

const ProtectedFeature = ({ feature, children, fallback, showUpgrade = true }) => {
    const { isPremium, checkFeatureAccess, loading } = useContext(PremiumLimitContext);
    
    if (loading) {
        return (
            <div className="flex items-center justify-center py-8">
                <div className="w-8 h-8 border-2 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
            </div>
        );
    }
    
    const { hasAccess, remaining, maxLimit } = checkFeatureAccess(feature);
    
    if (!hasAccess) {
        if (fallback) return fallback;
        
        if (!isPremium && showUpgrade) {
            return (
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6 text-center border border-amber-200">
                    <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Crown className="w-8 h-8 text-amber-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Premium Feature</h3>
                    <p className="text-gray-600 text-sm mb-4">
                        {maxLimit > 0 
                            ? `You've used all ${maxLimit} free ${feature} generations. `
                            : `This feature is only available for premium users. `}
                        Upgrade to Pro to unlock unlimited access.
                    </p>
                    <button 
                        onClick={() => window.location.href = '/pricing'}
                        className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
                    >
                        Upgrade to Pro
                    </button>
                </div>
            );
        }
        
        return (
            <div className="bg-red-50 rounded-xl p-6 text-center border border-red-200">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
                <p className="text-red-600">You've reached your free limit for this feature.</p>
            </div>
        );
    }
    
    return children;
};

export default ProtectedFeature;