'use strict';

// Versioned, original IELTS-style demonstration content. Answer keys are kept separately on the server.
module.exports = {
  "version": 1,
  "Listening": {
    "durationSeconds": 1800,
    "sections": [
      {
        "title": "Part 1 · Booking a course",
        "script": "Receptionist: Good morning, Westbrook Language Centre. How can I help? Caller: Hello, I would like to ask about your evening English course. Receptionist: Certainly. Classes begin on the 14th of October and run on Tuesdays and Thursdays from six thirty until eight. Caller: How much does it cost? Receptionist: The full course is two hundred and forty pounds, including the course book. Caller: Great. My surname is Patel, P A T E L. Receptionist: Thank you. Could I have your phone number? Caller: It is 07700 900 416. Receptionist: And your current level? Caller: Intermediate. I took a test last month.",
        "questions": [
          [
            "What is the name of the language centre?",
            "text",
            ""
          ],
          [
            "On what date does the course begin?",
            "text",
            ""
          ],
          [
            "Which two days are classes held?",
            "text",
            ""
          ],
          [
            "What time does the class finish?",
            "text",
            ""
          ],
          [
            "What is the total course fee in pounds?",
            "text",
            ""
          ],
          [
            "What is included in the fee?",
            "choice",
            [
              "A course book",
              "A meal",
              "A dictionary",
              "Travel costs"
            ]
          ],
          [
            "Spell the caller’s surname.",
            "text",
            ""
          ],
          [
            "What is the caller’s phone number?",
            "text",
            ""
          ],
          [
            "What is the caller’s English level?",
            "choice",
            [
              "Beginner",
              "Intermediate",
              "Advanced",
              "Fluent"
            ]
          ],
          [
            "When did the caller take an English test?",
            "text",
            ""
          ]
        ]
      },
      {
        "title": "Part 2 · Visitor information",
        "script": "Welcome to Lakeside Nature Park. The visitor centre opens at nine every morning and closes at five thirty. Guided walks leave from the main gate at ten fifteen and two o’clock. Please book bicycles at the information desk; helmets are provided free of charge. The café is beside the lake, but picnics are permitted only in the woodland area. If you need first aid, contact a member of staff or go to the administration building. The bird-watching tower is temporarily closed for repairs. Children under twelve must be accompanied by an adult on all trails.",
        "questions": [
          [
            "What time does the visitor centre open?",
            "text",
            ""
          ],
          [
            "Where do guided walks start?",
            "text",
            ""
          ],
          [
            "What time is the afternoon guided walk?",
            "text",
            ""
          ],
          [
            "Where should visitors book bicycles?",
            "text",
            ""
          ],
          [
            "What is provided free with a bicycle?",
            "text",
            ""
          ],
          [
            "Where are picnics permitted?",
            "choice",
            [
              "Beside the lake",
              "In the woodland area",
              "At the main gate",
              "Inside the café"
            ]
          ],
          [
            "Where can visitors get first aid?",
            "text",
            ""
          ],
          [
            "Which facility is closed temporarily?",
            "choice",
            [
              "The café",
              "The visitor centre",
              "The bird-watching tower",
              "The bicycle desk"
            ]
          ],
          [
            "Children under what age need an accompanying adult?",
            "text",
            ""
          ],
          [
            "What time does the visitor centre close?",
            "text",
            ""
          ]
        ]
      },
      {
        "title": "Part 3 · University project discussion",
        "script": "Tutor: Have you decided how to present your project on urban gardens? Maya: We originally planned a survey, but we received too few responses. We are going to interview six community garden coordinators instead. Tutor: That should give you more detailed information. Remember to include limitations in your report. Leo: We have divided the work. I will analyse the interview notes, and Maya will prepare the introduction. We both need to check the references by Friday. Tutor: The presentation is on the 22nd, not the 20th as shown on the old timetable. Aim for twelve minutes and leave time for questions. Your strongest section is the comparison between new and established gardens.",
        "questions": [
          [
            "What was the original research method?",
            "choice",
            [
              "A survey",
              "A field experiment",
              "A literature review",
              "A photo diary"
            ]
          ],
          [
            "How many coordinators will they interview?",
            "text",
            ""
          ],
          [
            "What must the report discuss?",
            "text",
            ""
          ],
          [
            "Who will analyse the interview notes?",
            "choice",
            [
              "The tutor",
              "Maya",
              "Leo",
              "Both students"
            ]
          ],
          [
            "What will Maya prepare?",
            "text",
            ""
          ],
          [
            "By which day must references be checked?",
            "text",
            ""
          ],
          [
            "What is the correct presentation date?",
            "text",
            ""
          ],
          [
            "How long should the presentation last?",
            "text",
            ""
          ],
          [
            "What is the strongest section of the project?",
            "choice",
            [
              "Budget analysis",
              "Garden comparisons",
              "Survey design",
              "Historical background"
            ]
          ],
          [
            "What should be left at the end?",
            "choice",
            [
              "A written exam",
              "Time for questions",
              "A group vote",
              "A second introduction"
            ]
          ]
        ]
      },
      {
        "title": "Part 4 · Lecture on sleep and learning",
        "script": "Today we will look at the relationship between sleep and learning. During sleep, the brain processes information gathered during the day. Research suggests that a regular sleep schedule is more helpful than occasional long periods of rest. Teenagers generally need more sleep than adults because their brains and bodies are still developing. Light from screens can delay the release of melatonin, a hormone involved in the sleep cycle. Short breaks while studying may also improve attention. However, breaks should not be so long that it becomes difficult to return to a task. Finally, physical exercise can support sleep quality, provided vigorous activity is not taken immediately before bedtime.",
        "questions": [
          [
            "What does the brain process during sleep?",
            "text",
            ""
          ],
          [
            "What is more helpful than occasional long periods of rest?",
            "text",
            ""
          ],
          [
            "Why do teenagers need more sleep?",
            "choice",
            [
              "They study longer",
              "Their brains and bodies are developing",
              "They exercise more",
              "They wake up earlier"
            ]
          ],
          [
            "What hormone is involved in the sleep cycle?",
            "text",
            ""
          ],
          [
            "What can screen light do?",
            "choice",
            [
              "Improve memory instantly",
              "Delay melatonin release",
              "Increase appetite",
              "Reduce body temperature"
            ]
          ],
          [
            "What may short study breaks improve?",
            "text",
            ""
          ],
          [
            "What is a risk of breaks that are too long?",
            "text",
            ""
          ],
          [
            "What can support sleep quality?",
            "text",
            ""
          ],
          [
            "When should vigorous exercise be avoided?",
            "text",
            ""
          ],
          [
            "What is the lecture mainly about?",
            "choice",
            [
              "Sleep and learning",
              "The history of schools",
              "Screen manufacturing",
              "Professional sport"
            ]
          ]
        ]
      }
    ]
  },
  "Reading": {
    "durationSeconds": 3600,
    "passages": [
      {
        "title": "Passage 1 · Community facilities",
        "heading": "A new community library",
        "text": "The Riverside Library reopened in April after a six-month renovation. The building now includes a quiet study room, a children’s reading corner and four computers available for public use. Membership is free for local residents, while visitors from outside the district can purchase a three-month card. The library opens at 8:30 on weekdays and at 10:00 on Saturdays. It is closed on Sundays. Members may borrow up to eight books for three weeks. Books can be renewed online unless another reader has reserved them. A small meeting room can be booked without charge by registered community groups, but bookings must be made at least five working days in advance. The library café is operated by a local social enterprise, and profits support reading programmes for children. Staff recommend that visitors use the bicycle racks behind the building because parking spaces are limited.",
        "qs": [
          [
            "When did the library reopen?",
            "text"
          ],
          [
            "How many public-use computers are available?",
            "text"
          ],
          [
            "Who can get free membership?",
            "choice",
            [
              "All international visitors",
              "Local residents",
              "Only students",
              "Community group leaders"
            ]
          ],
          [
            "On which day is the library closed?",
            "text"
          ],
          [
            "For how long may a member borrow books?",
            "choice",
            [
              "One week",
              "Two weeks",
              "Three weeks",
              "Four weeks"
            ]
          ],
          [
            "When can a book not be renewed online?",
            "choice",
            [
              "When it is reserved by another reader",
              "When it is a new book",
              "When the library is busy",
              "When it is a children’s book"
            ]
          ],
          [
            "How far in advance must a meeting room be booked?",
            "text"
          ],
          [
            "Who operates the café?",
            "choice",
            [
              "The local council",
              "A social enterprise",
              "Library volunteers",
              "A university"
            ]
          ],
          [
            "What do café profits support?",
            "text"
          ],
          [
            "Where are visitors advised to park bicycles?",
            "text"
          ],
          [
            "What study space is available in the building?",
            "text"
          ],
          [
            "How many books may a member borrow at one time?",
            "text"
          ],
          [
            "What kind of room can community groups book free of charge?",
            "text"
          ]
        ]
      },
      {
        "title": "Passage 2 · Work and wellbeing",
        "heading": "Flexible working arrangements",
        "text": "Flexible working has become more common as organisations reconsider how work is organised. Some employees begin earlier and finish earlier, while others compress their hours into fewer days. Remote working is another option, although it is not suitable for every role. Employees often report that flexibility helps them manage family responsibilities and reduces commuting time. Employers may benefit from improved staff retention and access to applicants who live further away. Nevertheless, flexibility requires clear communication. Teams need agreed periods when everyone is available, particularly when projects involve several departments. Managers should assess outcomes rather than simply counting hours at a desk. New employees may need additional support because informal learning is harder when colleagues are rarely in the same place. A successful policy is reviewed regularly and takes account of both business requirements and employee feedback.",
        "qs": [
          [
            "What trend have organisations been reconsidering?",
            "choice",
            [
              "How work is organised",
              "How offices are decorated",
              "How salaries are taxed",
              "How products are advertised"
            ]
          ],
          [
            "Give one example of flexible hours.",
            "text"
          ],
          [
            "Why might flexibility help employees?",
            "text"
          ],
          [
            "Name one potential benefit for employers.",
            "text"
          ],
          [
            "What must teams agree on?",
            "text"
          ],
          [
            "What should managers assess instead of desk hours?",
            "choice",
            [
              "Office size",
              "Outcomes",
              "Commuting distance",
              "Staff age"
            ]
          ],
          [
            "Who may need extra support?",
            "text"
          ],
          [
            "Why can informal learning be harder?",
            "text"
          ],
          [
            "How often should a successful policy be reviewed?",
            "choice",
            [
              "Never",
              "Only once",
              "Regularly",
              "Every ten years"
            ]
          ],
          [
            "What two perspectives should a policy consider?",
            "text"
          ],
          [
            "What can remote working give employers access to?",
            "text"
          ],
          [
            "What should be agreed when several departments work together?",
            "text"
          ],
          [
            "What should employee feedback help organisations do?",
            "choice",
            [
              "Review the flexible-working policy",
              "Remove all flexible hours",
              "Count desk hours",
              "Close remote offices"
            ]
          ]
        ]
      },
      {
        "title": "Passage 3 · Urban trees",
        "heading": "Why city trees matter",
        "text": "Trees are increasingly recognised as important infrastructure in urban areas. Their shade can reduce surface temperatures during hot weather, while leaves intercept some airborne particles. Trees also absorb rainwater, slowing the flow into drainage systems during storms. These benefits depend on species, location and maintenance. A tree planted in a narrow pavement opening may struggle if its roots have little space, and branches can conflict with overhead cables. Urban planners therefore need to consider the full life of a tree rather than the initial planting cost alone. Native species may support local wildlife, but diversity is also important: a street planted with only one species can be vulnerable to a particular pest or disease. Residents are more likely to support planting schemes when they are consulted early and when maintenance responsibilities are clearly explained. Although trees cannot solve every environmental problem, a well-planned urban forest can make neighbourhoods healthier and more pleasant.",
        "qs": [
          [
            "What can tree shade reduce?",
            "text"
          ],
          [
            "What do leaves intercept?",
            "text"
          ],
          [
            "How can trees help during storms?",
            "text"
          ],
          [
            "What may limit a tree planted in a narrow pavement opening?",
            "text"
          ],
          [
            "What should planners consider beyond initial planting cost?",
            "choice",
            [
              "The tree’s full life",
              "The colour of leaves",
              "The age of residents",
              "The price of benches"
            ]
          ],
          [
            "Why is planting only one species risky?",
            "text"
          ],
          [
            "What may native species support?",
            "text"
          ],
          [
            "When should residents be consulted?",
            "choice",
            [
              "After trees are removed",
              "Early in the process",
              "Only during a storm",
              "Once a year"
            ]
          ],
          [
            "What should be clearly explained to residents?",
            "text"
          ],
          [
            "What is the main point of the passage?",
            "choice",
            [
              "Urban trees provide benefits but need careful planning",
              "Cities should remove all pavements",
              "Only native trees survive in cities",
              "Trees can solve every environmental problem"
            ]
          ],
          [
            "What can trees do to rainwater?",
            "choice",
            [
              "Slow its flow into drainage systems",
              "Turn it into drinking water",
              "Stop all flooding",
              "Increase pavement width"
            ]
          ],
          [
            "What can branches conflict with?",
            "text"
          ],
          [
            "What makes neighbourhoods healthier and more pleasant?",
            "choice",
            [
              "A well-planned urban forest",
              "A single tree species",
              "Removing all local wildlife",
              "Wider car parks"
            ]
          ],
          [
            "What else do tree benefits depend on besides species and location?",
            "text"
          ]
        ]
      }
    ]
  },
  "Writing": {
    "durationSeconds": 3600,
    "tasks": [
      {
        "title": "Task 1 · Letter",
        "heading": "A problem with the heating system",
        "instructions": "You should spend about 20 minutes on this task. Write at least 150 words.",
        "prompt": "You recently moved into a new home and have a problem with the heating system. Write a letter to the landlord.",
        "closing": "In your letter: explain the problem, describe what you have tried to do, and say what you would like the landlord to do. Give reasons for your answer and include any relevant examples from your own knowledge or experience.",
        "minimumWords": 150,
        "suggestedMinutes": 20
      },
      {
        "title": "Task 2 · Essay",
        "heading": "Public transport in cities",
        "instructions": "You should spend about 40 minutes on this task. Write at least 250 words.",
        "prompt": "Some people believe that public transport should be free in cities. Others think users should pay for the services they use. Discuss both views and give your own opinion.",
        "closing": "Give reasons for your answer and include any relevant examples from your own knowledge or experience.",
        "minimumWords": 250,
        "suggestedMinutes": 40
      }
    ]
  },
  "Speaking": {
    "durationSeconds": 840,
    "parts": [
      {
        "title": "Part 1 · Introduction and interview",
        "time": "4–5 minutes",
        "prompt": "Let’s talk about your life. Where do you live? What do you like about your hometown? Do you work or study? What do you enjoy doing in your free time? Do you prefer reading printed books or reading online? Why?"
      },
      {
        "title": "Part 2 · Individual long turn",
        "time": "3–4 minutes",
        "prompt": "Describe a skill you would like to learn. You should say what the skill is, where you would learn it, how you would practise it, and explain why you would like to learn it. You have one minute to prepare and should speak for up to two minutes."
      },
      {
        "title": "Part 3 · Discussion",
        "time": "4–5 minutes",
        "prompt": "Why do people learn new skills as adults? Should schools teach more practical skills? How has technology changed the way people learn? Is it better to learn alone or with others? How might education change in the future?"
      }
    ]
  }
};
