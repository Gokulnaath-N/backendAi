// Mock Database of AI Scraped Courses
const COURSE_DATABASE = [
  {
    courseName: "Introduction to Data Science",
    domain: "Data Science",
    level: "Beginner",
    platform: "Coursera",
    rating: 4.7,
    reviews: 125000,
    pricingType: "Free",
    price: 0,
    courseUrl: "https://coursera.org/learn/data-science"
  },
  {
    courseName: "Data Science Specialization",
    domain: "Data Science",
    level: "Intermediate",
    platform: "Coursera",
    rating: 4.6,
    reviews: 85000,
    pricingType: "Paid",
    price: 49,
    courseUrl: "https://coursera.org/specializations/jhu-data-science"
  },
  {
    courseName: "Advanced Machine Learning",
    domain: "Data Science",
    level: "Advanced",
    platform: "Udemy",
    rating: 4.8,
    reviews: 12000,
    pricingType: "Paid",
    price: 13.99,
    courseUrl: "https://udemy.com/course/advanced-machine-learning"
  },
  {
    courseName: "The Web Developer Bootcamp",
    domain: "Web Development",
    level: "Beginner",
    platform: "Udemy",
    rating: 4.8,
    reviews: 250000,
    pricingType: "Paid",
    price: 19.99,
    courseUrl: "https://udemy.com/course/the-web-developer-bootcamp"
  },
  {
    courseName: "Full Stack Web Development",
    domain: "Web Development",
    level: "Intermediate",
    platform: "Coursera",
    rating: 4.7,
    reviews: 45000,
    pricingType: "Paid",
    price: 39,
    courseUrl: "https://coursera.org/specializations/full-stack-react"
  },
  {
    courseName: "Advanced React and Redux",
    domain: "Web Development",
    level: "Advanced",
    platform: "Udemy",
    rating: 4.6,
    reviews: 8000,
    pricingType: "Paid",
    price: 14.99,
    courseUrl: "https://udemy.com/course/react-redux"
  }
];

exports.getRecommendations = (req, res) => {
  try {
    const userProfile = req.body;
    // Support both 'interests' (new req) and 'coursesInterested' (old req) for robustness, 
    // but prioritize 'interests' as per latest prompt.
    const interests = userProfile.interests || userProfile.coursesInterested;
    const learningLevels = userProfile.learningLevels;

    if (!interests || !Array.isArray(interests) || !learningLevels) {
      return res.status(400).json({ message: "Invalid input format. 'interests' (array) and 'learningLevels' (object) are required." });
    }

    let recommendedCourses = [];

    // Simple matching heuristic
    interests.forEach(interest => {
      const preferredLevel = learningLevels[interest];

      if (preferredLevel) {
        // Find courses matching domain and level
        const matches = COURSE_DATABASE.filter(course =>
          course.domain === interest &&
          course.level === preferredLevel
        );
        recommendedCourses = [...recommendedCourses, ...matches];
      }
    });

    // Remove duplicates
    const uniqueCourses = Array.from(new Set(recommendedCourses.map(c => c.courseUrl)))
      .map(url => recommendedCourses.find(c => c.courseUrl === url));

    res.status(200).json({
      recommendedCourses: uniqueCourses
    });

  } catch (error) {
    console.error("Recommendation Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
