import { CategoryIds } from "../data";

export const categories: Array<{ id: CategoryIds; title: string }> = [
  { id: "software_development", title: "Software Development" },
  { id: "software_design", title: "Software Design" },
  { id: "personal_development", title: "Personal Development" },
  { id: "music", title: "Music" },
  { id: "marketing", title: "Marketing" },
];

export const categoryTitlesMapped: { [key in CategoryIds]: string } = {
  software_development: "Software Development",
  software_design: "Software Design",
  personal_development: "Personal Development",
  music: "Music",
  marketing: "Marketing",
};

export const ratingHelper: { [key: string]: { text: string; emoji?: string } } =
  {
    "1": { text: "Poor 😞", emoji: "😞" },
    "2": { text: "Fair 😐", emoji: "😐" },
    "3": { text: "Good 😊", emoji: "😊" },
    "4": { text: "Very Good 😃", emoji: "😃" },
    "5": { text: "Excellent 🌟", emoji: "🌟" },
  };
