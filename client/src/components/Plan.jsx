import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser, useClerk, useAuth } from '@clerk/clerk-react';
import { motion } from 'framer-motion';
import { 
  Check, Crown, Star, Zap, Shield, Rocket,
  CreditCard, Wallet, Loader2, AlertCircle, ArrowRight, RefreshCw
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:5000';

const Plan = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isSignedIn } = useUser();
  const { openSignIn } = useClerk();
  const { getToken } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState('pro');
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [isLoading, setIsLoading] = useState(false);
  const [exchangeRates, setExchangeRates] = useState(null);
  const [plans, setPlans] = useState(null);
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [isBillingYearly, setIsBillingYearly] = useState(false);
  const [isLoadingSubscription, setIsLoadingSubscription] = useState(true);
  const [ratesError, setRatesError] = useState(false);
  const [isRefreshingRates, setIsRefreshingRates] = useState(false);
  
  const hasFetched = useRef(false);
  const isOnPricingPage = location.pathname === '/pricing';

  // Supported currencies
  const currencies = [
    { code: 'USD', symbol: '$', name: 'US Dollar', rate: 1 },
    { code: 'GBP', symbol: '£', name: 'British Pound', rate: 0.79 },
    { code: 'EUR', symbol: '€', name: 'Euro', rate: 0.93 },
    { code: 'NGN', symbol: '₦', name: 'Nigerian Naira', rate: 1500 },
    { code: 'GHS', symbol: '₵', name: 'Ghanaian Cedi', rate: 15.5 },
    { code: 'KES', symbol: 'KSh', name: 'Kenyan Shilling', rate: 130 },
    { code: 'ZAR', symbol: 'R', name: 'South African Rand', rate: 18.5 },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', rate: 1.35 },
    { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', rate: 1.52 }
  ];

  // Fetch exchange rates and plans - NO ERROR TOAST
  useEffect(() => {
    if (!isOnPricingPage) return;
    if (hasFetched.current) return;
    hasFetched.current = true;
    
    const fetchData = async () => {
      try {
        setRatesError(false);
        
        const [ratesRes, plansRes] = await Promise.all([
          axios.get(`${API_URL}/api/subscription/exchange-rates`),
          axios.get(`${API_URL}/api/subscription/plans`)
        ]);
        
        setExchangeRates(ratesRes.data);
        setPlans(plansRes.data);
        
      } catch (error) {
        console.error('Error fetching data:', error);
        setRatesError(true);
        // ✅ NO TOAST ERROR HERE - removed
      }
    };
    
    fetchData();
  }, [isOnPricingPage]);

  const refreshRates = async () => {
    setIsRefreshingRates(true);
    try {
      const ratesRes = await axios.get(`${API_URL}/api/subscription/exchange-rates`);
      setExchangeRates(ratesRes.data);
      setRatesError(false);
      toast.success('Exchange rates updated!');
    } catch (error) {
      console.error('Error refreshing rates:', error);
      // ✅ Silent fail - no error toast
    } finally {
      setIsRefreshingRates(false);
    }
  };

  const fetchCurrentSubscription = async () => {
    try {
      const token = await getToken();
      const response = await axios.get(`${API_URL}/api/subscription/my-subscription`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCurrentSubscription(response.data.subscription);
    } catch (error) {
      console.error('Error fetching subscription:', error);
      // ✅ Silent fail - no error toast
    } finally {
      setIsLoadingSubscription(false);
    }
  };

  useEffect(() => {
    if (!isSignedIn || !isOnPricingPage) {
      setIsLoadingSubscription(false);
      return;
    }
    fetchCurrentSubscription();
  }, [isSignedIn, isOnPricingPage]);

  const getConvertedPrice = (priceInUSD) => {
    const currency = currencies.find(c => c.code === selectedCurrency);
    const rate = currency?.rate || 1;
    return (priceInUSD * rate).toFixed(2);
  };

  const getCurrencySymbol = () => {
    const currency = currencies.find(c => c.code === selectedCurrency);
    return currency?.symbol || '$';
  };

  const handleFreePlanClick = () => {
    if (isSignedIn) {
      navigate('/ai');
    } else {
      openSignIn();
    }
  };

  const handleFlutterwavePayment = async () => {
    if (!isSignedIn) {
      openSignIn();
      return;
    }

    setIsLoading(true);
    
    try {
      const token = await getToken();
      const phoneNumber = user?.phoneNumbers?.[0]?.phoneNumber || '';
      
      const response = await axios.post(
        `${API_URL}/api/subscription/initialize-payment`,
        {
          plan: selectedPlan,
          currency: selectedCurrency,
          returnUrl: `${window.location.origin}/pricing`,
          phone: phoneNumber
        },
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        const { paymentLink, transactionReference, subscriptionId } = response.data.data;
        
        sessionStorage.setItem('pendingSubscription', JSON.stringify({
          txRef: transactionReference,
          subscriptionId,
          plan: selectedPlan,
          currency: selectedCurrency
        }));
        
        window.location.href = paymentLink;
      } else {
        // ✅ Only show error on explicit failure
        toast.error(response.data.message || 'Failed to initialize payment');
      }
    } catch (error) {
      console.error('Payment initialization error:', error);
      // ✅ Only show error on explicit failure
      if (error.response?.data?.message !== 'Payment configuration error. Please contact support.') {
        toast.error('Payment initialization failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const planFeatures = {
    free: {
      name: 'Free',
      price: 0,
      priceYearly: 0,
      icon: Star,
      gradient: 'from-gray-400 to-gray-600',
      features: [
        'AI Article Writer (10/month)',
        'Blog Title Generator (20/month)',
        'Basic Support',
        'Community Access'
      ],
      notIncluded: [
        'AI Image Generation',
        'Background Removal',
        'Object Removal',
        'Resume Reviewer',
        'Priority Support',
        'API Access'
      ]
    },
    pro: {
      name: 'Pro',
      price: 10,
      priceYearly: 96,
      icon: Crown,
      gradient: 'from-purple-500 to-pink-500',
      features: [
        'Unlimited AI Article Writer',
        'Unlimited Blog Title Generator',
        'Unlimited Resume Reviewer',
        'AI Image Generation (50/month)',
        'Background Removal (30/month)',
        'Object Removal (20/month)',        
        'Priority Support',
        'API Access',
        'Advanced Analytics'
      ],
      notIncluded: []
    }
  };

  const currentPlan = planFeatures[selectedPlan];
  const currentPrice = isBillingYearly ? currentPlan.priceYearly : currentPlan.price;
  const convertedPrice = getConvertedPrice(currentPrice);
  const currencySymbol = getCurrencySymbol();
  const hasActivePro = currentSubscription?.plan === 'pro' && currentSubscription?.status === 'active';

  // Return null if not on pricing page
  if (!isOnPricingPage) {
    return null;
  }

  if (isLoadingSubscription) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen py-20 px-4 overflow-hidden bg-gradient-to-b from-gray-50 via-white to-gray-50">
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-100 rounded-full filter blur-3xl opacity-30"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-100 rounded-full filter blur-3xl opacity-30"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-100 rounded-full filter blur-3xl opacity-20"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full px-4 py-2 mb-6">
            <Zap className="w-4 h-4 text-purple-600" />
            <span className="text-purple-600 text-sm font-semibold">Pricing</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 bg-clip-text text-transparent mb-4">
            Choose Your Plan
          </h1>
          
          <p className="text-gray-500 text-base sm:text-lg max-w-2xl mx-auto">
            Start for free and scale up as you grow. Find the perfect plan for your content creation needs.
          </p>
        </motion.div>

        {/* Currency Selector and Billing Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12"
        >
          {selectedPlan === 'pro' && (
            <div className="flex items-center gap-3 bg-white rounded-full p-1 shadow-md border border-gray-100">
              <button
                onClick={() => setIsBillingYearly(false)}
                className={`px-6 py-2 rounded-full transition-all duration-300 ${
                  !isBillingYearly
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setIsBillingYearly(true)}
                className={`px-6 py-2 rounded-full transition-all duration-300 ${
                  isBillingYearly
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Yearly
                <span className="ml-2 text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">Save 20%</span>
              </button>
            </div>
          )}

          <div className="flex items-center gap-2 bg-white rounded-full p-1 shadow-md border border-gray-100">
            <Wallet className="w-4 h-4 text-gray-500 ml-3" />
            <select
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value)}
              className="bg-transparent py-2 pl-2 pr-8 rounded-full focus:outline-none text-gray-700 cursor-pointer"
            >
              {currencies.map(currency => (
                <option key={currency.code} value={currency.code}>
                  {currency.symbol} {currency.code} - {currency.name}
                </option>
              ))}
            </select>
            {ratesError && (
              <button
                onClick={refreshRates}
                disabled={isRefreshingRates}
                className="ml-1 p-1 text-gray-400 hover:text-purple-600 transition-colors"
                title="Refresh exchange rates"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshingRates ? 'animate-spin' : ''}`} />
              </button>
            )}
          </div>
        </motion.div>

        {/* Only show this subtle indicator if there's an error - no toast */}
        {ratesError && (
          <div className="mb-6 text-center">
            <p className="text-xs text-amber-600 bg-amber-50 inline-block px-3 py-1 rounded-full">
              Using default exchange rates
            </p>
          </div>
        )}

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className={`relative bg-white rounded-3xl shadow-xl border-2 transition-all duration-300 hover:shadow-2xl cursor-pointer ${
              selectedPlan === 'free' ? 'border-purple-500 scale-105' : 'border-gray-100 hover:scale-102'
            }`}
            onClick={() => setSelectedPlan('free')}
          >
            {selectedPlan === 'free' && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-1 rounded-full text-sm font-semibold shadow-lg">
                Selected
              </div>
            )}
            
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-600 rounded-2xl flex items-center justify-center mb-4">
                    <Star className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">Free</h3>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-gray-800">$0</div>
                  <div className="text-gray-500 text-sm">Forever free</div>
                </div>
              </div>
              
              <button
                onClick={handleFreePlanClick}
                className="w-full py-3 rounded-xl font-semibold transition-all duration-300 bg-gray-100 text-gray-700 hover:bg-gray-200 mb-6"
              >
                {isSignedIn ? 'Go to Dashboard' : 'Get Started'}
              </button>
              
              <div className="space-y-3">
                {planFeatures.free.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-sm">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-600">{feature}</span>
                  </div>
                ))}
                {planFeatures.free.notIncluded.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-sm opacity-50">
                    <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex-shrink-0"></div>
                    <span className="text-gray-400">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Pro Plan Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className={`relative bg-gradient-to-br from-white to-purple-50 rounded-3xl shadow-2xl border-2 transition-all duration-300 hover:shadow-3xl cursor-pointer ${
              selectedPlan === 'pro' ? 'border-purple-600 scale-105' : 'border-purple-200 hover:scale-102'
            }`}
            onClick={() => setSelectedPlan('pro')}
          >
            {selectedPlan === 'pro' && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-1 rounded-full text-sm font-semibold shadow-lg">
                Selected
              </div>
            )}
            
            <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-400 to-orange-400 text-white px-3 py-1 rounded-full text-xs font-semibold">
              Most Popular
            </div>
            
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                    <Crown className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">Pro</h3>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-gray-800">
                    {currencySymbol}{convertedPrice}
                  </div>
                  <div className="text-gray-500 text-sm">
                    {isBillingYearly ? 'per year' : 'per month'}
                  </div>
                  {isBillingYearly && (
                    <div className="text-green-600 text-xs mt-1">
                      Save ${(currentPlan.price * 12 - currentPlan.priceYearly).toFixed(0)}/year
                    </div>
                  )}
                </div>
              </div>
              
              <button
                onClick={handleFlutterwavePayment}
                disabled={isLoading || hasActivePro}
                className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:scale-105 active:scale-95 ${
                  (isLoading || hasActivePro) ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                ) : hasActivePro ? (
                  'Current Plan'
                ) : (
                  `Pay ${currencySymbol}${convertedPrice}`
                )}
              </button>
              
              <div className="mt-6 space-y-3">
                {planFeatures.pro.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-sm">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-600">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16 text-center"
        >
          <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-500" />
              <span>Secure payments via Flutterwave</span>
            </div>
            <div className="flex items-center gap-2">
              <Rocket className="w-4 h-4 text-purple-500" />
              <span>Cancel anytime</span>
            </div>
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-blue-500" />
              <span>Multi-currency support</span>
            </div>
          </div>
          
          <p className="text-xs text-gray-400 mt-8">
            You'll be redirected to Flutterwave's secure payment page.
            <br />All prices are in {selectedCurrency}.
          </p>
        </motion.div>
      </div>

      {/* Payment Callback Handler */}
      <PaymentCallback />
    </div>
  );
};

// Payment Callback Handler Component
const PaymentCallback = () => {
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(false);
  const { getToken } = useAuth();
  const { user } = useUser();
  
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const status = urlParams.get('status');
    const txRef = urlParams.get('tx_ref');
    const transactionId = urlParams.get('transaction_id');
    
    if (status === 'successful' && txRef && transactionId) {
      verifyPayment(txRef, transactionId);
    } else if (status === 'cancelled') {
      toast.error('Payment was cancelled');
      window.history.replaceState({}, document.title, '/pricing');
      navigate('/pricing', { replace: true });
    }
  }, []);
  
  const verifyPayment = async (txRef, transactionId) => {
    setIsVerifying(true);
    
    try {
      const token = user ? await getToken() : null;
      const response = await axios.post(`${API_URL}/api/subscription/verify-payment`, {
        transactionReference: txRef,
        transactionId
      }, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      
      if (response.data.success) {
        toast.success('Subscription activated successfully! 🎉');
        sessionStorage.removeItem('pendingSubscription');
        navigate('/dashboard', { replace: true });
      } else {
        toast.error('Payment verification failed. Please contact support.');
        navigate('/pricing', { replace: true });
      }
    } catch (error) {
      console.error('Verification error:', error);
      toast.error('Error verifying payment');
      navigate('/pricing', { replace: true });
    } finally {
      setIsVerifying(false);
      window.history.replaceState({}, document.title, '/pricing');
    }
  };
  
  if (isVerifying) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 text-center max-w-md mx-4">
          <Loader2 className="w-16 h-16 animate-spin text-purple-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Verifying Payment</h3>
          <p className="text-gray-500 text-sm">
            Please wait while we confirm your payment and activate your subscription...
          </p>
        </div>
      </div>
    );
  }
  
  return null;
};

export default Plan;