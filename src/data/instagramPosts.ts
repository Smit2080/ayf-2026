export interface InstagramPost {
  id: number;
  image: string;
  caption: string;
  url: string;
  date?: string;
  username?: string;
}

export const instagramPosts: InstagramPost[] = [
  {
    id: 1,
    image: "/instagram/post1.png",
    caption: "The future is here! Registrations for the AYF 2026 Science Exhibition are now open. Present your innovative ideas and projects to the world. Sign up now via the link in bio! ✨🚀 #AYF2026 #ScienceExhibition #Innovation",
    url: "https://www.instagram.com/p/DFD_gQoS-4s/",
    date: "2 days ago",
    username: "amravatiyouthfest"
  },
  {
    id: 2,
    image: "/instagram/post2.png",
    caption: "Speak up, inspire, and lead! Welcome to the AYF 2026 Youth Parliament. A platform for the leaders of tomorrow to debate, discuss, and deliberate on crucial issues. Reserve your seat today. 🗣️🏛️ #YouthParliament #Debate #AYF2026",
    url: "https://www.instagram.com/p/DFD_gQoS-4s/",
    date: "3 days ago",
    username: "amravatiyouthfest"
  },
  {
    id: 3,
    image: "/instagram/post3.png",
    caption: "Witness the clash of talents! From electrifying dance moves to soulful musical performances, Amravati's Got Talent is back at AYF 2026. Register now to showcase your passion on the grand stage! 🌟💃🎤 #GotTalent #Dance #Music #AYF2026",
    url: "https://www.instagram.com/p/DFD_gQoS-4s/",
    date: "4 days ago",
    username: "amravatiyouthfest"
  }
];
