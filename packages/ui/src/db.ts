import { Scholarship } from "@/types";

export const mockScholarships: Scholarship[] = [
    {
        id: "1",
        title: "Global Excellence Scholarship",
        university: "University of Oxford",
        country: "United Kingdom",
        countryCode: "GB",
        deadline: "2024-05-15",
        amount: "Full Tuition + £15,000 Stipend",
        category: "Masters",
        description: "Prestigious scholarship for high-achieving international students demonstrating leadership potential.",
        requirements: ["IELTS 7.5+", "GPA 3.8+", "2 Recommendation Letters"],
        slots: 5,
        featured: true,
    },
    {
        id: "2",
        title: "Tech Future Grant",
        university: "MIT",
        country: "United States",
        countryCode: "US",
        deadline: "2024-06-01",
        amount: "$50,000 / year",
        category: "Undergraduate",
        description: "Support for innovative students pursuing Computer Science and Engineering degrees.",
        requirements: ["IELTS 7.0+", "Portfolio", "Math Proficiency"],
        slots: 10,
        featured: true,
    },
    {
        id: "3",
        title: "Commonwealth Shared Scholarship",
        university: "University of Cambridge",
        country: "United Kingdom",
        countryCode: "GB",
        deadline: "2024-04-30",
        amount: "Full Funding",
        category: "PhD",
        description: "Directed at students from developing Commonwealth countries for development-related studies.",
        requirements: ["IELTS 7.0+", "Research Proposal", "Citizenship of Commonwealth Country"],
        slots: 2,
        featured: false,
    },
    {
        id: "4",
        title: "Vanier Canada Graduate Scholarship",
        university: "University of Toronto",
        country: "Canada",
        countryCode: "CA",
        deadline: "2024-11-01",
        amount: "$50,000 / year (3 years)",
        category: "PhD",
        description: "Attracting world-class doctoral students to Canadian universities.",
        requirements: ["IELTS 7.5+", "Research Potential", "Leadership Skills"],
        slots: 50,
        featured: true,
    }
];

// Extend the type definition to include countryCode since I added it to the mock data but maybe missed it in the interface
// Actually I'll fix the interface in the next step if I missed it.
