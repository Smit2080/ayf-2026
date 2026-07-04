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
    caption: "Amravati city mein pehli baar kuch aisa ho raha hai jo sach mein ekdm crazy hai 🎯 Education. Entrepreneurs. Entertainment. Sab ek hi jagah. Amravati Youth Festival 2026 — Coming Soon 🌊 Be The Part, Lead The Wave. Stay tuned.",
    url: "https://www.instagram.com/amravatiyouthfest/reel/DYUdi9Ny4P2/",
    date: "May 14, 2026",
    username: "amravatiyouthfest"
  },
  {
    id: 2,
    image: "/instagram/post2.png",
    caption: "Haan haan, ghar baith ke doosron ki reels dekho. 👀 Vo stage pe honge. Tum comments mein “mujhe bhi jaana tha” likhoge. 😌 Ya phir — AYF 2026 mein VOLUNTEER ban jao. Aur khud us stage ka hissa bano. 🔥 Choice tumhari hai. Form link bio mein hai. 👇",
    url: "https://www.instagram.com/amravatiyouthfest/p/DY1rm9kyrpZ/",
    date: "May 27, 2026",
    username: "amravatiyouthfest"
  },
  {
    id: 3,
    image: "/instagram/post3.png",
    caption: "DREAMUM WAKEPUM... VOLUNTEERUM! Registrations open 😎 Link 🔗 in bio! The stage is set, the vision is big, and the journey has begun. 🚀 Amravati Youth Festival 2026 is looking for passionate, dedicated, and enthusiastic young minds ready to create an unforgettable experience.",
    url: "https://www.instagram.com/amravatiyouthfest/p/DZCsdsHS9C1/",
    date: "Jun 1, 2026",
    username: "amravatiyouthfest"
  }
];
