import dubai from '../videos/dubai.mp4';
import thailand from '../videos/thailand.mp4';
import { 
  Home as HomeIcon,
  Landmark as CastleIcon,
  Building as BuildingIcon,
  Hotel as PenthouseIcon
} from 'lucide-react';

export const locationData = {
  Pune: {
    title: "Find The Best Pune Real Estate Property",
    subtitle: "Explore Pune's finest real estate properties today",
    videoUrl: "https://files.catbox.moe/pdtuvo.mp4",
    locations: ["Wakad", "Baner", "Punawale", "Kiwale", "Ravet"],
    flag: "PN",
    initials: "PNQ"
  },
  Dubai: {
    title: "Find The Best Dubai Real Estate Property",
    subtitle: "Explore Dubai's finest real estate properties today",
    videoUrl: "https://files.catbox.moe/pdtuvo.mp4",
    locations: ["Wakad", "Baner", "Downtown Dubai", "Arabian Ranches", "Dubai Hills"],
    flag: "🇦🇪",
    initials: "DXB"
  },
  Thailand: {
    title: "Discover Premium Thailand Properties",
    subtitle: "Explore Thailand's most exclusive real estate opportunities",
    videoUrl: thailand,
    locations: ["Phuket", "Pattaya", "Koh Samui", "Chiang Mai", "Hua Hin"],
    flag: "🇹🇭",
    initials: "TH"
  },
  Bangkok: {
    title: "Premium Bangkok Real Estate",
    subtitle: "Find your perfect property in the heart of Bangkok",
    videoUrl: "/videos/bangkok.mp4",
    locations: ["Sukhumvit", "Silom", "Sathorn", "Thonglor", "Asoke"],
    flag: "🇹🇭",
    initials: "BKK"
  },
  Greece: {
    title: "Luxurious Greek Properties",
    subtitle: "Experience the finest Mediterranean real estate",
    videoUrl: "/videos/greece.mp4",
    locations: ["Athens", "Santorini", "Mykonos", "Crete", "Rhodes"],
    flag: "🇬🇷",
    initials: "GR"
  },
  Cyprus: {
    title: "Elite Cyprus Real Estate",
    subtitle: "Discover pristine properties in Cyprus",
    videoUrl: "/videos/cyprus.mp4",
    locations: ["Limassol", "Paphos", "Larnaca", "Nicosia", "Famagusta"],
    flag: "🇨🇾",
    initials: "CY"
  },
};

export const propertyTypes = [
  { name: "Villa", icon: CastleIcon },
  { name: "Townhouse", icon: HomeIcon },
  { name: "Penthouse", icon: PenthouseIcon },
  { name: "Apartment", icon: BuildingIcon }
];

export const bedroomOptions = ["Studio", "1", "1.5", "2", "3", "4", "5", "6"];