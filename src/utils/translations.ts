export const translations = {
  en: {
    // Navigation
    login: "Login",
    register: "Register",
    logout: "Logout",
    dashboard: "Dashboard",
    profile: "Profile",
    
    // Landing Page
    heroTitle: "Ved-Aahaar",
    heroSubtitle: "Holistic Nutrition. Rooted in Ayurveda. Powered by AI.",
    heroDescription: "Discover personalized nutrition plans that honor ancient Vedic wisdom while embracing modern technology for optimal health and wellness.",
    getStarted: "Get Started",
    startYourJourney: "Start Your Journey",
    
    // Features
    aiDietGenerator: "AI-Powered Diet Generator",
    calorieTracker: "Calorie Tracker",
    doctorConnectivity: "Doctor Connectivity",
    ancientWisdom: "Ancient Wisdom, Modern Solutions",
    expertGuidance: "Expert Guidance",
    
    // Dashboard
    welcomeBack: "Welcome back",
    continueJourney: "Continue your Ayurvedic wellness journey",
    daysActive: "Days Active",
    wellnessScore: "Wellness Score",
    doshaBalance: "Dosha Balance",
    availableRecipes: "Available Recipes",
    
    // Diet Generator
    dietGenerator: "Diet Generator",
    generateDiet: "Generate Diet Plan",
    downloadPDF: "Download PDF",
    
    // Chat
    chat: "Chat",
    sendMessage: "Send Message",
    typeMessage: "Type your message...",
    
    // Notifications
    notifications: "Notifications",
    markAsRead: "Mark as Read",
    
    // Profile
    updateProfile: "Update Profile",
    name: "Name",
    age: "Age",
    height: "Height",
    weight: "Weight",
    gender: "Gender",
    
    // Common
    save: "Save",
    cancel: "Cancel",
    success: "Success",
    error: "Error",
    loading: "Loading...",
    male: "Male",
    female: "Female",
    other: "Other"
  },
  hi: {
    // Navigation
    login: "लॉगिन",
    register: "रजिस्टर",
    logout: "लॉगआउट",
    dashboard: "डैशबोर्ड",
    profile: "प्रोफाइल",
    
    // Landing Page
    heroTitle: "वेद-आहार",
    heroSubtitle: "समग्र पोषण। आयुर्वेद में निहित। AI द्वारा संचालित।",
    heroDescription: "व्यक्तिगत पोषण योजनाओं की खोज करें जो प्राचीन वैदिक ज्ञान का सम्मान करते हुए इष्टतम स्वास्थ्य और कल्याण के लिए आधुनिक तकनीक को अपनाती हैं।",
    getStarted: "शुरू करें",
    startYourJourney: "अपनी यात्रा शुरू करें",
    
    // Features
    aiDietGenerator: "AI-संचालित आहार जनरेटर",
    calorieTracker: "कैलोरी ट्रैकर",
    doctorConnectivity: "डॉक्टर कनेक्टिविटी",
    ancientWisdom: "प्राचीन ज्ञान, आधुनिक समाधान",
    expertGuidance: "विशेषज्ञ मार्गदर्शन",
    
    // Dashboard
    welcomeBack: "वापस स्वागत है",
    continueJourney: "अपनी आयुर्वेदिक कल्याण यात्रा जारी रखें",
    daysActive: "सक्रिय दिन",
    wellnessScore: "कल्याण स्कोर",
    doshaBalance: "दोष संतुलन",
    availableRecipes: "उपलब्ध व्यंजन",
    
    // Diet Generator
    dietGenerator: "आहार जनरेटर",
    generateDiet: "आहार योजना बनाएं",
    downloadPDF: "PDF डाउनलोड करें",
    
    // Chat
    chat: "चैट",
    sendMessage: "संदेश भेजें",
    typeMessage: "अपना संदेश टाइप करें...",
    
    // Notifications
    notifications: "सूचनाएं",
    markAsRead: "पढ़े गए के रूप में चिह्नित करें",
    
    // Profile
    updateProfile: "प्रोफाइल अपडेट करें",
    name: "नाम",
    age: "आयु",
    height: "ऊंचाई",
    weight: "वजन",
    gender: "लिंग",
    
    // Common
    save: "सेव करें",
    cancel: "रद्द करें",
    success: "सफलता",
    error: "त्रुटि",
    loading: "लोड हो रहा है...",
    male: "पुरुष",
    female: "महिला",
    other: "अन्य"
  }
};

export const t = (key: string, language: 'en' | 'hi' = 'en'): string => {
  const keys = key.split('.');
  let value: any = translations[language];
  
  for (const k of keys) {
    value = value?.[k];
  }
  
  return value || key;
};