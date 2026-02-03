export interface Course {
    id: string;
    title: string;
    titleHi: string;
    titleTe: string;
    provider: string;
    duration: string;
    type: 'free' | 'paid';
    price?: string;
    url: string;
    skills: string[];
    description: string;
    descriptionHi: string;
    descriptionTe: string;
}

// Courses mapped to job types
export const JOB_COURSES: Record<string, Course[]> = {
    // Quick Commerce / Delivery Jobs
    'delivery': [
        {
            id: 'del-1',
            title: 'Road Safety & Traffic Rules',
            titleHi: 'सड़क सुरक्षा और यातायात नियम',
            titleTe: 'రోడ్డు భద్రత & ట్రాఫిక్ నియమాలు',
            provider: 'Govt. of India - iGOT',
            duration: '2 hours',
            type: 'free',
            url: 'https://igot.gov.in/',
            skills: ['Traffic Rules', 'Road Safety', 'License Knowledge'],
            description: 'Learn essential traffic rules and road safety for delivery professionals',
            descriptionHi: 'डिलीवरी पेशेवरों के लिए आवश्यक यातायात नियम और सड़क सुरक्षा सीखें',
            descriptionTe: 'డెలివరీ ప్రొఫెషనల్స్ కోసం అవసరమైన ట్రాఫిక్ నియమాలు మరియు రోడ్డు భద్రతను నేర్చుకోండి'
        },
        {
            id: 'del-2',
            title: 'Customer Service Excellence',
            titleHi: 'उत्कृष्ट ग्राहक सेवा',
            titleTe: 'కస్టమర్ సర్వీస్ ఎక్సలెన్స్',
            provider: 'Swiggy Skills',
            duration: '1.5 hours',
            type: 'free',
            url: 'https://www.swiggy.com/',
            skills: ['Communication', 'Problem Solving', 'Customer Handling'],
            description: 'Master customer interaction and service skills for better ratings',
            descriptionHi: 'बेहतर रेटिंग के लिए ग्राहक बातचीत और सेवा कौशल में महारत हासिल करें',
            descriptionTe: 'మెరుగైన రేటింగ్‌ల కోసం కస్టమర్ ఇంటరాక్షన్ మరియు సర్వీస్ స్కిల్స్‌ను నేర్చుకోండి'
        },
        {
            id: 'del-3',
            title: 'Basic Vehicle Maintenance',
            titleHi: 'बुनियादी वाहन रखरखाव',
            titleTe: 'ప్రాథమిక వాహన నిర్వహణ',
            provider: 'NSDC Skill India',
            duration: '3 hours',
            type: 'free',
            url: 'https://www.skillindiadigital.gov.in/',
            skills: ['Bike Maintenance', 'Basic Repairs', 'Fuel Efficiency'],
            description: 'Learn to maintain your vehicle and reduce repair costs',
            descriptionHi: 'अपने वाहन का रखरखाव करना और मरम्मत की लागत कम करना सीखें',
            descriptionTe: 'మీ వాహనాన్ని నిర్వహించడం మరియు మరమ్మత్తు ఖర్చులను తగ్గించడం నేర్చుకోండి'
        }
    ],
    // Warehouse Jobs
    'warehouse': [
        {
            id: 'wh-1',
            title: 'Warehouse Operations Basics',
            titleHi: 'वेयरहाउस संचालन की मूल बातें',
            titleTe: 'వేర్‌హౌస్ ఆపరేషన్స్ బేసిక్స్',
            provider: 'Amazon Career Choice',
            duration: '4 hours',
            type: 'free',
            url: 'https://www.amazoncareerchoice.com/',
            skills: ['Inventory Management', 'Safety Protocols', 'Logistics'],
            description: 'Fundamentals of warehouse operations and inventory management',
            descriptionHi: 'वेयरहाउस संचालन और इन्वेंट्री प्रबंधन की बुनियादी बातें',
            descriptionTe: 'వేర్‌హౌస్ ఆపరేషన్స్ మరియు ఇన్వెంటరీ మేనేజ్‌మెంట్ యొక్క ప్రాథమిక అంశాలు'
        },
        {
            id: 'wh-2',
            title: 'Forklift Operation Certificate',
            titleHi: 'फोर्कलिफ्ट ऑपरेशन सर्टिफिकेट',
            titleTe: 'ఫోర్క్‌లిఫ్ట్ ఆపరేషన్ సర్టిఫికేట్',
            provider: 'Industrial Training Institute',
            duration: '2 days',
            type: 'paid',
            price: '₹2,500',
            url: 'https://dgt.gov.in/iti',
            skills: ['Forklift Operation', 'Load Management', 'Safety'],
            description: 'Get certified to operate forklifts and increase your earning potential',
            descriptionHi: 'फोर्कलिफ्ट चलाने के लिए प्रमाणित हों और अपनी कमाई की संभावना बढ़ाएं',
            descriptionTe: 'ఫోర్క్‌లిఫ్ట్‌లను ఆపరేట్ చేయడానికి సర్టిఫై అవ్వండి మరియు మీ సంపాదన సామర్థ్యాన్ని పెంచుకోండి'
        }
    ],
    // Security Jobs
    'security': [
        {
            id: 'sec-1',
            title: 'Security Guard Training',
            titleHi: 'सुरक्षा गार्ड प्रशिक्षण',
            titleTe: 'సెక్యూరిటీ గార్డ్ ట్రైనింగ్',
            provider: 'PSARA Certified',
            duration: '2 weeks',
            type: 'paid',
            price: '₹5,000',
            url: 'https://www.psara.gov.in/',
            skills: ['Security Protocols', 'Emergency Response', 'Surveillance'],
            description: 'PSARA certified security training for professional security roles',
            descriptionHi: 'पेशेवर सुरक्षा भूमिकाओं के लिए PSARA प्रमाणित सुरक्षा प्रशिक्षण',
            descriptionTe: 'ప్రొఫెషనల్ సెక్యూరిటీ రోల్స్ కోసం PSARA సర్టిఫైడ్ సెక్యూరిటీ ట్రైనింగ్'
        },
        {
            id: 'sec-2',
            title: 'First Aid & Emergency Response',
            titleHi: 'प्राथमिक चिकित्सा और आपातकालीन प्रतिक्रिया',
            titleTe: 'ఫస్ట్ ఎయిడ్ & ఎమర్జెన్సీ రెస్పాన్స్',
            provider: 'Red Cross India',
            duration: '1 day',
            type: 'paid',
            price: '₹500',
            url: 'https://www.indianredcross.org/',
            skills: ['First Aid', 'CPR', 'Emergency Handling'],
            description: 'Essential first aid skills for security professionals',
            descriptionHi: 'सुरक्षा पेशेवरों के लिए आवश्यक प्राथमिक चिकित्सा कौशल',
            descriptionTe: 'సెక్యూరిటీ ప్రొఫెషనల్స్ కోసం అవసరమైన ఫస్ట్ ఎయిడ్ స్కిల్స్'
        }
    ],
    // Fleet Manager / Leadership Jobs
    'management': [
        {
            id: 'mgmt-1',
            title: 'Team Leadership Fundamentals',
            titleHi: 'टीम नेतृत्व की मूल बातें',
            titleTe: 'టీమ్ లీడర్‌షిప్ ఫండమెంటల్స్',
            provider: 'Coursera (Google)',
            duration: '6 hours',
            type: 'free',
            url: 'https://www.coursera.org/',
            skills: ['Leadership', 'Team Management', 'Communication'],
            description: 'Learn to lead teams effectively and manage fleet operations',
            descriptionHi: 'टीमों का प्रभावी नेतृत्व करना और बेड़े संचालन का प्रबंधन करना सीखें',
            descriptionTe: 'టీమ్‌లను సమర్థవంతంగా నడిపించడం మరియు ఫ్లీట్ ఆపరేషన్లను నిర్వహించడం నేర్చుకోండి'
        },
        {
            id: 'mgmt-2',
            title: 'Basic Computer & Excel Skills',
            titleHi: 'बुनियादी कंप्यूटर और एक्सेल कौशल',
            titleTe: 'బేసిక్ కంప్యూటర్ & ఎక్సెల్ స్కిల్స్',
            provider: 'Microsoft Learn',
            duration: '4 hours',
            type: 'free',
            url: 'https://learn.microsoft.com/',
            skills: ['MS Excel', 'Data Entry', 'Reporting'],
            description: 'Essential computer skills for management positions',
            descriptionHi: 'प्रबंधन पदों के लिए आवश्यक कंप्यूटर कौशल',
            descriptionTe: 'మేనేజ్‌మెంట్ పొజిషన్స్ కోసం అవసరమైన కంప్యూటర్ స్కిల్స్'
        },
        {
            id: 'mgmt-3',
            title: 'Fleet Management Certification',
            titleHi: 'बेड़ा प्रबंधन प्रमाणन',
            titleTe: 'ఫ్లీట్ మేనేజ్‌మెంట్ సర్టిఫికేషన్',
            provider: 'Udemy',
            duration: '8 hours',
            type: 'paid',
            price: '₹1,999',
            url: 'https://www.udemy.com/',
            skills: ['Fleet Operations', 'Route Optimization', 'Cost Management'],
            description: 'Comprehensive fleet management course for career growth',
            descriptionHi: 'करियर विकास के लिए व्यापक बेड़ा प्रबंधन पाठ्यक्रम',
            descriptionTe: 'కెరీర్ వృద్ధి కోసం సమగ్ర ఫ్లీట్ మేనేజ్‌మెంట్ కోర్స్'
        }
    ],
    // General / All Jobs
    'general': [
        {
            id: 'gen-1',
            title: 'Digital Literacy',
            titleHi: 'डिजिटल साक्षरता',
            titleTe: 'డిజిటల్ లిటరసీ',
            provider: 'PMGDISHA',
            duration: '20 hours',
            type: 'free',
            url: 'https://www.pmgdisha.in/',
            skills: ['Smartphone Usage', 'Internet', 'Digital Payments'],
            description: 'Basic digital skills for everyday work',
            descriptionHi: 'रोजमर्रा के काम के लिए बुनियादी डिजिटल कौशल',
            descriptionTe: 'రోజువారీ పని కోసం ప్రాథమిక డిజిటల్ స్కిల్స్'
        },
        {
            id: 'gen-2',
            title: 'English Speaking Basics',
            titleHi: 'अंग्रेजी बोलने की मूल बातें',
            titleTe: 'ఇంగ్లీష్ స్పీకింగ్ బేసిక్స్',
            provider: 'Duolingo',
            duration: '10 mins/day',
            type: 'free',
            url: 'https://www.duolingo.com/',
            skills: ['Basic English', 'Communication', 'Customer Interaction'],
            description: 'Improve English skills for better customer interactions',
            descriptionHi: 'बेहतर ग्राहक बातचीत के लिए अंग्रेजी कौशल में सुधार करें',
            descriptionTe: 'మెరుగైన కస్టమర్ ఇంటరాక్షన్స్ కోసం ఇంగ్లీష్ స్కిల్స్ మెరుగుపరచండి'
        },
        {
            id: 'gen-3',
            title: 'Financial Literacy for Workers',
            titleHi: 'श्रमिकों के लिए वित्तीय साक्षरता',
            titleTe: 'వర్కర్ల కోసం ఫైనాన్షియల్ లిటరసీ',
            provider: 'RBI - Financial Literacy',
            duration: '3 hours',
            type: 'free',
            url: 'https://rbi.org.in/',
            skills: ['Savings', 'Banking', 'Investment Basics'],
            description: 'Learn to manage your money and plan for the future',
            descriptionHi: 'अपने पैसे का प्रबंधन करना और भविष्य की योजना बनाना सीखें',
            descriptionTe: 'మీ డబ్బును నిర్వహించడం మరియు భవిష్యత్తు కోసం ప్లాన్ చేయడం నేర్చుకోండి'
        }
    ]
};

// Map job titles to course categories
export function getCoursesForJob(jobTitle: string): Course[] {
    const title = jobTitle.toLowerCase();
    
    if (title.includes('delivery') || title.includes('runner') || title.includes('rider') || title.includes('commerce')) {
        return [...JOB_COURSES.delivery, ...JOB_COURSES.general.slice(0, 1)];
    }
    if (title.includes('warehouse') || title.includes('associate') || title.includes('picker') || title.includes('packer')) {
        return [...JOB_COURSES.warehouse, ...JOB_COURSES.general.slice(0, 1)];
    }
    if (title.includes('security') || title.includes('guard')) {
        return [...JOB_COURSES.security, ...JOB_COURSES.general.slice(0, 1)];
    }
    if (title.includes('manager') || title.includes('lead') || title.includes('supervisor')) {
        return [...JOB_COURSES.management, ...JOB_COURSES.general.slice(0, 1)];
    }
    
    // Default: return general courses
    return JOB_COURSES.general;
}
