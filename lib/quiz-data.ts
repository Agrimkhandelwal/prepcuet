export interface Question {
    id: number;
    question: string;
    options: string[];
    answer: number; // Index of the correct option (0-3)
}

export const QUIZ_QUESTIONS: Question[] = [
    {
        id: 1,
        question: "Who is known as the 'Father of Indian Constitution'?",
        options: ["Mahatma Gandhi", "Jawaharlal Nehru", "Dr. B.R. Ambedkar", "Sardar Patel"],
        answer: 2
    },
    {
        id: 2,
        question: "Which article of the Indian Constitution deals with the 'Right to Equality'?",
        options: ["Article 12-35", "Article 14-18", "Article 19-22", "Article 23-24"],
        answer: 1
    },
    {
        id: 3,
        question: "The 'Preamble' of the Indian Constitution was borrowed from the constitution of which country?",
        options: ["USA", "UK", "Canada", "France"],
        answer: 0
    },
    {
        id: 4,
        question: "Who appoints the Chief Justice of India?",
        options: ["The Prime Minister", "The President", "The Parliament", "The Law Minister"],
        answer: 1
    },
    {
        id: 5,
        question: "What is the maximum strength of the Lok Sabha?",
        options: ["545", "550", "552", "530"],
        answer: 2
    },
    {
        id: 6,
        question: "Which Five-Year Plan is also known as 'Gadgil Yojana'?",
        options: ["Second Plan", "Third Plan", "Fourth Plan", "Fifth Plan"],
        answer: 1
    },
    {
        id: 7,
        question: "Who was the first Governor-General of independent India?",
        options: ["C. Rajagopalachari", "Lord Mountbatten", "Rajendra Prasad", "Jawaharlal Nehru"],
        answer: 1
    },
    {
        id: 8,
        question: "The 'Quit India Movement' was launched in which year?",
        options: ["1930", "1940", "1942", "1947"],
        answer: 2
    },
    {
        id: 9,
        question: "Which planet is known as the 'Red Planet'?",
        options: ["Venus", "Mars", "Jupiter", "Saturn"],
        answer: 1
    },
    {
        id: 10,
        question: "What is the capital of Australia?",
        options: ["Sydney", "Melbourne", "Perth", "Canberra"],
        answer: 3
    },
    {
        id: 11,
        question: "Who wrote 'Discovery of India'?",
        options: ["Mahatma Gandhi", "Subhash Chandra Bose", "Jawaharlal Nehru", "Rabindranath Tagore"],
        answer: 2
    },
    {
        id: 12,
        question: "The 'Swaraj Party' was founded by whom?",
        options: ["Motilal Nehru and C.R. Das", "Subhash Chandra Bose and Jawaharlal Nehru", "Gandhi and Ambedkar", "Tilak and Gokhale"],
        answer: 0
    },
    {
        id: 13,
        question: "Which of the following is a direct tax?",
        options: ["GST", "Excise Duty", "Income Tax", "Sales Tax"],
        answer: 2
    },
    {
        id: 14,
        question: "Where is the headquarters of ISRO located?",
        options: ["Mumbai", "New Delhi", "Bengaluru", "Chennai"],
        answer: 2
    },
    {
        id: 15,
        question: "What is the full form of GDP?",
        options: ["Gross Domestic Product", "Global Domestic Product", "Gross Development Product", "General Domestic Product"],
        answer: 0
    },
    {
        id: 16,
        question: "Which state has the longest coastline in India?",
        options: ["Maharashtra", "Tamil Nadu", "Gujarat", "Andhra Pradesh"],
        answer: 2
    },
    {
        id: 17,
        question: "The 'Ramsar Convention' is associated with the conservation of?",
        options: ["Forests", "Wetlands", "Tigers", "Rivers"],
        answer: 1
    },
    {
        id: 18,
        question: "Who is the ex-officio Chairman of the Rajya Sabha?",
        options: ["President", "Vice-President", "Prime Minister", "Speaker"],
        answer: 1
    },
    {
        id: 19,
        question: "Currently, how many Fundamental Duties are there in the Indian Constitution?",
        options: ["10", "11", "9", "12"],
        answer: 1
    },
    {
        id: 20,
        question: "World Environment Day is celebrated on?",
        options: ["5th June", "22nd April", "1st May", "2nd October"],
        answer: 0
    }
];
