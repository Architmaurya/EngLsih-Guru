/**
 * Course and lesson data for English Guru.
 * Course 1: first 3 lessons unlocked, rest locked.
 * Other courses: if course is unlocked, all lessons unlocked; if locked, all lessons locked.
 * Images: assets/course/c1.png to c8.png
 */
function withUnlockFirstN(lessons, n) {
  return lessons.map((l, i) => ({ ...l, unlocked: i < n }));
}
function withUnlock(lessons, courseUnlocked) {
  return lessons.map((l) => ({ ...l, unlocked: !!courseUnlocked }));
}


export const courses = [
  {
    id: '1',
    unlocked: true,
    titleHi: 'रोज़ाना की बातचीत',
    titleEn: 'Daily Conversations',
    image: require('../../assets/course/c1.png'),
    lessons: withUnlockFirstN([
      { id: '1-1', title: 'अभिवादन के सामान्य वाक्य', titleEn: 'Greetings & Hello', completed: true },
      { id: '1-2', title: 'परिवार से जुड़े शब्द', titleEn: 'Family Members', completed: false },
      { id: '1-3', title: 'सप्ताह के दिन', titleEn: 'Days of the Week', completed: false },
      { id: '1-4', title: 'क्रिया शब्द', titleEn: 'Action Words', completed: false },
      { id: '1-5', title: 'बाज़ार में बातचीत', titleEn: 'Market Conversation', completed: false },
      { id: '1-6', title: 'डॉक्टर से बातचीत | Part-1', titleEn: 'Doctor Conversation | Part-1', completed: false },
      { id: '1-7', title: 'डॉक्टर से बातचीत | Part-2', titleEn: 'Doctor Conversation | Part-2', completed: false },
      { id: '1-8', title: 'रेस्टोरेंट में बोलचाल', titleEn: 'Restaurant Conversation', completed: false },
      { id: '1-9', title: 'बैंक से जुड़ी बातचीत | Part -1', titleEn: 'Bank Conversation | Part-1', completed: false },
      { id: '1-10', title: 'बैंक से जुड़ी बातचीत | Part -2', titleEn: 'Bank Conversation | Part-2', completed: false },
    ], 3),
  },
  {
    id: '2',
    unlocked: false,
    titleHi: 'बच्चों का होमवर्क',
    titleEn: "Kids' Homework",
    image: require('../../assets/course/c2.png'),
    lessons: withUnlock([
      { id: '2-1', title: 'स्कूल की ज़रूरी वस्तुएँ | Part-1', completed: false },
      { id: '2-2', title: 'स्कूल की ज़रूरी वस्तुएँ | Part-2', completed: false },
      { id: '2-3', title: 'अंग्रेज़ी में गिनती सीखें', completed: false },
      { id: '2-4', title: 'गणित की मूल शब्दावली', completed: false },
      { id: '2-5', title: 'बच्चे को प्रोत्साहित करना', completed: false },
      { id: '2-6', title: 'स्कूल की PTM | Part-1', completed: false },
      { id: '2-7', title: 'स्कूल की PTM | Part-2', completed: false },
      { id: '2-8', title: 'छुट्टी के लिए आवेदन लिखना', completed: false },
      { id: '2-9', title: 'बच्चों में पढ़ने की आदत विकसित करें', completed: false },
    ],false),
  },
  {
    id: '3',
    unlocked: false,
    titleHi: 'रसोई और घर',
    titleEn: 'Kitchen and Household',
    image: require('../../assets/course/c3.png'),
    lessons: withUnlock([
      { id: '3-1', title: 'मसाले और दालों के नाम | Part-1', completed: false },
      { id: '3-2', title: 'मसाले और दालों के नाम | Part-2', completed: false },
      { id: '3-3', title: 'फलों के नाम', completed: false },
      { id: '3-4', title: 'रसोई के ज़रूरी उपकरण | Part-1', completed: false },
      { id: '3-5', title: 'रसोई के ज़रूरी उपकरण | Part-2', completed: false },
      { id: '3-6', title: 'घरेलू कामकाज की बातचीत | Part-1', completed: false },
      { id: '3-7', title: 'घरेलू कामकाज की बातचीत | Part-2', completed: false },
      { id: '3-8', title: 'मेवों के नाम', completed: false },
      { id: '3-9', title: 'भोजन की शब्दावली | Part-1', completed: false },
      { id: '3-10', title: 'भोजन की शब्दावली | Part-2', completed: false },
    ], false),
  },
  {
    id: '4',
    unlocked: false,
    titleHi: 'काम और रोज़गार',
    titleEn: 'Work and Employment',
    image: require('../../assets/course/c4.png'),
    lessons: withUnlock([
      { id: '4-1', title: 'विभिन्न प्रकार की नौकरियाँ', completed: false },
      { id: '4-2', title: 'नौकरी ढूँढने की बातचीत | Part-1', completed: false },
      { id: '4-3', title: 'नौकरी ढूँढने की बातचीत | Part-2', completed: false },
      { id: '4-4', title: 'रोज़मर्रा के काम की बातें | Part-1', completed: false },
      { id: '4-5', title: 'रोज़मर्रा के काम की बातें | Part-2', completed: false },
      { id: '4-6', title: 'ग्राहक से बातचीत | Part-1', completed: false },
      { id: '4-7', title: 'ग्राहक से बातचीत | Part-2', completed: false },
      { id: '4-8', title: 'गलती स्वीकार करना', completed: false },
    ]),
  },
  {
    id: '5',
    unlocked: false,
    titleHi: 'प्रकृति को समझना',
    titleEn: 'Understanding Nature',
    image: require('../../assets/course/c5.png'),
    lessons: withUnlock([
      { id: '5-1', title: 'जानवर और उनके बच्चे', completed: false },
      { id: '5-2', title: 'जल में रहने वाले जानवर', completed: false },
      { id: '5-3', title: 'पक्षियों के नाम', completed: false },
      { id: '5-4', title: 'पालतू जानवर', completed: false },
      { id: '5-5', title: 'फूलों के नाम', completed: false },
      { id: '5-6', title: 'कीड़े-मकोड़ों के नाम', completed: false },
      { id: '5-7', title: 'जंगली जानवर', completed: false },
    ], false),
  },
  {
    id: '6',
    unlocked: false,
    titleHi: 'सामान्य ज्ञान',
    titleEn: 'General Knowledge',
    image: require('../../assets/course/c6.png'),
    lessons: withUnlock([
      { id: '6-1', title: 'एयरपोर्ट की ज़रूरी बातचीत', completed: false },
      { id: '6-2', title: 'मानव शरीर के अंग', completed: false },
      { id: '6-3', title: 'रंगों के नाम', completed: false },
      { id: '6-4', title: 'प्यार भरी बातें', completed: false },
      { id: '6-5', title: 'राजनीति के सामान्य शब्द', completed: false },
      { id: '6-6', title: 'वाहनों के नाम', completed: false },
    ], false),
  },
  {
    id: '7',
    unlocked: false,
    titleHi: 'एडवांस्ड इंग्लिश',
    titleEn: 'Advanced English',
    image: require('../../assets/course/c7.png'),
    lessons: withUnlock([
      { id: '7-1', title: 'पैसे की समझ | Part-1', completed: false },
      { id: '7-2', title: 'पैसे की समझ | Part-2', completed: false },
      { id: '7-3', title: 'ऑफिस की बातचीत | Part-1', completed: false },
      { id: '7-4', title: 'ऑफिस की बातचीत | Part-2', completed: false },
      { id: '7-5', title: 'सफर से जुड़ी बातचीत | Part-1', completed: false },
      { id: '7-6', title: 'सफर से जुड़ी बातचीत | Part-2', completed: false },
      { id: '7-7', title: 'खरीदारी की बातचीत | Part-1', completed: false },
      { id: '7-8', title: 'खरीदारी की बातचीत | Part-2', completed: false },
      { id: '7-9', title: 'बस स्टैंड पर बातचीत | Part-1', completed: false },
      { id: '7-10', title: 'बस स्टैंड पर बातचीत | Part-2', completed: false },
      { id: '7-11', title: 'नाराज़गी जताने के वाक्य', completed: false },
    ], false),
  },
  {
    id: '8',
    unlocked: false,
    titleHi: 'रैंडम कम्युनिकेशन',
    titleEn: 'Random Communications',
    image: require('../../assets/course/c8.png'),
    lessons: withUnlock([
      { id: '8-1', title: 'बोलचाल की ज़रूरी बातें | Part-1', completed: false },
      { id: '8-2', title: 'बोलचाल की ज़रूरी बातें | Part-2', completed: false },
      { id: '8-3', title: 'बोलचाल की ज़रूरी बातें | Part-3', completed: false },
      { id: '8-4', title: 'बोलचाल की ज़रूरी बातें | Part-4', completed: false },
      { id: '8-5', title: 'बोलचाल की ज़रूरी बातें | Part-5', completed: false },
      { id: '8-6', title: 'बोलचाल की ज़रूरी बातें | Part-6', completed: false },
      { id: '8-7', title: 'बोलचाल की ज़रूरी बातें | Part-7', completed: false },
      { id: '8-8', title: 'बोलचाल की ज़रूरी बातें | Part-8', completed: false },
      { id: '8-9', title: 'बोलचाल की ज़रूरी बातें | Part-9', completed: false },
      { id: '8-10', title: 'बोलचाल की ज़रूरी बातें | Part-10', completed: false },
    ], false),
  },
];
