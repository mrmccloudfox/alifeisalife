import { StoryItem, ReportItem } from "../types";

export const APP_POEM = `A heart is a heart, that beats in the dark,
A breath is a breath, a delicate spark.
Even the smallest, the quietest sign,
Has a purpose and light, a custom design.
No whisper is wasted, no voice is in vain,
We stand for the joy, we stand through the pain.
For a life is a life, let the truth now be told,
No matter how small, how precious, how bold.`;

export const STORIES: StoryItem[] = [
  {
    id: "1",
    number: "1",
    title: "A Colorado student was told she could not read her poem",
    description: "A 7th grader at Drake Middle School in Jeffco Public Schools was barred from presenting a pro-life slam poetry submission even after staff acknowledged it met the assignment requirements.",
    detailedStory: "The PDF mockup frames the story around a Drake Middle School student in Jeffco Public Schools who was not allowed to present her pro-life slam poetry submission. The mockup source says staff had acknowledged the poem met the assignment requirements, while the topic was treated as too politically charged for presentation.",
    linkText: "Open on X",
    linkUrl: "https://x.com/libsoftiktok/status/2056919525107355654?s=20",
    suggestedVoice: "Zephyr",
    recitationText: "This chapter summarizes the first sourced clip linked in the PDF mockup: a Colorado student was told she could not read her poem."
  },
  {
    id: "2",
    number: "2",
    title: "Her family knows what choosing life can mean",
    description: "Her mother shared that her own mother became pregnant at 14 and chose life. Their thriving family exists because of that hard, hopeful choice.",
    detailedStory: "The PDF mockup connects the poem to a family story: her mother shared that her own mother became pregnant at 14 and chose life. The page uses that family context to explain why the poem is personal rather than abstract.",
    linkText: "Open on X",
    linkUrl: "https://x.com/libsoftiktok/status/2056937291919041009?s=20",
    suggestedVoice: "Charon",
    recitationText: "This chapter summarizes the second sourced clip linked in the PDF mockup: the family connection behind the student's poem."
  },
  {
    id: "3",
    number: "3",
    title: "Hear the poem in her own voice",
    description: "After she was not allowed to present the poem in class, she read it publicly so people could hear the words for themselves.",
    detailedStory: "The PDF mockup's third story link points to the student's public reading of the poem. The page presents this as the clearest way for visitors to hear the original message directly.",
    linkText: "Open on X",
    linkUrl: "https://x.com/libsoftiktok/status/2056927043099459792?s=20",
    suggestedVoice: "Kore",
    recitationText: APP_POEM
  }
];

export const REPORTED_DETAILS: ReportItem[] = [
  {
    id: "1",
    source: "WHAT HAPPENED",
    quote: "Libs of TikTok source clip referenced by the README for the initial account of the school poetry dispute.",
    category: "Media Coverage",
    href: "https://x.com/libsoftiktok/status/2056919525107355654?s=20"
  },
  {
    id: "2",
    source: "WHY IT IS PERSONAL",
    quote: "Libs of TikTok source clip referenced by the README for the family context behind the poem.",
    category: "Media Coverage",
    href: "https://x.com/libsoftiktok/status/2056937291919041009?s=20"
  },
  {
    id: "3",
    source: "POEM READING",
    quote: "Libs of TikTok source clip referenced by the README for the student's public poem reading.",
    category: "Media Coverage",
    href: "https://x.com/libsoftiktok/status/2056927043099459792?s=20"
  },
  {
    id: "4",
    source: "ROCKY MOUNTAIN VOICE",
    quote: "Reported article on the Drake Middle School poetry presentation dispute.",
    category: "Local Reporting",
    href: "https://rockymountainvoice.com/2026/05/21/jeffco-student-barred-from-reading-pro-life-poem-after-school-calls-it-too-politically-charged/"
  },
  {
    id: "5",
    source: "HOPE HOUSE COLORADO",
    quote: "Official organization site referenced by the README for the campaign beneficiary.",
    category: "Beneficiary",
    href: "https://hopehousecolorado.org/"
  }
];
