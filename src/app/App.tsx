import { useState, useEffect, useRef, useCallback } from "react";
import logoImage from "@/imports/WhatsApp_Image_2026-07-06_at_12.21.14_PM-1.jpeg";
import {
  ShoppingBag, Search, User, Heart, ChevronLeft, ChevronRight,
  Star, Filter, X, Menu, ChevronDown, MapPin, Phone,
  Mail, Tag, Truck, RotateCcw, Shield, Check, Plus, Minus,
  Trash2, ArrowRight, Instagram, Facebook, Youtube, ZoomIn,
  Eye, CheckCircle, AlertCircle, Home, Flame, Clock, Zap,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
type Page = "home" | "listing" | "detail" | "account" | "cart" | "static" | "wishlist";
type StaticSlug = "about" | "contact" | "shipping" | "returns" | "privacy" | "terms";

interface Product {
  id: number; name: string; category: string; subCategory: string;
  price: number; originalPrice: number; discount: number;
  fabric: string; occasion: string; color: string; colorHex: string;
  colorGroup: string; stock: number; rating: number; reviewCount: number;
  image: string; images: string[]; description: string;
  careInstructions: string[]; isNew: boolean; isFeatured: boolean; isOffer: boolean;
}
interface CartItem { product: Product; quantity: number }

// ─── Images ───────────────────────────────────────────────────────────────────
const U = (id: string, w = 700, h = 950) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&auto=format`;
const IMG = {
  a: U("1617627143750-d86bc21e42bb"), b: U("1619516388835-2b60acc4049e"),
  c: U("1739429942851-9083ee185d3d"), d: U("1618901185975-d59f7091bcfe"),
  e: U("1597897569252-9df44c7de0db"), f: U("1614940685083-c5409b57da6e"),
  g: U("1570212773364-e30cd076539e"), h: U("1727430228383-aa1fb59db8bf"),
  i: U("1622207691293-5cd80466dab3"), j: U("1628477116196-48afe0d209e0"),
  k: U("1584242353192-7a1df2e855d8"), l: U("1612595391900-29390866733a"),
  m: U("1769275061721-bb6439d24ebc"), n: U("1526392195523-1f40e4e78117"),
};

const COLOR_IMGS: Record<string, string> = {
  Red: `${import.meta.env.BASE_URL}assets/red_saree_1783520892018.png`,
  Green: `${import.meta.env.BASE_URL}assets/green_saree_1783520904771.png`,
  Blue: `${import.meta.env.BASE_URL}assets/blue_saree_1783520914278.png`,
  Pink: `${import.meta.env.BASE_URL}assets/pink_saree_1783521101071.png`,
  Yellow: `${import.meta.env.BASE_URL}assets/yellow_saree_1783521112666.png`,
  Purple: `${import.meta.env.BASE_URL}assets/purple_saree_1783521124549.png`,
  Gold: `${import.meta.env.BASE_URL}assets/gold_saree_1783521135344.png`,
};

// ─── Product Factory ──────────────────────────────────────────────────────────
const mk = (
  id: number, name: string, cat: string, sub: string, grp: string,
  price: number, orig: number, fabric: string, occ: string,
  color: string, hex: string, img: string, imgs: string[],
  isNew: boolean, isFeat: boolean, isOffer: boolean, desc: string, care: string[]
): Product => {
  const mainImg = COLOR_IMGS[color] || img;
  const finalImgs = imgs.includes(mainImg) ? imgs : [mainImg, ...imgs.filter(i => i !== img)];
  return {
    id, name, category: cat, subCategory: sub, colorGroup: grp,
    price, originalPrice: orig,
    discount: Math.round((orig - price) / orig * 100),
    fabric, occasion: occ, color, colorHex: hex,
    stock: [3, 5, 7, 8, 10, 12, 15, 18, 20, 25][id % 10],
    rating: parseFloat((4.1 + (id % 8) * 0.1).toFixed(1)),
    reviewCount: [18, 27, 38, 45, 58, 72, 89, 112, 134, 156][id % 10],
    image: mainImg, images: finalImgs,
    isNew, isFeatured: isFeat, isOffer, description: desc, careInstructions: care
  };
};

const SILKCARE = ["Dry clean only", "Store wrapped in muslin cloth", "Avoid direct sunlight", "Do not wring"];
const COTTONCARE = ["Machine wash gentle cycle", "Iron on medium heat", "Dry in shade"];
const PARTYCARE = ["Dry clean only", "Handle embellishments carefully", "Do not wring"];

// ─── Products ─────────────────────────────────────────────────────────────────
const PRODUCTS: Product[] = [
  // ─ Kanjivaram Temple Border ─
  mk(1,"Kanjivaram Temple Border Saree","Silk","Kanjivaram","KJ-TEMPLE",12500,15000,"Pure Silk","Wedding","Red","#c0392b",IMG.a,[IMG.g,IMG.d],false,true,false,"Exquisite Kanjivaram pure silk saree with traditional temple border and rich zari weaving. A timeless heirloom piece crafted by master weavers of Kanchipuram over 15–20 days. Features intricate peacock and lotus motifs in the pallu.",SILKCARE),
  mk(2,"Kanjivaram Temple Border Saree","Silk","Kanjivaram","KJ-TEMPLE",12800,15000,"Pure Silk","Wedding","Green","#1a5c2a",IMG.b,[IMG.i],true,false,false,"Same iconic temple border in rich forest green with contrasting gold zari. Equally regal and perfect for mehendi or reception ceremonies.",SILKCARE),
  mk(3,"Kanjivaram Temple Border Saree","Silk","Kanjivaram","KJ-TEMPLE",13200,16000,"Pure Silk","Wedding","Purple","#7b4f8e",IMG.k,[IMG.h],false,true,true,"Deep royal purple Kanjivaram with heavy gold korvai border — a rare and striking combination beloved by modern brides.",SILKCARE),
  mk(4,"Kanjivaram Temple Border Saree","Silk","Kanjivaram","KJ-TEMPLE",11800,15000,"Pure Silk","Wedding","Blue","#1a6bb5",IMG.c,[IMG.m],true,false,true,"Ocean blue Kanjivaram with silver zari border — a contemporary twist on a heritage weave. Ideal for daytime wedding functions.",SILKCARE),
  mk(5,"Kanjivaram Temple Border Saree","Silk","Kanjivaram","KJ-TEMPLE",12200,15000,"Pure Silk","Wedding","Gold","#c9940a",IMG.i,[IMG.g],false,false,false,"Resplendent golden Kanjivaram with antique gold zari — a rare treasure that glows under wedding lights.",SILKCARE),
  mk(6,"Kanjivaram Temple Border Saree","Silk","Kanjivaram","KJ-TEMPLE",11500,15000,"Pure Silk","Festival","Pink","#d4006e",IMG.l,[IMG.f],true,false,false,"Vibrant rose-pink Kanjivaram with traditional border — festive and feminine, perfect for puja ceremonies and celebrations.",SILKCARE),
  // ─ Bridal Kanjivaram ─
  mk(7,"Bridal Kanjivaram Set Saree","Silk","Kanjivaram","KJ-BRIDAL",28000,35000,"Pure Silk","Wedding","Red","#c0392b",IMG.g,[IMG.a,IMG.i],false,true,false,"Magnificent bridal Kanjivaram with heavy korvai gold zari and intricate double-warp temple border. Woven as a matched set with blouse piece. Heirloom quality.",SILKCARE),
  mk(8,"Bridal Kanjivaram Set Saree","Silk","Kanjivaram","KJ-BRIDAL",29500,36000,"Pure Silk","Wedding","Gold","#c9940a",IMG.i,[IMG.g],false,true,false,"Golden bridal Kanjivaram with intricate peacock border — a showstopper for the discerning bride who wants to stand apart.",SILKCARE),
  mk(9,"Bridal Kanjivaram Set Saree","Silk","Kanjivaram","KJ-BRIDAL",27000,35000,"Pure Silk","Wedding","Green","#1a5c2a",IMG.b,[IMG.j],true,false,true,"Forest green bridal Kanjivaram — traditional South Indian bridal choice for mehendi ceremony or haldi function.",SILKCARE),
  // ─ Banarasi Georgette ─
  mk(10,"Banarasi Floral Georgette Saree","Silk","Banarasi","BN-FLORAL",8900,11000,"Georgette","Party Wear","Green","#1a5c2a",IMG.c,[IMG.f],true,true,false,"Luxurious Banarasi georgette with intricate floral motifs and delicate gold zari border. Lightweight drape ideal for long festive events.",["Dry clean preferred","Hand wash cold if needed","Iron low from reverse","Roll, do not fold"]),
  mk(11,"Banarasi Floral Georgette Saree","Silk","Banarasi","BN-FLORAL",8700,11000,"Georgette","Party Wear","Blue","#1a6bb5",IMG.m,[IMG.n],true,false,true,"Midnight blue Banarasi floral georgette — sophisticated choice for cocktail evenings and festivals alike.",["Dry clean preferred","Iron low heat"]),
  mk(12,"Banarasi Floral Georgette Saree","Silk","Banarasi","BN-FLORAL",9200,11500,"Georgette","Party Wear","Pink","#d4006e",IMG.l,[IMG.j],false,false,false,"Rose-pink Banarasi with silver zari — a refreshing contemporary twist on a classic weave.",["Dry clean preferred","Roll, do not fold"]),
  mk(13,"Banarasi Floral Georgette Saree","Silk","Banarasi","BN-FLORAL",8500,11000,"Georgette","Festival","Yellow","#d4a800",IMG.e,[IMG.c],true,false,true,"Vibrant marigold yellow Banarasi georgette with contrasting zari — a festival showstopper.",["Dry clean only","Store flat"]),
  // ─ Banarasi Wedding ─
  mk(14,"Wedding Banarasi Silk Saree","Silk","Banarasi","BN-WEDDING",15000,19000,"Pure Silk","Wedding","Red","#c0392b",IMG.j,[IMG.a,IMG.g],false,true,false,"Rich wedding Banarasi in traditional red with heavy gold zari brocade pallu. The quintessential bridal Banarasi beloved across North India.",SILKCARE),
  mk(15,"Wedding Banarasi Silk Saree","Silk","Banarasi","BN-WEDDING",14500,19000,"Pure Silk","Wedding","Pink","#d4006e",IMG.l,[IMG.k],true,false,true,"Bridal pink Banarasi with intricate gold brocade — a modern take on a timeless classic.",SILKCARE),
  // ─ Mysore Crepe ─
  mk(16,"Mysore Crepe Silk Saree","Silk","Mysore","MY-CREPE",6500,8000,"Crepe Silk","Office Wear","Blue","#1a6bb5",IMG.c,[IMG.h],false,true,false,"Elegant Mysore crepe silk with smooth texture and natural sheen. Transitions effortlessly from office to evening wear.",SILKCARE),
  mk(17,"Mysore Crepe Silk Saree","Silk","Mysore","MY-CREPE",6200,8000,"Crepe Silk","Office Wear","Green","#1a5c2a",IMG.b,[IMG.c],true,false,true,"Sage green Mysore crepe — elegant and understated, ideal for corporate events and cultural functions.",SILKCARE),
  mk(18,"Mysore Crepe Silk Saree","Silk","Mysore","MY-CREPE",6800,8500,"Crepe Silk","Party Wear","Pink","#d4006e",IMG.f,[IMG.l],false,false,false,"Dusty rose Mysore crepe — perfect for evening parties and upscale family gatherings.",SILKCARE),
  // ─ Chanderi ─
  mk(19,"Chanderi Silk-Cotton Saree","Silk","Chanderi","CH-BOOTI",4200,5500,"Silk Cotton","Festival","Pink","#d4006e",IMG.f,[IMG.b],true,true,true,"Sheer and airy Chanderi silk-cotton with delicate zari bootis. A festival staple across generations.",SILKCARE),
  mk(20,"Chanderi Silk-Cotton Saree","Silk","Chanderi","CH-BOOTI",4000,5500,"Silk Cotton","Festival","Yellow","#d4a800",IMG.e,[IMG.f],false,false,true,"Sunshine yellow Chanderi booti saree with contrasting dark border — radiant for morning pujas.",SILKCARE),
  mk(21,"Chanderi Silk-Cotton Saree","Silk","Chanderi","CH-BOOTI",4400,5500,"Silk Cotton","Festival","Blue","#1a6bb5",IMG.m,[IMG.c],true,false,false,"Cool sky blue Chanderi with silver zari bootis — refreshing and modern for summer festivals.",SILKCARE),
  // ─ Paithani ─
  mk(22,"Paithani Silk Saree","Silk","Paithani","PAI-001",18000,22000,"Pure Silk","Wedding","Green","#1a5c2a",IMG.j,[IMG.k],false,false,false,"Authentic Paithani silk from Paithan with iconic peacock and lotus motifs. GI-tagged heritage weave.",SILKCARE),
  mk(23,"Paithani Silk Saree","Silk","Paithani","PAI-001",17500,22000,"Pure Silk","Wedding","Purple","#7b4f8e",IMG.k,[IMG.j],true,false,true,"Royal purple Paithani with gold peacock border — one of the rarest colour combinations from this heritage weave.",SILKCARE),
  // ─ Bhagalpuri ─
  mk(24,"Bhagalpuri Tussar Silk Saree","Silk","Bhagalpuri","BH-TUSSAR",4800,6000,"Tussar Silk","Festival","Orange","#e67e22",IMG.n,[IMG.d],true,false,false,"Rich Bhagalpuri tussar with natural gold sheen and printed kalamkari border. Eco-friendly peace silk.",SILKCARE),
  mk(25,"Bhagalpuri Tussar Silk Saree","Silk","Bhagalpuri","BH-TUSSAR",4600,6000,"Tussar Silk","Casual","Green","#1a5c2a",IMG.b,[IMG.n],false,false,false,"Earthy green Bhagalpuri tussar with block-print kalamkari pallu — perfect for casual festive occasions.",SILKCARE),
  // ─ Cotton Tant Handloom ─
  mk(26,"Tant Handloom Cotton Saree","Cotton","Handloom","CT-TANT",2800,3500,"Cotton","Casual","Yellow","#d4a800",IMG.e,[IMG.c],true,false,false,"Lightweight handloom tant ideal for everyday summer wear. Traditional geometric patterns with contrasting border.",COTTONCARE),
  mk(27,"Tant Handloom Cotton Saree","Cotton","Handloom","CT-TANT",2600,3500,"Cotton","Casual","White","#d4c8b0",IMG.n,[],false,false,true,"Crisp white tant cotton with red and black geometric border — a Bengali classic for daily and festive wear.",COTTONCARE),
  mk(28,"Tant Handloom Cotton Saree","Cotton","Handloom","CT-TANT",2900,3500,"Cotton","Festival","Orange","#e67e22",IMG.f,[IMG.e],true,false,false,"Marigold orange tant with contrasting border — perfect for Durga Puja, Onam, and festive gatherings.",COTTONCARE),
  mk(29,"Tant Handloom Cotton Saree","Cotton","Handloom","CT-TANT",2700,3500,"Cotton","Casual","Blue","#1a6bb5",IMG.m,[IMG.n],false,false,true,"Indigo blue tant with white geometric border — cool and comfortable for South Indian summers.",COTTONCARE),
  // ─ Pochampally Ikat ─
  mk(30,"Pochampally Double Ikat Saree","Cotton","Ikat","PO-IKAT",3800,4500,"Cotton Silk","Casual","Orange","#e67e22",IMG.d,[IMG.e],false,false,false,"Traditional Pochampally double ikat with geometric patterns. Each piece is unique — yarn resist-dyed before weaving.",COTTONCARE),
  mk(31,"Pochampally Double Ikat Saree","Cotton","Ikat","PO-IKAT",3600,4500,"Cotton Silk","Casual","Blue","#1a6bb5",IMG.c,[IMG.m],true,false,true,"Royal blue Pochampally ikat with traditional diamond patterns — a wearable work of art.",COTTONCARE),
  mk(32,"Pochampally Double Ikat Saree","Cotton","Ikat","PO-IKAT",3900,4500,"Cotton Silk","Festival","Red","#c0392b",IMG.j,[IMG.d],false,false,false,"Vibrant red Pochampally ikat — festive and bold, perfect for cultural events and celebrations.",COTTONCARE),
  // ─ Linen ─
  mk(33,"Linen Blend Summer Saree","Cotton","Linen","LN-SUMMER",2200,2800,"Linen","Casual","Blue","#1a6bb5",IMG.m,[],true,false,false,"Crisp and breathable linen blend saree for Indian summers. Minimal printed border, easy to drape and maintain.",COTTONCARE),
  mk(34,"Linen Blend Summer Saree","Cotton","Linen","LN-SUMMER",2400,2800,"Linen","Casual","White","#d4c8b0",IMG.n,[IMG.m],false,false,true,"Off-white linen blend with subtle woven border — the perfect everyday office saree in humid weather.",COTTONCARE),
  // ─ Block Print Cotton ─
  mk(35,"Block Print Cotton Saree","Cotton","Block Print","BP-COTTON",2500,3200,"Cotton","Casual","Red","#c0392b",IMG.j,[IMG.d],true,false,false,"Hand block-printed cotton saree in traditional Rajasthani motifs. Each piece is stamped by hand using wooden blocks.",COTTONCARE),
  mk(36,"Block Print Cotton Saree","Cotton","Block Print","BP-COTTON",2600,3200,"Cotton","Casual","Blue","#1a6bb5",IMG.c,[IMG.m],false,false,false,"Cool blue block print cotton with floral jaal pattern — artisanal and chic for everyday wear.",COTTONCARE),
  // ─ Organza Party Wear ─
  mk(37,"Organza Sequin Party Saree","Party Wear","Designer","ORG-PARTY",7200,9000,"Organza","Party Wear","Pink","#d4006e",IMG.h,[IMG.f],true,true,false,"Stunning organza saree with hand-placed sequin embellishments and dramatic ruffled border. Perfect for cocktail parties and evening events.",PARTYCARE),
  mk(38,"Organza Sequin Party Saree","Party Wear","Designer","ORG-PARTY",7500,9500,"Organza","Party Wear","Gold","#c9940a",IMG.i,[IMG.k],false,false,true,"Burnished gold sequin organza — an absolute showstopper for sangeet nights and reception parties.",PARTYCARE),
  mk(39,"Organza Sequin Party Saree","Party Wear","Designer","ORG-PARTY",7000,9000,"Organza","Party Wear","Blue","#1a6bb5",IMG.m,[IMG.h],true,false,false,"Electric cobalt blue sequin organza — bold and contemporary for destination weddings.",PARTYCARE),
  mk(40,"Organza Sequin Party Saree","Party Wear","Designer","ORG-PARTY",7800,9500,"Organza","Party Wear","Red","#c0392b",IMG.j,[IMG.a],false,false,true,"Crimson red organza with gold sequin pallu — glamorous and unmissable at any event.",PARTYCARE),
  // ─ Net Embroidered ─
  mk(41,"Net Embroidered Evening Saree","Party Wear","Embroidered","NET-EMB",5800,7500,"Net","Party Wear","Gold","#c9940a",IMG.l,[IMG.h],false,true,true,"Glamorous net saree with dense floral embroidery across pallu and hem. Comes with matching stitched blouse.",PARTYCARE),
  mk(42,"Net Embroidered Evening Saree","Party Wear","Embroidered","NET-EMB",5500,7500,"Net","Party Wear","Red","#c0392b",IMG.j,[IMG.l],true,false,true,"Crimson net with gold thread embroidery — bold and dramatic for sangeet nights.",PARTYCARE),
  mk(43,"Net Embroidered Evening Saree","Party Wear","Embroidered","NET-EMB",5900,7500,"Net","Party Wear","Green","#1a5c2a",IMG.b,[IMG.n],false,false,false,"Emerald green net with silver embroidery — elegant and understated for formal parties.",PARTYCARE),
  // ─ Designer Lehenga-Style Saree ─
  mk(44,"Designer Lehenga Style Saree","Party Wear","Designer","DSG-LEHENGA",12000,15000,"Georgette","Party Wear","Gold","#c9940a",IMG.i,[IMG.k,IMG.l],false,true,true,"Pre-stitched designer saree with lehenga-style skirt and attached pallu. Ready to wear in minutes. Heavy embellishments.",PARTYCARE),
  mk(45,"Designer Lehenga Style Saree","Party Wear","Designer","DSG-LEHENGA",11500,15000,"Georgette","Party Wear","Pink","#d4006e",IMG.l,[IMG.i,IMG.f],true,false,true,"Rose gold designer lehenga saree with pre-stitched belt — ultra-glamorous for receptions and cocktail parties.",PARTYCARE),
  // ─ Printed Silk ─
  mk(46,"Digital Print Georgette Saree","Silk","Printed","PRT-GEO",3500,4500,"Georgette","Casual","Orange","#e67e22",IMG.f,[IMG.e],true,false,false,"Vibrant digital print georgette with floral pattern — lightweight and easy to drape for daily wear.",["Hand wash cold","Dry in shade","Iron on low"]),
  mk(47,"Digital Print Georgette Saree","Silk","Printed","PRT-GEO",3800,4500,"Georgette","Casual","Blue","#1a6bb5",IMG.m,[IMG.c],false,false,true,"Cool blue abstract print georgette — modern and contemporary for today's working woman.",["Hand wash cold","Do not bleach"]),
  // ─ Crepe Printed ─
  mk(48,"Crepe Printed Saree","Silk","Printed","PRT-CREPE",2800,3800,"Crepe","Office Wear","Purple","#7b4f8e",IMG.k,[IMG.h],true,false,false,"Smooth crepe saree with tasteful abstract print — elegant for boardrooms and office presentations.",["Hand wash gentle","Iron on low heat"]),
  mk(49,"Crepe Printed Saree","Silk","Printed","PRT-CREPE",2900,3800,"Crepe","Office Wear","Blue","#1a6bb5",IMG.c,[IMG.m],false,false,false,"Navy blue crepe with subtle geometric print — professional, comfortable, and wrinkle-resistant.",["Machine wash gentle","Iron on low"]),
  // ─ Office Wear ─
  mk(50,"Formal Silk Blend Office Saree","Silk","Office Wear","OFF-FORMAL",4500,5800,"Silk Blend","Office Wear","Grey","#6b7280",IMG.n,[IMG.c],false,false,false,"Refined silk blend saree in neutral grey — the perfect professional saree for corporate environments.",["Dry clean","Steam press","Store flat"]),
  mk(51,"Formal Silk Blend Office Saree","Silk","Office Wear","OFF-FORMAL",4200,5800,"Silk Blend","Office Wear","Blue","#1a6bb5",IMG.c,[IMG.n],true,false,true,"Corporate blue formal saree — understated elegance for client meetings and boardroom presentations.",["Dry clean","Store with tissue"]),
  // ─ Festive Special ─
  mk(52,"Festive Silk Saree","Silk","Kanjivaram","FST-SILK",6800,8500,"Pure Silk","Festival","Red","#c0392b",IMG.a,[IMG.j,IMG.g],false,true,true,"Festive pure silk saree in vibrant red with traditional woven border. Ideal for Pongal, Navratri, and all major Indian festivals.",SILKCARE),
  mk(53,"Festive Silk Saree","Silk","Paithani","FST-SILK",7200,8500,"Pure Silk","Festival","Yellow","#d4a800",IMG.e,[IMG.i],true,false,true,"Golden yellow festive silk with rich zari border — bright, cheerful, and auspicious for all celebrations.",SILKCARE),
  // ─ Casual Everyday ─
  mk(54,"Casual Cotton Everyday Saree","Cotton","Handloom","CAS-DAILY",1800,2500,"Cotton","Casual","Green","#1a5c2a",IMG.b,[IMG.n],true,false,false,"Comfortable handloom cotton saree for everyday wear. Breathable, easy to manage, and available in multiple colours.",COTTONCARE),
  mk(55,"Casual Cotton Everyday Saree","Cotton","Handloom","CAS-DAILY",1900,2500,"Cotton","Casual","Pink","#d4006e",IMG.f,[IMG.b],false,false,true,"Soft pink handloom cotton with minimal border — perfect for long days at home, travel, or light outings.",COTTONCARE),
  // ─ Office Wear Cotton ─
  mk(56,"Handloom Cotton Office Saree","Cotton","Handloom","COT-OFF",2400,3000,"Cotton","Office Wear","Blue","#1a6bb5",IMG.m,[IMG.c],false,false,false,"Crisp handloom cotton in office-friendly blue — comfortable through long workdays, easy to care for.",COTTONCARE),
  mk(57,"Handloom Cotton Office Saree","Cotton","Handloom","COT-OFF",2300,3000,"Cotton","Office Wear","White","#d4c8b0",IMG.n,[IMG.m],true,false,false,"Classic off-white office cotton saree with contrasting border — professional, cool, and fuss-free.",COTTONCARE),
];

const REVIEWS = [
  {id:1,name:"Priya Subramaniam",city:"Chennai",rating:5,text:"The Kanjivaram I ordered for my daughter's wedding was absolutely stunning. The zari work is incredibly intricate. Same quality since my mother shopped here in the 80s.",product:"Kanjivaram Temple Border Saree"},
  {id:2,name:"Anjali Mehta",city:"Mumbai",rating:5,text:"Delivery was on time and packaging was beautiful — wrapped in silk cloth inside a branded box. The Banarasi georgette drapes like a dream!",product:"Banarasi Floral Georgette Saree"},
  {id:3,name:"Kavitha Nair",city:"Bangalore",rating:4,text:"Great quality Chanderi saree. Lighter than expected — perfect for our hot weather. Customer service was very helpful in picking the right colour.",product:"Chanderi Silk-Cotton Saree"},
  {id:4,name:"Deepa Ramesh",city:"Coimbatore",rating:5,text:"Third time ordering from Lakshmiram's. Never disappoint. Bridal Kanjivaram for my niece's wedding was the showstopper. Every guest asked where it was from!",product:"Bridal Kanjivaram Set Saree"},
  {id:5,name:"Meena Krishnan",city:"Hyderabad",rating:5,text:"The Paithani saree I ordered is absolutely divine. The peacock motifs are so detailed and vibrant. Will definitely order again!",product:"Paithani Silk Saree"},
  {id:6,name:"Sudha Rajan",city:"Kochi",rating:4,text:"Very satisfied with the Tant cotton sarees. Great quality at this price point. Fast delivery and nice packaging too.",product:"Tant Handloom Cotton Saree"},
];

// Portrait-crop model images for hero banner — shows model head-to-toe
const BU = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=1800&h=900&fit=crop&crop=top&auto=format&q=90`;

const BANNERS = [
  {
    id: 1,
    tag: "Bridal Collection 2024",
    title: "The Kanjivaram\nBridal Edit",
    subtitle: "Heirloom pure silk sarees woven by the master craftsmen of Kanchipuram — timeless, resplendent, yours.",
    cta: "Explore Bridal",
    filter: "Wedding",
    img: `${import.meta.env.BASE_URL}assets/gold_saree_1783521135344.png`,
    textSide: "left" as const,
  },
  {
    id: 2,
    tag: "New Season",
    title: "Cool Blues &\nFestive Hues",
    subtitle: "Contemporary Banarasi and Chanderi silks in vibrant blues, greens and ivories — curated for the modern woman.",
    cta: "Shop Silk Sarees",
    filter: "Silk Sarees",
    img: `${import.meta.env.BASE_URL}assets/blue_saree_1783520914278.png`,
    textSide: "right" as const,
  },
  {
    id: 3,
    tag: "Festival Favourites",
    title: "Festive Reds\n& Celebration",
    subtitle: "Vivid pure silk sarees in auspicious reds and golds — crafted to make every occasion unforgettable.",
    cta: "View Collection",
    filter: "Festive",
    img: `${import.meta.env.BASE_URL}assets/red_saree_1783520892018.png`,
    textSide: "left" as const,
  },
  {
    id: 4,
    tag: "Just Arrived",
    title: "New Arrivals —\nMonsoon Edit",
    subtitle: "Fresh drapes in georgette, organza & printed cotton — effortlessly elegant for the season.",
    cta: "Shop New Arrivals",
    filter: "New Arrivals",
    img: `${import.meta.env.BASE_URL}assets/green_saree_1783520904771.png`,
    textSide: "right" as const,
  },
];

const CAT_CIRCLES = [
  {label:"Kanjivaram",   img:COLOR_IMGS.Red, filter:"Kanjivaram"},
  {label:"Banarasi",     img:COLOR_IMGS.Blue, filter:"Banarasi"},
  {label:"Cotton",       img:COLOR_IMGS.Green, filter:"Cotton Sarees"},
  {label:"Party Wear",   img:COLOR_IMGS.Pink, filter:"Party Wear"},
  {label:"Wedding",      img:COLOR_IMGS.Gold, filter:"Wedding"},
  {label:"Chanderi",     img:COLOR_IMGS.Yellow, filter:"Chanderi"},
  {label:"New Arrivals", img:COLOR_IMGS.Purple, filter:"New Arrivals"},
  {label:"Sale",         img:COLOR_IMGS.Gold, filter:"Sale"},
];

// ─── Category Filter ──────────────────────────────────────────────────────────
function matchesCategory(p: Product, cat: string): boolean {
  if (!cat) return true;
  switch (cat) {
    case "Silk Sarees":   return p.category === "Silk";
    case "Cotton Sarees": return p.category === "Cotton";
    case "Party Wear":    return p.category === "Party Wear";
    case "Wedding":       return p.occasion === "Wedding";
    case "Festive":       return p.occasion === "Festival";
    case "Office Wear":   return p.occasion === "Office Wear";
    case "Casual":        return p.occasion === "Casual";
    case "New Arrivals":  return p.isNew;
    case "Sale":          return p.discount > 0;
    default:              return p.subCategory === cat || p.category === cat || p.occasion === cat;
  }
}

// ─── Countdown Timer ──────────────────────────────────────────────────────────
function CountdownTimer() {
  const endRef = useRef<number>(0);
  const [time, setTime] = useState({ h: 11, m: 59, s: 59 });

  useEffect(() => {
    // Set end time to midnight tonight
    const d = new Date();
    d.setHours(23, 59, 59, 0);
    endRef.current = d.getTime();

    const tick = () => {
      const diff = Math.max(0, endRef.current - Date.now());
      setTime({
        h: Math.floor(diff / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="flex items-center gap-1">
      {(["h","m","s"] as const).map((unit, i) => (
        <div key={unit} className="flex items-center gap-1">
          <div className="bg-white text-accent font-lato font-black text-xl sm:text-2xl px-2.5 py-1.5 rounded-lg min-w-[44px] text-center shadow-inner">
            {pad(time[unit])}
          </div>
          {i < 2 && <span className="text-white font-black text-xl animate-pulse">:</span>}
        </div>
      ))}
      <div className="ml-2">
        <p className="font-lato text-[10px] text-white/60 uppercase tracking-wider leading-none">Hours</p>
        <p className="font-lato text-[10px] text-white/60 uppercase tracking-wider leading-none mt-1">&nbsp;&nbsp;&nbsp;Mins&nbsp;&nbsp;Secs</p>
      </div>
    </div>
  );
}

// ─── Stars ────────────────────────────────────────────────────────────────────
function Stars({ rating, size = 13 }: { rating: number; size?: number }) {
  return (
    <span className="inline-flex gap-0.5 items-center">
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={size} className={i <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-300"} />
      ))}
    </span>
  );
}

// ─── BackToHome ───────────────────────────────────────────────────────────────
function BackToHome({ onNav }: { onNav: () => void }) {
  return (
    <button onClick={onNav}
      className="inline-flex items-center gap-1.5 font-lato text-sm text-muted-foreground hover:text-primary transition-colors mb-5 group bg-muted hover:bg-primary/10 px-3 py-1.5 rounded-full">
      <Home size={13} className="group-hover:text-primary" />
      <span>Back to Home</span>
    </button>
  );
}

// ─── ProductCard (Pothys Style) ──────────────────────────────────────────────────────────────
function ProductCard({ product, onSelect, onAddToCart, wishlist, onToggleWishlist }: {
  product: Product; onSelect: (p: Product) => void;
  onAddToCart: (p: Product) => void; wishlist: number[]; onToggleWishlist: (id: number) => void;
}) {
  const inWish = wishlist.includes(product.id);
  return (
    <div className="group relative bg-white border-b border-border/40 pb-4 flex flex-col transition-all duration-300 hover:shadow-xl rounded-md overflow-hidden hover:border-border">
      {/* Image Container */}
      <div className="aspect-[3/4] relative overflow-hidden bg-[#f4f4f4] cursor-pointer" onClick={() => onSelect(product)}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        
        {/* Simple Pothys Style Badges */}
        <div className="absolute top-2 left-2 flex flex-col items-start gap-1">
          {product.isOffer && (
            <span className="bg-[#e91e63] text-white text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 shadow-sm">
              Sale
            </span>
          )}
          {product.isNew && (
            <span className="bg-white/90 backdrop-blur-sm text-foreground text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 shadow-sm">
              New
            </span>
          )}
        </div>

        {/* Wishlist Icon */}
        <button
          onClick={(e) => { e.stopPropagation(); onToggleWishlist(product.id); }}
          className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-md shadow-sm hover:bg-white text-foreground/40 hover:text-accent transition-all z-10"
        >
          <Heart size={16} className={inWish ? "fill-accent text-accent" : ""} />
        </button>
      </div>

      {/* Content Area */}
      <div className="pt-3 px-3 sm:px-4 flex flex-col flex-grow bg-white text-center sm:text-left justify-between">
        <div>
          <h3 
            className="font-playfair font-semibold text-sm sm:text-base text-foreground line-clamp-2 leading-snug cursor-pointer hover:text-primary transition-colors"
            onClick={() => onSelect(product)}
          >
            {product.name}
          </h3>
        </div>

        <div className="mt-auto">
          {/* Price Row */}
          <div className="mt-2 flex flex-wrap items-baseline justify-center sm:justify-start gap-2">
            <span className="font-lato font-bold text-[#d32f2f] text-base sm:text-lg">
              ₹{product.price.toLocaleString("en-IN")}
            </span>
            {product.isOffer && (
              <span className="font-lato text-xs text-foreground/50 line-through">
                ₹{product.originalPrice.toLocaleString("en-IN")}
              </span>
            )}
          </div>
          
          {product.isOffer && (
            <div className="mt-1 font-lato text-[10px] text-foreground/60 uppercase tracking-widest">
              ({Math.round((1 - product.price / product.originalPrice) * 100)}% OFF)
            </div>
          )}

          {/* Add to Cart Button */}
          <button
            onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
            className="mt-4 w-full py-2.5 bg-primary/5 hover:bg-primary text-primary hover:text-white font-lato text-xs font-bold uppercase tracking-widest rounded-sm transition-colors border border-primary/20 hover:border-primary"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Search Overlay ───────────────────────────────────────────────────────────
function SearchOverlay({ query, setQuery, onClose, onSelect }: {
  query: string; setQuery: (q: string) => void;
  onClose: () => void; onSelect: (p: Product) => void;
}) {
  const results = query.trim().length > 1
    ? PRODUCTS.filter(p =>
        [p.name, p.category, p.subCategory, p.fabric, p.occasion, p.color]
          .some(s => s.toLowerCase().includes(query.toLowerCase()))
      ).slice(0, 10)
    : [];

  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100]" onClick={onClose}>
      {/* Search bar */}
      <div className="bg-white border-b border-border shadow-2xl px-4 py-4" onClick={e => e.stopPropagation()}>
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <Search size={20} className="text-primary flex-shrink-0" />
          <input autoFocus
            className="flex-1 font-lato text-base text-foreground bg-transparent focus:outline-none placeholder:text-muted-foreground"
            placeholder="Search by name, fabric, colour, occasion…"
            value={query} onChange={e => setQuery(e.target.value)} />
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground p-1"><X size={20} /></button>
        </div>
      </div>

      {/* Results */}
      {results.length > 0 && (
        <div className="bg-white border-b border-border shadow-xl max-h-96 overflow-y-auto" onClick={e => e.stopPropagation()}>
          <div className="max-w-2xl mx-auto">
            <p className="font-lato text-xs text-muted-foreground px-4 pt-3 pb-1 border-b border-border">
              <span className="font-bold text-primary">{results.length}</span> results for &ldquo;{query}&rdquo;
            </p>
            {results.map(p => (
              <button key={p.id} onClick={() => { onSelect(p); onClose(); }}
                className="w-full flex items-center gap-4 px-4 py-3 hover:bg-muted transition-colors border-b border-border/40 text-left">
                <img src={p.image} alt={p.name} className="w-12 h-16 object-cover rounded-lg flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-playfair font-semibold text-sm truncate">{p.name}</p>
                  <p className="font-lato text-xs text-muted-foreground">{p.subCategory} · {p.color} · {p.fabric}</p>
                  <p className="font-lato text-sm font-bold text-primary mt-0.5">₹{p.price.toLocaleString("en-IN")} <span className="text-muted-foreground line-through font-normal text-xs">₹{p.originalPrice.toLocaleString("en-IN")}</span></p>
                </div>
                {p.isOffer && <span className="font-lato text-[10px] bg-accent text-white px-2 py-0.5 rounded flex-shrink-0">{p.discount}% OFF</span>}
              </button>
            ))}
          </div>
        </div>
      )}
      {query.trim().length > 1 && results.length === 0 && (
        <div className="bg-white border-b border-border shadow-xl" onClick={e => e.stopPropagation()}>
          <div className="max-w-2xl mx-auto px-4 py-8 text-center">
            <Search size={32} className="mx-auto text-muted-foreground mb-3" />
            <p className="font-lato text-muted-foreground text-sm">No results for &ldquo;{query}&rdquo;</p>
            <p className="font-lato text-xs text-muted-foreground mt-1">Try: silk, cotton, wedding, pink, Kanjivaram…</p>
          </div>
        </div>
      )}
      {/* Backdrop */}
      <div className="absolute inset-0 -z-10 bg-black/50 backdrop-blur-sm" />
    </div>
  );
}

// ─── Header ───────────────────────────────────────────────────────────────────
function Header({ cartCount, wishlistCount, onNav, onSearchOpen }: {
  cartCount: number; wishlistCount: number;
  onNav: (page: Page, extra?: { category?: string; product?: Product; staticSlug?: StaticSlug }) => void;
  onSearchOpen: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDrop, setOpenDrop] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const CATS = [
    {label:"Silk Sarees",  sub:["Kanjivaram","Banarasi","Mysore","Chanderi","Bhagalpuri","Paithani"]},
    {label:"Cotton Sarees",sub:["Handloom","Ikat","Linen","Block Print"]},
    {label:"Party Wear",   sub:["Designer","Embroidered","Net"]},
    {label:"Wedding",      sub:[]},
    {label:"Festive",      sub:[]},
    {label:"Office Wear",  sub:[]},
    {label:"New Arrivals", sub:[]},
    {label:"Sale",         sub:[]},
  ];

  return (
    <header className={`sticky top-0 z-50 transition-shadow duration-300 ${scrolled ? "shadow-lg" : ""}`}>
      <div className="bg-white border-b border-border">
        {/* ── 3-column: Logo (left) | Search (centre) | Icons (right) ── */}
        <div
          className="max-w-7xl mx-auto px-3 sm:px-6"
          style={{ display: "grid", gridTemplateColumns: "auto 1fr auto", alignItems: "center", minHeight: "68px", gap: "12px" }}
        >
          {/* ── LEFT — Logo ── */}
          <div className="flex items-center gap-2">
            {/* Mobile hamburger */}
            <button
              className="lg:hidden p-1.5 rounded-lg hover:bg-muted transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menu"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Logo */}
            <button
              onClick={() => { onNav("home"); setMenuOpen(false); }}
              className="hover:opacity-85 transition-opacity flex-shrink-0"
            >
              <img
                src={logoImage}
                alt="Lakshmiram's Since 1972"
                style={{
                  width: "clamp(140px, 18vw, 220px)",
                  height: "clamp(56px, 7.5vw, 88px)",
                  objectFit: "contain",
                  objectPosition: "left center",
                  display: "block",
                }}
              />
            </button>
          </div>

          {/* ── CENTRE — Search bar ── */}
          <div>
            {/* Tablet + Desktop: full pill search bar */}
            <button
              onClick={onSearchOpen}
              className="hidden sm:flex items-center gap-3 w-full bg-muted hover:bg-gray-100 border border-border hover:border-primary/40 rounded-full px-4 sm:px-5 py-2.5 transition-all duration-200 group shadow-sm"
            >
              <Search size={15} className="text-primary flex-shrink-0" />
              <span className="font-lato text-sm text-muted-foreground group-hover:text-foreground flex-1 text-left truncate">
                Search sarees, fabrics, occasions…
              </span>
              <span className="hidden xl:flex items-center gap-1 font-lato text-[10px] bg-white border border-border/70 px-1.5 py-0.5 rounded text-muted-foreground flex-shrink-0">
                ⌘ K
              </span>
            </button>
            {/* Mobile: icon */}
            <button
              className="sm:hidden p-2 rounded-full hover:bg-muted transition-colors"
              onClick={onSearchOpen}
              aria-label="Search"
            >
              <Search size={20} />
            </button>
          </div>

          {/* ── RIGHT — Account · Wishlist · Cart ── */}
          <div className="flex items-center gap-0 sm:gap-0.5">
            {/* Account — md+ */}
            <button
              onClick={() => onNav("account")}
              className="hidden md:flex flex-col items-center gap-0.5 px-2 sm:px-3 py-2 rounded-xl hover:bg-muted transition-colors group"
            >
              <User size={20} className="group-hover:text-primary transition-colors" />
              <span className="font-lato text-[9px] text-muted-foreground group-hover:text-primary uppercase tracking-wider">Account</span>
            </button>

            {/* Wishlist */}
            <button
              onClick={() => onNav("wishlist")}
              className="flex flex-col items-center gap-0.5 px-2 sm:px-3 py-2 rounded-xl hover:bg-muted transition-colors relative group"
            >
              <Heart
                size={20}
                className={`transition-colors ${wishlistCount > 0 ? "fill-accent text-accent" : "group-hover:text-accent"}`}
              />
              <span className={`font-lato text-[9px] uppercase tracking-wider hidden sm:block ${wishlistCount > 0 ? "text-accent font-bold" : "text-muted-foreground group-hover:text-accent"}`}>
                Wishlist
              </span>
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 right-0.5 bg-accent text-white font-lato font-black text-[9px] min-w-[16px] h-[16px] rounded-full flex items-center justify-center px-0.5 shadow-sm">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart */}
            <button
              onClick={() => onNav("cart")}
              className="flex flex-col items-center gap-0.5 px-2 sm:px-3 py-2 rounded-xl hover:bg-muted transition-colors relative group"
            >
              <ShoppingBag size={20} className="group-hover:text-primary transition-colors" />
              <span className="font-lato text-[9px] text-muted-foreground group-hover:text-primary uppercase tracking-wider hidden sm:block">Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-0.5 right-0.5 bg-primary text-white font-lato font-black text-[9px] min-w-[16px] h-[16px] rounded-full flex items-center justify-center px-0.5 shadow-sm">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* ── Desktop nav ── */}
        <nav className="hidden lg:block border-t border-border/60 bg-white/95">
          <div className="max-w-7xl mx-auto px-6 flex items-center justify-center">
            {CATS.map(cat => (
              <div key={cat.label} className="relative"
                onMouseEnter={() => setOpenDrop(cat.label)}
                onMouseLeave={() => setOpenDrop(null)}
              >
                <button
                  onClick={() => { onNav("listing", { category: cat.label }); setOpenDrop(null); }}
                  className={`flex items-center gap-1 px-3 py-2.5 font-lato text-[13px] font-semibold transition-colors border-b-2 border-transparent hover:border-primary hover:text-primary whitespace-nowrap ${cat.label === "Sale" ? "text-accent hover:border-accent hover:text-accent" : "text-foreground"}`}
                >
                  {cat.label === "Sale" && <Tag size={11} />}
                  {cat.label === "New Arrivals" && <Zap size={11} className="text-amber-500" />}
                  {cat.label}
                  {cat.sub.length > 0 && <ChevronDown size={11} />}
                </button>
                {cat.sub.length > 0 && openDrop === cat.label && (
                  <div className="absolute top-full left-0 w-48 bg-white border border-border rounded-b-xl shadow-2xl z-50 py-1.5">
                    {cat.sub.map(s => (
                      <button key={s} onClick={() => { onNav("listing", { category: s }); setOpenDrop(null); }}
                        className="w-full text-left px-4 py-2 font-lato text-sm text-foreground hover:bg-secondary hover:text-accent transition-colors">
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="ml-3 flex border-l border-border/50">
              {(["About","Contact"] as const).map(l => (
                <button key={l} onClick={() => onNav("static", { staticSlug: l === "About" ? "about" : "contact" })}
                  className="px-3 py-2.5 font-lato text-[13px] text-muted-foreground hover:text-primary transition-colors">
                  {l}
                </button>
              ))}
            </div>
          </div>
        </nav>

        {/* ── Mobile menu ── */}
        {menuOpen && (
          <div className="lg:hidden border-t border-border bg-white max-h-[75vh] overflow-y-auto">
            {CATS.map(cat => (
              <button key={cat.label} onClick={() => { onNav("listing", { category: cat.label }); setMenuOpen(false); }}
                className={`w-full text-left flex items-center gap-3 px-5 py-3 font-lato text-sm border-b border-border hover:bg-muted ${cat.label === "Sale" ? "text-accent font-bold" : "text-foreground"}`}>
                {cat.label === "Sale" && <Tag size={13} />}
                {cat.label === "New Arrivals" && <Zap size={13} className="text-amber-500" />}
                {cat.label}
              </button>
            ))}
            <button onClick={() => { onNav("wishlist"); setMenuOpen(false); }} className="w-full text-left flex items-center gap-3 px-5 py-3 font-lato text-sm border-b border-border hover:bg-muted">
              <Heart size={15} /> Wishlist
            </button>
            <button onClick={() => { onNav("account"); setMenuOpen(false); }} className="w-full text-left flex items-center gap-3 px-5 py-3 font-lato text-sm border-b border-border hover:bg-muted">
              <User size={15} /> My Account
            </button>
            <button onClick={() => { onNav("static",{staticSlug:"about"}); setMenuOpen(false); }} className="w-full text-left px-5 py-3 font-lato text-sm text-muted-foreground hover:bg-muted border-b border-border">About Us</button>
            <button onClick={() => { onNav("static",{staticSlug:"contact"}); setMenuOpen(false); }} className="w-full text-left px-5 py-3 font-lato text-sm text-muted-foreground hover:bg-muted">Contact Us</button>
          </div>
        )}
      </div>
    </header>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer({ onNav }: { onNav: (page: Page, extra?: { staticSlug?: StaticSlug }) => void }) {
  const links: { label: string; slug: StaticSlug }[] = [
    {label:"About Us",slug:"about"},{label:"Contact Us",slug:"contact"},
    {label:"Shipping Policy",slug:"shipping"},{label:"Return & Refund",slug:"returns"},
    {label:"Privacy Policy",slug:"privacy"},{label:"Terms & Conditions",slug:"terms"},
  ];
  return (
    <footer className="bg-primary text-white mt-16">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          {/* Footer logo — white pill so branding shows on green background */}
          <div className="inline-block bg-white rounded-2xl px-5 py-3 mb-3 shadow-sm">
            <img
              src={logoImage}
              alt="Lakshmiram's"
              style={{
                width: "170px",
                height: "68px",
                objectFit: "contain",
                objectPosition: "center",
                display: "block",
              }}
            />
          </div>
          <p className="font-lato text-sm text-green-100 leading-relaxed">Trusted by families across India since 1972. Authentic handwoven sarees directly from master weavers.</p>
          <div className="flex gap-3 mt-4">
            {([<Instagram size={16}/>,<Facebook size={16}/>,<Youtube size={16}/>] as React.ReactNode[]).map((icon,i) => (
              <a key={i} href="#" className="p-2 rounded-full bg-white/10 hover:bg-accent transition-colors">{icon}</a>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-playfair font-semibold text-base mb-4">Quick Links</h4>
          <ul className="space-y-2">
            {links.map(l => <li key={l.slug}><button onClick={() => onNav("static",{staticSlug:l.slug})} className="font-lato text-sm text-green-100 hover:text-white">{l.label}</button></li>)}
          </ul>
        </div>
        <div>
          <h4 className="font-playfair font-semibold text-base mb-4">Contact Us</h4>
          <div className="space-y-3">
            {([
              [<MapPin size={14}/>, "42, Silk Merchants Street,\nT. Nagar, Chennai – 600 017"],
              [<Phone size={14}/>, "+91 98765 43210"],
              [<Mail size={14}/>, "care@lakshmiramsarees.com"],
            ] as [React.ReactNode,string][]).map(([icon,text],i) => (
              <div key={i} className="flex gap-2 items-start">
                <span className="text-green-300 mt-0.5 flex-shrink-0">{icon}</span>
                <span className="font-lato text-sm text-green-100 whitespace-pre-line">{text}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-playfair font-semibold text-base mb-2">Stay in the Loop</h4>
          <p className="font-lato text-sm text-green-100 mb-3">New arrivals & exclusive offers in your inbox.</p>
          <div className="flex gap-2">
            <input type="email" placeholder="Your email" className="flex-1 px-3 py-2 font-lato text-sm rounded bg-white/10 border border-white/20 text-white placeholder:text-green-200 focus:outline-none focus:ring-2 focus:ring-accent" />
            <button className="bg-accent px-3 py-2 rounded hover:opacity-90 flex-shrink-0"><ArrowRight size={16} /></button>
          </div>
          <div className="mt-4">
            <p className="font-lato text-xs text-green-200 mb-2">We accept:</p>
            <div className="flex gap-2 flex-wrap">
              {["Visa","Mastercard","UPI","Net Banking","COD"].map(m => (
                <span key={m} className="font-lato text-[10px] border border-white/20 px-2 py-0.5 rounded">{m}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center font-lato text-xs text-green-200">
        © 2024 Lakshmiram&apos;s Sarees Pvt. Ltd. All rights reserved.
      </div>
    </footer>
  );
}

// ─── Home Page ─────────────────────────────────────────────────────────────────
function HomePage({ onNav, onAddToCart, wishlist, onToggleWishlist }: {
  onNav: (page: Page, extra?: { category?: string; product?: Product; staticSlug?: StaticSlug }) => void;
  onAddToCart: (p: Product) => void; wishlist: number[]; onToggleWishlist: (id: number) => void;
}) {
  const [slide, setSlide] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const advance = useCallback((dir: 1 | -1) => setSlide(s => (s + dir + BANNERS.length) % BANNERS.length), []);

  useEffect(() => {
    timerRef.current = setInterval(() => advance(1), 4500);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [advance]);

  const featured = PRODUCTS.filter(p => p.isFeatured);
  const newArrivals = PRODUCTS.filter(p => p.isNew);
  const offerProducts = PRODUCTS.filter(p => p.isOffer);

  return (
    <div>
      {/* ── Hero Banner (Split Layout) ── */}
      <section className="relative w-full bg-[#fdf8f0] overflow-hidden" style={{ minHeight: "clamp(480px, calc(100vh - 112px), 680px)" }}>
        {BANNERS.map((b, i) => {
          const isLeft = b.textSide === "left";
          return (
            <div
              key={b.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out flex flex-col md:flex-row ${i === slide ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"} ${isLeft ? "" : "md:flex-row-reverse"}`}
            >
              {/* Image Side (Mobile Top, Desktop Half) */}
              <div className="w-full md:w-1/2 h-[55%] md:h-full relative overflow-hidden bg-white">
                <img
                  src={b.img}
                  alt={b.title}
                  className="w-full h-full object-cover object-top"
                />
              </div>

              {/* Text Side (Mobile Bottom, Desktop Half) */}
              <div className="w-full md:w-1/2 h-[45%] md:h-full flex flex-col justify-center px-6 sm:px-12 lg:px-20 bg-[#fdf8f0] text-foreground">
                <div className="max-w-md mx-auto md:mx-0">
                  {/* Collection tag */}
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="h-px w-6 bg-primary/40" />
                    <p className="font-lato text-[10px] uppercase tracking-[0.3em] text-primary font-bold">
                      {b.tag}
                    </p>
                  </div>

                  {/* Headline */}
                  <h2
                    className="font-playfair font-bold text-foreground mb-4 leading-[1.15]"
                    style={{
                      fontSize: "clamp(2rem, 3.5vw, 3.5rem)",
                      whiteSpace: "pre-line",
                    }}
                  >
                    {b.title}
                  </h2>

                  {/* Decorative rule */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-[2px] w-12 rounded-full bg-accent" />
                    <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                  </div>

                  {/* Subtitle */}
                  <p className="font-lato text-[13px] sm:text-sm text-foreground/75 mb-6 leading-[1.7] max-w-sm">
                    {b.subtitle}
                  </p>

                  {/* CTA Buttons */}
                  <div className="flex flex-wrap items-center gap-4">
                    <button
                      onClick={() => onNav("listing", { category: b.filter })}
                      className="inline-flex items-center gap-2 font-lato font-semibold text-[10px] uppercase tracking-[0.2em] bg-primary text-white px-5 py-2.5 rounded hover:bg-accent transition-all duration-300 active:scale-95 shadow-md"
                    >
                      {b.cta}
                      <ArrowRight size={12} />
                    </button>
                    <button
                      onClick={() => onNav("listing", { category: b.filter })}
                      className="font-lato font-bold text-[10px] text-foreground hover:text-accent uppercase tracking-[0.2em] transition-colors border-b border-transparent hover:border-accent pb-0.5"
                    >
                      See all
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Dot indicators — bottom centre */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-white/50 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm">
          {BANNERS.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlide(i)}
              aria-label={`Slide ${i + 1}`}
              className={`rounded-full transition-all duration-400 ${i === slide ? "w-6 h-1.5 bg-primary" : "w-1.5 h-1.5 bg-primary/30 hover:bg-primary/60"}`}
            />
          ))}
        </div>
      </section>


      {/* ── OFFERS SECTION — Very Prominent ── */}
      <section className="relative overflow-hidden" style={{background:"linear-gradient(135deg,#1c0505 0%,#3a0808 35%,#2a0a20 70%,#1c0505 100%)"}}>
        <div className="absolute inset-0" style={{backgroundImage:"radial-gradient(ellipse at 10% 50%,rgba(212,0,110,0.35) 0%,transparent 55%),radial-gradient(ellipse at 90% 50%,rgba(245,166,35,0.25) 0%,transparent 55%),radial-gradient(ellipse at 50% 100%,rgba(192,57,43,0.2) 0%,transparent 50%)"}} />

        <div className="relative max-w-7xl mx-auto px-6 py-7">
          {/* Header row */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-accent rounded-xl shadow-lg shadow-accent/30 animate-pulse"><Flame size={22} className="text-white" /></div>
                <div>
                  <p className="font-lato text-xs text-amber-400 uppercase tracking-[0.2em] font-bold">Limited Time Deals</p>
                  <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-white leading-tight">Flash Sale — Today Only</h2>
                </div>
              </div>
              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-amber-300" />
                  <span className="font-lato text-xs text-amber-300 uppercase tracking-wider font-bold">Ends in</span>
                </div>
                <CountdownTimer />
              </div>
            </div>
            <button onClick={() => onNav("listing",{category:"Sale"})}
              className="inline-flex items-center gap-2 bg-accent text-white font-lato font-bold text-sm uppercase tracking-wider px-5 py-3 rounded-xl hover:bg-amber-500 transition-all shadow-lg shadow-accent/30 active:scale-95">
              <Tag size={15} /> All Deals <ArrowRight size={14} />
            </button>
          </div>

          {/* Offer product cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {offerProducts.slice(0, 5).map(p => (
              <ProductCard key={p.id} product={p} onSelect={pr => onNav("detail",{product:pr})} onAddToCart={onAddToCart} wishlist={wishlist} onToggleWishlist={onToggleWishlist} />
            ))}
          </div>

          {/* Bottom row — Discount Percentage Blocks */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <h3 className="font-playfair font-bold text-white text-lg mb-4 text-center">Shop by Discount</h3>
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
              {[10, 15, 20, 25, 30, 40].map(pct => (
                <button
                  key={pct}
                  onClick={() => onNav("listing", { category: "Sale" })}
                  className="group relative overflow-hidden bg-white/5 border border-white/10 hover:border-accent hover:bg-accent/10 px-6 sm:px-8 py-4 rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_20px_-10px_rgba(233,30,99,0.4)]"
                >
                  <div className="relative z-10 flex flex-col items-center">
                    <span className="font-playfair font-black text-2xl sm:text-3xl text-white group-hover:text-accent transition-colors">{pct}%</span>
                    <span className="font-lato font-bold text-[10px] text-white/60 uppercase tracking-widest mt-1 group-hover:text-white transition-colors">OFF</span>
                  </div>
                  <div className="absolute top-0 right-0 p-1 opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0">
                    <ArrowRight size={14} className="text-accent" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust Strip ── */}
      <section className="bg-white border-y border-border">
        <div className="max-w-7xl mx-auto px-6 py-3 grid grid-cols-2 md:grid-cols-4 gap-3">
          {([
            [<Truck size={18}/>, "Free Shipping", "On orders above ₹2,000"],
            [<RotateCcw size={18}/>, "Easy Returns", "7-day hassle-free returns"],
            [<Shield size={18}/>, "Authentic Weaves", "Directly from weavers"],
            [<Tag size={18}/>, "Best Prices", "No middlemen"],
          ] as [React.ReactNode,string,string][]).map(([icon,label,sub],i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="p-2 bg-muted rounded-full text-primary flex-shrink-0">{icon}</div>
              <div><p className="font-lato font-bold text-xs">{label}</p><p className="font-lato text-[11px] text-muted-foreground">{sub}</p></div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Category Circles ── */}
      <section className="max-w-7xl mx-auto px-6 pt-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="font-lato text-[10px] uppercase tracking-[0.22em] text-accent mb-0.5">Explore</p>
            <h2 className="font-playfair text-xl sm:text-2xl font-semibold">Shop by Category</h2>
          </div>
          <button onClick={() => onNav("listing")} className="font-lato text-xs text-primary hover:text-accent flex items-center gap-1 transition-colors">
            View All <ArrowRight size={12} />
          </button>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-3 sm:gap-4">
          {CAT_CIRCLES.map(c => (
            <button
              key={c.label}
              onClick={() => onNav("listing",{category:c.filter})}
              className="group flex flex-col items-center gap-2 outline-none"
            >
              {/* Circle image */}
              <div className="relative w-full aspect-square rounded-full overflow-hidden shadow-md group-hover:shadow-xl group-hover:shadow-accent/20 transition-all duration-300 ring-2 ring-transparent group-hover:ring-accent group-hover:ring-offset-2 group-hover:ring-offset-background">
                <img
                  src={c.img}
                  alt={c.label}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {/* Subtle overlay that intensifies on hover */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/25 group-hover:to-accent/30 transition-all duration-300" />
              </div>
              {/* Label */}
              <span className="font-lato text-[11px] sm:text-xs font-semibold text-foreground group-hover:text-accent transition-colors text-center leading-tight px-0.5">
                {c.label}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* ── Featured ── */}
      <section className="max-w-7xl mx-auto px-6 pt-8">
        <div className="flex items-end justify-between mb-5">
          <div><p className="font-lato text-[10px] uppercase tracking-[0.22em] text-accent mb-0.5">Handpicked for you</p><h2 className="font-playfair text-xl sm:text-2xl font-semibold">Featured Sarees</h2></div>
          <button onClick={() => onNav("listing")} className="font-lato text-xs text-primary hover:text-accent flex items-center gap-1 transition-colors">View All <ArrowRight size={12} /></button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {featured.map(p => <ProductCard key={p.id} product={p} onSelect={pr => onNav("detail",{product:pr})} onAddToCart={onAddToCart} wishlist={wishlist} onToggleWishlist={onToggleWishlist} />)}
        </div>
      </section>

      {/* ── Zig-Zag Collections (Pothys Style) ── */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-8">
        <div className="text-center mb-10">
          <p className="font-lato text-[10px] uppercase tracking-[0.22em] text-accent mb-1">Our Heritage</p>
          <h2 className="font-playfair text-2xl sm:text-3xl font-semibold">Curated Collections</h2>
          <div className="w-12 h-0.5 bg-accent mx-auto mt-4" />
        </div>

        <div className="flex flex-col gap-16">
          {/* Collection 1: Image Left, Text Right */}
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
            <div className="w-full md:w-1/2 aspect-[4/5] rounded-2xl overflow-hidden shadow-[0_20px_50px_-15px_rgba(13,107,36,0.2)]">
              <img src={COLOR_IMGS.Gold} alt="Bridal Kanjivaram" className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="w-full md:w-1/2 flex flex-col items-start text-left">
              <span className="font-lato text-[10px] uppercase tracking-[0.25em] text-primary font-bold mb-2">Authentic Weaves</span>
              <h3 className="font-playfair text-3xl font-bold text-foreground mb-4">The Bridal Kanjivaram Edit</h3>
              <p className="font-lato text-sm text-foreground/70 leading-relaxed mb-6">
                Discover our magnificent bridal collection woven by the master craftsmen of Kanchipuram. Featuring heavy korvai gold zari and intricate double-warp temple borders, these heirloom pieces are destined to be passed down through generations.
              </p>
              <button onClick={() => onNav("listing",{category:"Wedding"})} className="font-lato text-[11px] uppercase tracking-widest font-bold text-primary border-b-2 border-accent pb-1 hover:text-accent transition-colors">
                Explore Bridal Collection
              </button>
            </div>
          </div>

          {/* Collection 2: Text Left, Image Right */}
          <div className="flex flex-col md:flex-row-reverse items-center gap-8 md:gap-16">
            <div className="w-full md:w-1/2 aspect-[4/5] rounded-2xl overflow-hidden shadow-[0_20px_50px_-15px_rgba(233,30,99,0.2)]">
              <img src={COLOR_IMGS.Blue} alt="Banarasi Silks" className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="w-full md:w-1/2 flex flex-col items-start text-left md:text-right md:items-end">
              <span className="font-lato text-[10px] uppercase tracking-[0.25em] text-accent font-bold mb-2">Contemporary Heritage</span>
              <h3 className="font-playfair text-3xl font-bold text-foreground mb-4">Festive Banarasi & Georgette</h3>
              <p className="font-lato text-sm text-foreground/70 leading-relaxed mb-6 md:text-right">
                Luxurious Banarasi georgette with intricate floral motifs and delicate zari. Lightweight drapes designed for the modern woman, perfect for cocktail evenings, long festive events, and celebrations.
              </p>
              <button onClick={() => onNav("listing",{category:"Party Wear"})} className="font-lato text-[11px] uppercase tracking-widest font-bold text-accent border-b-2 border-primary pb-1 hover:text-primary transition-colors">
                Shop Party Wear
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── New Arrivals ── */}
      <section className="max-w-7xl mx-auto px-6 pt-8">
        <div className="flex items-end justify-between mb-5">
          <div><p className="font-lato text-[10px] uppercase tracking-[0.22em] text-accent mb-0.5">Just in</p><h2 className="font-playfair text-xl sm:text-2xl font-semibold">New Arrivals</h2></div>
          <button onClick={() => onNav("listing",{category:"New Arrivals"})} className="font-lato text-xs text-primary hover:text-accent flex items-center gap-1 transition-colors">View All <ArrowRight size={12} /></button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {newArrivals.slice(0,8).map(p => <ProductCard key={p.id} product={p} onSelect={pr => onNav("detail",{product:pr})} onAddToCart={onAddToCart} wishlist={wishlist} onToggleWishlist={onToggleWishlist} />)}
        </div>
      </section>

      {/* ── Reviews ── */}
      <section className="max-w-7xl mx-auto px-6 pt-8">
        <div className="text-center mb-5">
          <p className="font-lato text-[10px] uppercase tracking-[0.22em] text-accent mb-0.5">What our customers say</p>
          <h2 className="font-playfair text-xl sm:text-2xl font-semibold">Customer Stories</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {REVIEWS.map(r => (
            <div key={r.id} className="bg-card border border-border rounded-xl p-5 flex flex-col gap-3">
              <Stars rating={r.rating} />
              <p className="font-lato text-sm leading-relaxed flex-1">&ldquo;{r.text}&rdquo;</p>
              <div><p className="font-lato font-bold text-sm text-primary">{r.name}</p><p className="font-lato text-xs text-muted-foreground">{r.city} · {r.product}</p></div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Heritage CTA ── */}
      <section className="max-w-7xl mx-auto px-6 pt-8">
        <div className="relative overflow-hidden rounded-2xl py-14 px-8 sm:px-16 text-center" style={{background:"linear-gradient(135deg,#1a5c2a 0%,#0f3a19 100%)"}}>
          <div className="absolute inset-0 opacity-10" style={{backgroundImage:"radial-gradient(circle at 20% 50%,#d4006e 0%,transparent 60%),radial-gradient(circle at 80% 50%,#e8614e 0%,transparent 60%)"}} />
          <p className="font-lato text-xs uppercase tracking-[0.25em] text-green-300 mb-3">Trusted for over 50 years</p>
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-white mb-4">Woven with Tradition,<br />Delivered with Care</h2>
          <p className="font-lato text-sm text-green-100 max-w-lg mx-auto mb-6 leading-relaxed">Every saree is sourced directly from weavers who have inherited their craft across generations. When you choose Lakshmiram&apos;s, you support livelihoods and keep heritage alive.</p>
          <button onClick={() => onNav("static",{staticSlug:"about"})} className="inline-flex items-center gap-2 bg-accent text-white font-lato font-bold text-sm uppercase px-6 py-3 rounded-lg hover:opacity-90 shadow-lg shadow-accent/20">
            Our Story <ArrowRight size={14} />
          </button>
        </div>
      </section>
    </div>
  );
}

// ─── Listing Page ──────────────────────────────────────────────────────────────
function ListingPage({ initialCategory, onNav, onAddToCart, wishlist, onToggleWishlist }: {
  initialCategory?: string;
  onNav: (page: Page, extra?: { product?: Product }) => void;
  onAddToCart: (p: Product) => void; wishlist: number[]; onToggleWishlist: (id: number) => void;
}) {
  const [priceRange, setPriceRange] = useState<[number,number]>([0,40000]);
  const [selFabrics, setSelFabrics] = useState<string[]>([]);
  const [selColors, setSelColors] = useState<string[]>([]);
  const [selOccasions, setSelOccasions] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || "");
  const [sortBy, setSortBy] = useState("featured");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => { setSelectedCategory(initialCategory || ""); }, [initialCategory]);

  const allFabrics = [...new Set(PRODUCTS.map(p => p.fabric))].sort();
  const allColors = [...new Set(PRODUCTS.map(p => p.color))].sort();
  const allOccasions = [...new Set(PRODUCTS.map(p => p.occasion))].sort();
  const catOptions = [
    {label:"All Sarees",filter:""},{label:"Silk Sarees",filter:"Silk Sarees"},
    {label:"Cotton Sarees",filter:"Cotton Sarees"},{label:"Party Wear",filter:"Party Wear"},
    {label:"Wedding",filter:"Wedding"},{label:"Festive",filter:"Festive"},
    {label:"Office Wear",filter:"Office Wear"},{label:"Casual",filter:"Casual"},
    {label:"New Arrivals",filter:"New Arrivals"},{label:"Sale",filter:"Sale"},
  ];
  const colorHexMap: Record<string,string> = {
    Red:"#c0392b",Green:"#1a5c2a",Yellow:"#d4a800",Blue:"#1a6bb5",Pink:"#d4006e",
    Orange:"#e67e22",Gold:"#c9940a",Purple:"#7b4f8e",White:"#d4c8b0",Grey:"#6b7280",
  };

  const toggle = (arr: string[], set: React.Dispatch<React.SetStateAction<string[]>>, val: string) =>
    set(prev => prev.includes(val) ? prev.filter(x => x !== val) : [...prev, val]);

  const clearAll = () => {
    setPriceRange([0,40000]);setSelFabrics([]);setSelColors([]);setSelOccasions([]);setSelectedCategory("");
  };
  const hasActive = priceRange[0]>0||priceRange[1]<40000||selFabrics.length>0||selColors.length>0||selOccasions.length>0||!!selectedCategory;

  const filtered = PRODUCTS.filter(p => {
    if (p.price < priceRange[0] || p.price > priceRange[1]) return false;
    if (selFabrics.length && !selFabrics.includes(p.fabric)) return false;
    if (selColors.length && !selColors.includes(p.color)) return false;
    if (selOccasions.length && !selOccasions.includes(p.occasion)) return false;
    return matchesCategory(p, selectedCategory);
  }).sort((a,b) => {
    if (sortBy==="price-asc") return a.price-b.price;
    if (sortBy==="price-desc") return b.price-a.price;
    if (sortBy==="rating") return b.rating-a.rating;
    if (sortBy==="new") return (b.isNew?1:0)-(a.isNew?1:0);
    if (sortBy==="offers") return (b.isOffer?1:0)-(a.isOffer?1:0);
    return (b.isFeatured?1:0)-(a.isFeatured?1:0);
  });

  const FilterPanel = () => (
    <div className="space-y-5">
      {/* Clear All — TOP */}
      <button onClick={clearAll}
        className={`w-full font-lato text-xs font-bold uppercase tracking-wider py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all ${hasActive?"bg-accent text-white shadow-md hover:bg-accent/80":"border-2 border-dashed border-border text-muted-foreground hover:border-primary hover:text-primary"}`}>
        <X size={13} /> {hasActive ? "Clear All Filters" : "No Filters Active"}
      </button>

      {/* Product count */}
      <div className="bg-primary/10 border border-primary/20 rounded-xl px-3 py-2 text-center">
        <p className="font-lato text-sm font-bold text-primary">{filtered.length} Products Found</p>
      </div>

      {/* Category */}
      <div>
        <h3 className="font-lato font-bold text-xs uppercase tracking-widest mb-2 text-foreground">Category</h3>
        <div className="space-y-0.5">
          {catOptions.map(c => (
            <button key={c.filter} onClick={() => setSelectedCategory(c.filter)}
              className={`w-full text-left font-lato text-sm px-2 py-1.5 rounded-lg transition-colors flex items-center justify-between group ${selectedCategory===c.filter?"bg-primary text-white font-bold":"hover:bg-muted hover:text-primary"}`}>
              <span>{c.label}</span>
              <span className={`font-lato text-[11px] ${selectedCategory===c.filter?"text-white/70":"text-muted-foreground"}`}>
                {PRODUCTS.filter(p => matchesCategory(p,c.filter)).length}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="h-px bg-border" />

      {/* Price */}
      <div>
        <h3 className="font-lato font-bold text-xs uppercase tracking-widest mb-3">Price Range</h3>
        <input type="range" min={0} max={40000} step={500} value={priceRange[1]}
          onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])} className="w-full accent-primary" />
        <div className="flex justify-between font-lato text-xs text-muted-foreground mt-1">
          <span>₹0</span><span>₹{priceRange[1].toLocaleString("en-IN")}</span>
        </div>
        <div className="grid grid-cols-2 gap-1.5 mt-2">
          {[[0,3000],[3000,8000],[8000,15000],[15000,40000]].map(([lo,hi]) => (
            <button key={`${lo}-${hi}`} onClick={() => setPriceRange([lo,hi])}
              className={`font-lato text-[11px] py-1 px-2 rounded-lg border transition-colors ${priceRange[0]===lo&&priceRange[1]===hi?"bg-primary text-white border-primary":"border-border hover:border-primary"}`}>
              ₹{lo>0?lo/1000+"k":"0"}–₹{hi/1000}k
            </button>
          ))}
        </div>
      </div>

      <div className="h-px bg-border" />

      {/* Fabric */}
      <div>
        <h3 className="font-lato font-bold text-xs uppercase tracking-widest mb-2">Fabric</h3>
        {allFabrics.map(f => (
          <label key={f} className="flex items-center gap-2 py-1 cursor-pointer group">
            <input type="checkbox" checked={selFabrics.includes(f)} onChange={() => toggle(selFabrics,setSelFabrics,f)} className="w-3.5 h-3.5 accent-primary" />
            <span className="font-lato text-sm group-hover:text-primary">{f}</span>
          </label>
        ))}
      </div>

      <div className="h-px bg-border" />

      {/* Color */}
      <div>
        <h3 className="font-lato font-bold text-xs uppercase tracking-widest mb-3">Color</h3>
        <div className="flex flex-wrap gap-2">
          {allColors.map(c => (
            <button key={c} title={c} onClick={() => toggle(selColors,setSelColors,c)}
              className={`w-7 h-7 rounded-full border-2 transition-all ${selColors.includes(c)?"border-foreground scale-110 shadow-md":"border-gray-200 hover:scale-105 hover:border-gray-400"}`}
              style={{background: colorHexMap[c]||"#888"}} />
          ))}
        </div>
        {selColors.length > 0 && (
          <p className="font-lato text-xs text-muted-foreground mt-2">{selColors.join(", ")}</p>
        )}
      </div>

      <div className="h-px bg-border" />

      {/* Occasion */}
      <div>
        <h3 className="font-lato font-bold text-xs uppercase tracking-widest mb-2">Occasion</h3>
        {allOccasions.map(o => (
          <label key={o} className="flex items-center gap-2 py-1 cursor-pointer group">
            <input type="checkbox" checked={selOccasions.includes(o)} onChange={() => toggle(selOccasions,setSelOccasions,o)} className="w-3.5 h-3.5 accent-primary" />
            <span className="font-lato text-sm group-hover:text-primary">{o}</span>
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <BackToHome onNav={() => onNav("home" as Page)} />

      {/* Page header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="font-playfair text-2xl sm:text-3xl font-semibold">{selectedCategory || "All Sarees"}</h1>
          <p className="font-lato text-sm text-muted-foreground mt-0.5">
            <span className="font-bold text-primary">{filtered.length}</span> products found
            {hasActive && <button onClick={clearAll} className="ml-3 text-accent hover:underline text-xs font-bold">✕ Clear all filters</button>}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="lg:hidden flex items-center gap-2 font-lato text-sm border border-border rounded-lg px-3 py-2 hover:border-primary relative transition-colors" onClick={() => setShowFilters(true)}>
            <Filter size={14} /> Filters
            {hasActive && <span className="absolute -top-1.5 -right-1.5 bg-accent text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">!</span>}
          </button>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)}
            className="font-lato text-sm border border-border rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-primary/30">
            <option value="featured">Featured</option>
            <option value="offers">Offers First</option>
            <option value="new">Newest First</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>

      {/* Mobile filter drawer */}
      {showFilters && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowFilters(false)} />
          <div className="relative ml-auto w-72 bg-background h-full overflow-y-auto p-5 shadow-2xl">
            <div className="flex justify-between items-center mb-5">
              <h2 className="font-playfair font-semibold text-lg">Filters</h2>
              <button onClick={() => setShowFilters(false)} className="p-1 hover:text-accent"><X size={20} /></button>
            </div>
            <FilterPanel />
          </div>
        </div>
      )}

      <div className="flex gap-8">
        <aside className="hidden lg:block w-60 flex-shrink-0 sticky top-24 self-start max-h-[calc(100vh-6rem)] overflow-y-auto pr-2">
          <FilterPanel />
        </aside>
        <div className="flex-1 min-w-0">
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <Filter size={40} className="mx-auto text-muted-foreground mb-3" />
              <p className="font-playfair text-xl text-muted-foreground mb-2">No sarees match your filters</p>
              <button onClick={clearAll} className="font-lato text-sm text-accent hover:underline font-bold">Clear all filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map(p => (
                <ProductCard key={p.id} product={p} onSelect={pr => onNav("detail",{product:pr})} onAddToCart={onAddToCart} wishlist={wishlist} onToggleWishlist={onToggleWishlist} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Detail Page ───────────────────────────────────────────────────────────────
function DetailPage({ product, onAddToCart, onNav, wishlist, onToggleWishlist }: {
  product: Product; onAddToCart: (p: Product, qty: number) => void;
  onNav: (page: Page, extra?: { category?: string; product?: Product }) => void;
  wishlist: number[]; onToggleWishlist: (id: number) => void;
}) {
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState<"desc"|"care"|"reviews">("desc");
  const [zoomed, setZoomed] = useState(false);
  const [coupon, setCoupon] = useState("");
  const [couponMsg, setCouponMsg] = useState<{text:string;ok:boolean}|null>(null);

  useEffect(() => { setActiveImg(0); setQty(1); setCouponMsg(null); }, [product.id]);

  // Color variants — same colorGroup
  const colorVariants = PRODUCTS.filter(p => p.colorGroup === product.colorGroup && p.id !== product.id);
  const related = PRODUCTS.filter(p => p.id !== product.id && p.colorGroup !== product.colorGroup && (p.category === product.category || p.occasion === product.occasion)).slice(0,4);

  const applyCoupon = () => {
    const code = coupon.toUpperCase();
    if (code==="WELCOME10") setCouponMsg({text:"✓ 10% discount will be applied at checkout!",ok:true});
    else if (code==="SILK20") setCouponMsg({text:"✓ 20% discount will be applied at checkout!",ok:true});
    else setCouponMsg({text:"Invalid code. Try WELCOME10 or SILK20.",ok:false});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <BackToHome onNav={() => onNav("home")} />
      <nav className="flex items-center gap-2 font-lato text-xs text-muted-foreground mb-6 flex-wrap">
        <button onClick={() => onNav("home")} className="hover:text-primary">Home</button>
        <ChevronRight size={12} />
        <button onClick={() => onNav("listing",{category:product.category + (product.category==="Silk"?" Sarees":product.category==="Cotton"?" Sarees":"")})} className="hover:text-primary">{product.category}</button>
        <ChevronRight size={12} />
        <span className="text-foreground line-clamp-1">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left — Images */}
        <div>
          <div className="flex gap-3">
            {/* Thumbnails */}
            <div className="flex flex-col gap-2 w-16 flex-shrink-0">
              {product.images.map((img,i) => (
                <button key={i} onClick={() => setActiveImg(i)}
                  className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${i===activeImg?"border-accent shadow-md shadow-pink-100":"border-border hover:border-primary"}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
            {/* Main image */}
            <div className="flex-1 relative">
              <div className="aspect-[3/4] overflow-hidden rounded-2xl bg-muted cursor-zoom-in relative shadow-lg" onClick={() => setZoomed(true)}>
                <img src={product.images[activeImg]} alt={product.name} className="w-full h-full object-cover transition-all duration-300" />
                {product.isOffer && (
                  <div className="absolute top-0 inset-x-0 bg-accent text-white font-lato text-xs font-bold text-center py-2 flex items-center justify-center gap-1.5">
                    <Flame size={13} /> Special Offer — Save ₹{(product.originalPrice-product.price).toLocaleString("en-IN")}
                  </div>
                )}
                <div className="absolute bottom-3 right-3 bg-white/85 rounded-full p-2 shadow-md"><ZoomIn size={16} className="text-foreground" /></div>
                {product.stock <= 3 && (
                  <div className="absolute top-3 left-3 bg-amber-500 text-white font-lato text-xs font-bold px-2 py-1 rounded-lg">Only {product.stock} left!</div>
                )}
              </div>
              {zoomed && (
                <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4" onClick={() => setZoomed(false)}>
                  <img src={product.images[activeImg]} alt={product.name} className="max-h-full max-w-full object-contain rounded-xl shadow-2xl" />
                  <button className="absolute top-4 right-4 text-white p-2 bg-white/20 rounded-full hover:bg-white/40"><X size={20} /></button>
                </div>
              )}
            </div>
          </div>

          {/* ── Colour Variants ── Flipkart / Amazon style */}
          {colorVariants.length > 0 && (
            <div className="mt-5 p-4 bg-card border border-border rounded-2xl shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <p className="font-lato text-xs uppercase tracking-widest font-bold text-foreground">Also Available In</p>
                <span className="font-lato text-xs text-muted-foreground">{colorVariants.length + 1} colours</span>
              </div>
              <div className="flex gap-3 flex-wrap">
                {/* Current colour — selected state */}
                <div className="flex flex-col items-center gap-1.5">
                  <div className="relative w-16 h-[90px] rounded-xl overflow-hidden border-2 border-accent shadow-lg shadow-pink-100">
                    <img src={product.image} alt={product.color} className="w-full h-full object-cover" />
                    <div className="absolute bottom-1 right-1 w-4 h-4 bg-accent rounded-full flex items-center justify-center shadow"><Check size={9} className="text-white" /></div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full" style={{background:product.colorHex}} />
                    <span className="font-lato text-[10px] font-bold text-accent">{product.color}</span>
                  </div>
                  <span className="font-lato text-[10px] font-bold text-primary">₹{product.price.toLocaleString("en-IN")}</span>
                </div>

                {/* Other colour variants */}
                {colorVariants.map(v => (
                  <button key={v.id} onClick={() => { onNav("detail",{product:v}); window.scrollTo(0,0); }}
                    className="flex flex-col items-center gap-1.5 group">
                    <div className="w-16 h-[90px] rounded-xl overflow-hidden border-2 border-border group-hover:border-primary transition-all shadow-sm group-hover:shadow-md group-hover:shadow-green-100">
                      <img src={v.image} alt={v.color} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full border border-gray-200" style={{background:v.colorHex}} />
                      <span className="font-lato text-[10px] text-muted-foreground group-hover:text-foreground">{v.color}</span>
                    </div>
                    <span className="font-lato text-[10px] text-muted-foreground group-hover:text-primary">₹{v.price.toLocaleString("en-IN")}</span>
                    {v.isOffer && <span className="font-lato text-[9px] text-accent font-bold flex items-center gap-0.5"><Flame size={8}/> Offer</span>}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right — Product Info */}
        <div>
          <div className="flex flex-wrap gap-2 mb-3">
            {product.isNew && <span className="bg-accent text-white font-lato text-[10px] font-bold uppercase px-2 py-1 rounded-lg">New Arrival</span>}
            {product.discount >= 15 && <span className="bg-primary text-white font-lato text-[10px] font-bold uppercase px-2 py-1 rounded-lg">{product.discount}% Off</span>}
            {product.isOffer && <span className="bg-amber-500 text-white font-lato text-[10px] font-bold uppercase px-2 py-1 rounded-lg flex items-center gap-1"><Flame size={10}/> Special Offer</span>}
          </div>

          <h1 className="font-playfair text-2xl sm:text-3xl font-semibold leading-snug">{product.name}</h1>
          <div className="flex items-center gap-3 mt-2">
            <Stars rating={product.rating} size={16} />
            <span className="font-lato text-sm text-muted-foreground">({product.reviewCount} reviews)</span>
          </div>

          <div className="flex items-baseline gap-3 mt-4">
            <span className={`font-lato text-3xl font-bold ${product.isOffer?"text-accent":"text-primary"}`}>₹{product.price.toLocaleString("en-IN")}</span>
            <span className="font-lato text-base text-muted-foreground line-through">₹{product.originalPrice.toLocaleString("en-IN")}</span>
            <span className="font-lato text-sm font-bold text-accent bg-secondary px-2 py-0.5 rounded">Save ₹{(product.originalPrice-product.price).toLocaleString("en-IN")}</span>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-5">
            {([["Fabric",product.fabric],["Occasion",product.occasion],["Color",product.color],["Category",product.subCategory]] as [string,string][]).map(([k,v]) => (
              <div key={k} className="bg-muted rounded-xl px-3 py-2">
                <p className="font-lato text-[10px] uppercase tracking-wider text-muted-foreground">{k}</p>
                <p className="font-lato font-bold text-sm">{v}</p>
              </div>
            ))}
          </div>

          <div className={`mt-4 flex items-center gap-2 font-lato text-sm font-bold ${product.stock>5?"text-primary":product.stock>0?"text-amber-600":"text-destructive"}`}>
            {product.stock>0?<Check size={15}/>:<AlertCircle size={15}/>}
            {product.stock>5?"In Stock — Ready to Ship":product.stock>0?`Only ${product.stock} left — order soon!`:"Currently Out of Stock"}
          </div>

          <div className="mt-5 flex gap-3">
            <div className="flex items-center border border-border rounded-xl overflow-hidden shadow-sm">
              <button onClick={() => setQty(Math.max(1,qty-1))} className="px-3 py-2.5 hover:bg-muted transition-colors"><Minus size={14}/></button>
              <span className="px-4 font-lato font-bold border-x border-border min-w-[40px] text-center">{qty}</span>
              <button onClick={() => setQty(Math.min(product.stock,qty+1))} className="px-3 py-2.5 hover:bg-muted transition-colors"><Plus size={14}/></button>
            </div>
            <button onClick={() => onAddToCart(product,qty)} disabled={product.stock===0}
              className={`flex-1 py-2.5 font-lato font-bold text-sm uppercase tracking-wider rounded-xl transition-all disabled:opacity-40 shadow-md active:scale-95 ${product.isOffer?"bg-accent text-white hover:bg-primary shadow-accent/20":"bg-primary text-white hover:bg-accent shadow-primary/20"}`}>
              Add to Cart
            </button>
            <button onClick={() => onToggleWishlist(product.id)}
              className={`p-2.5 border-2 rounded-xl transition-all ${wishlist.includes(product.id)?"border-accent text-accent bg-secondary":"border-border hover:border-accent hover:text-accent"}`}>
              <Heart size={18} className={wishlist.includes(product.id)?"fill-accent":""} />
            </button>
          </div>

          {/* Coupon */}
          <div className="mt-4 p-4 bg-secondary rounded-2xl border border-border">
            <p className="font-lato text-xs font-bold uppercase tracking-widest text-accent mb-2 flex items-center gap-1.5"><Tag size={12}/> Apply Coupon Code</p>
            <div className="flex gap-2">
              <input value={coupon} onChange={e=>setCoupon(e.target.value)} placeholder="Enter code" onKeyDown={e=>{if(e.key==="Enter")applyCoupon();}}
                className="flex-1 px-3 py-2 font-lato text-sm border border-border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 uppercase tracking-wider"/>
              <button onClick={applyCoupon} className="px-4 py-2 bg-primary text-white font-lato text-sm font-bold rounded-xl hover:bg-accent transition-colors">Apply</button>
            </div>
            {couponMsg && <p className={`font-lato text-xs mt-2 flex items-center gap-1 ${couponMsg.ok?"text-primary":"text-destructive"}`}>{couponMsg.ok?<Check size={11}/>:<AlertCircle size={11}/>} {couponMsg.text}</p>}
            <p className="font-lato text-[11px] text-muted-foreground mt-2">Available codes: <span className="font-bold text-primary">WELCOME10</span> (10% off) · <span className="font-bold text-primary">SILK20</span> (20% off)</p>
          </div>

          {/* Trust badges */}
          <div className="mt-4 flex flex-wrap gap-2">
            {([
              [<Truck size={13}/>, "Free delivery above ₹2,000"],
              [<RotateCcw size={13}/>, "7-day hassle-free returns"],
              [<Shield size={13}/>, "100% authentic weaves"],
            ] as [React.ReactNode,string][]).map(([icon,text],i) => (
              <span key={i} className="flex items-center gap-1.5 font-lato text-xs text-muted-foreground border border-border rounded-full px-3 py-1.5 bg-white">
                <span className="text-primary">{icon}</span> {text}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-12 border-b border-border">
        <div className="flex gap-0">
          {(["desc","care","reviews"] as const).map(t => {
            const labels = {desc:"Description",care:"Fabric Care",reviews:`Reviews (${product.reviewCount})`};
            return (
              <button key={t} onClick={() => setActiveTab(t)}
                className={`font-lato text-sm px-6 py-3.5 border-b-2 transition-colors ${activeTab===t?"border-accent text-accent font-bold":"border-transparent text-muted-foreground hover:text-foreground"}`}>
                {labels[t]}
              </button>
            );
          })}
        </div>
      </div>
      <div className="py-6 max-w-2xl">
        {activeTab==="desc" && <p className="font-lato text-sm leading-relaxed text-foreground">{product.description}</p>}
        {activeTab==="care" && (
          <ul className="space-y-3">
            {product.careInstructions.map((c,i) => <li key={i} className="flex items-start gap-3 font-lato text-sm"><Check size={14} className="text-primary mt-0.5 flex-shrink-0"/>{c}</li>)}
          </ul>
        )}
        {activeTab==="reviews" && (
          <div className="space-y-4">
            {REVIEWS.slice(0,4).map(r => (
              <div key={r.id} className="border border-border rounded-xl p-5 bg-card">
                <div className="flex items-start justify-between gap-2">
                  <div><p className="font-lato font-bold text-sm">{r.name}</p><p className="font-lato text-xs text-muted-foreground">{r.city}</p></div>
                  <Stars rating={r.rating} />
                </div>
                <p className="font-lato text-sm mt-3 leading-relaxed">&ldquo;{r.text}&rdquo;</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {related.length > 0 && (
        <div className="mt-8">
          <h2 className="font-playfair text-xl font-semibold mb-5">You May Also Like</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {related.map(p => <ProductCard key={p.id} product={p} onSelect={pr=>{onNav("detail",{product:pr});window.scrollTo(0,0);}} onAddToCart={onAddToCart} wishlist={wishlist} onToggleWishlist={onToggleWishlist}/>)}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Cart Page ─────────────────────────────────────────────────────────────────
function CartPage({ cart, onUpdateQty, onRemove, onNav }: {
  cart: CartItem[]; onUpdateQty: (id:number,qty:number) => void;
  onRemove: (id:number) => void; onNav: (page:Page) => void;
}) {
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponMsg, setCouponMsg] = useState<{text:string;ok:boolean}|null>(null);
  const subtotal = cart.reduce((s,c) => s+c.product.price*c.quantity, 0);
  const shipping = subtotal>=2000?0:120;
  const total = subtotal+shipping-discount;

  const applyCoupon = () => {
    const code = coupon.toUpperCase();
    if (code==="WELCOME10"){setDiscount(Math.round(subtotal*.1));setCouponMsg({text:"10% off applied!",ok:true});}
    else if (code==="SILK20"){setDiscount(Math.round(subtotal*.2));setCouponMsg({text:"20% off applied!",ok:true});}
    else{setDiscount(0);setCouponMsg({text:"Invalid code. Try WELCOME10 or SILK20.",ok:false});}
  };

  if (cart.length===0) return (
    <div className="max-w-lg mx-auto px-6 py-24 text-center">
      <BackToHome onNav={() => onNav("home")} />
      <ShoppingBag size={56} className="mx-auto text-muted-foreground mb-4"/>
      <h2 className="font-playfair text-2xl font-semibold mb-2">Your cart is empty</h2>
      <p className="font-lato text-sm text-muted-foreground mb-6">Discover our beautiful collection of sarees</p>
      <button onClick={() => onNav("listing")} className="inline-flex items-center gap-2 bg-primary text-white font-lato font-bold text-sm uppercase px-6 py-3 rounded-xl hover:bg-accent shadow-md">
        Browse Sarees <ArrowRight size={14}/>
      </button>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <BackToHome onNav={() => onNav("home")} />
      <h1 className="font-playfair text-2xl sm:text-3xl font-semibold mb-8">Shopping Cart <span className="text-muted-foreground text-xl">({cart.length} {cart.length===1?"item":"items"})</span></h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cart.map(({product,quantity}) => (
            <div key={product.id} className={`bg-card border rounded-2xl p-4 flex gap-4 transition-all hover:shadow-md ${product.isOffer?"border-accent/50 bg-secondary/30":"border-border"}`}>
              <img src={product.image} alt={product.name} className="w-20 h-28 object-cover rounded-xl flex-shrink-0 shadow-sm"/>
              <div className="flex-1 min-w-0">
                <p className="font-lato text-[10px] uppercase tracking-widest text-muted-foreground">{product.subCategory}</p>
                <h3 className="font-playfair font-semibold text-sm leading-snug mt-0.5">{product.name}</h3>
                <p className="font-lato text-xs text-muted-foreground mt-0.5">{product.fabric} · {product.color}</p>
                {product.isOffer && <span className="font-lato text-[10px] text-accent font-bold flex items-center gap-0.5 mt-0.5"><Flame size={9}/> Special Offer</span>}
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center border border-border rounded-xl overflow-hidden shadow-sm">
                    <button onClick={()=>onUpdateQty(product.id,quantity-1)} className="px-2.5 py-1.5 hover:bg-muted transition-colors"><Minus size={13}/></button>
                    <span className="px-3 font-lato text-sm font-bold border-x border-border">{quantity}</span>
                    <button onClick={()=>onUpdateQty(product.id,quantity+1)} className="px-2.5 py-1.5 hover:bg-muted transition-colors"><Plus size={13}/></button>
                  </div>
                  <p className={`font-lato font-bold text-base ${product.isOffer?"text-accent":"text-primary"}`}>₹{(product.price*quantity).toLocaleString("en-IN")}</p>
                </div>
              </div>
              <button onClick={()=>onRemove(product.id)} className="text-muted-foreground hover:text-destructive self-start flex-shrink-0 p-1 rounded-lg hover:bg-red-50 transition-all"><Trash2 size={16}/></button>
            </div>
          ))}
        </div>
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
            <h2 className="font-playfair font-semibold text-base mb-4">Order Summary</h2>
            <div className="space-y-2.5">
              <div className="flex justify-between font-lato text-sm"><span className="text-muted-foreground">Subtotal ({cart.reduce((s,c)=>s+c.quantity,0)} items)</span><span>₹{subtotal.toLocaleString("en-IN")}</span></div>
              <div className="flex justify-between font-lato text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className={shipping===0?"text-primary font-bold":""}>{shipping===0?"FREE ✓":`₹${shipping}`}</span>
              </div>
              {discount>0 && <div className="flex justify-between font-lato text-sm font-bold text-primary"><span>Coupon Discount</span><span>−₹{discount.toLocaleString("en-IN")}</span></div>}
              <div className="h-px bg-border"/>
              <div className="flex justify-between font-lato font-bold text-base"><span>Total</span><span className="text-primary text-xl">₹{total.toLocaleString("en-IN")}</span></div>
            </div>
            {shipping===0 && <p className="font-lato text-xs text-primary mt-2 flex items-center gap-1.5 bg-primary/5 rounded-lg px-2 py-1.5"><Truck size={12}/> Free shipping applied!</p>}
          </div>

          <div className="bg-card border border-border rounded-2xl p-4">
            <p className="font-lato text-xs font-bold uppercase tracking-widest text-accent mb-2 flex items-center gap-1"><Tag size={12}/> Coupon Code</p>
            <div className="flex gap-2">
              <input value={coupon} onChange={e=>setCoupon(e.target.value)} placeholder="Enter code" onKeyDown={e=>{if(e.key==="Enter")applyCoupon();}}
                className="flex-1 px-3 py-2 font-lato text-sm border border-border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 uppercase"/>
              <button onClick={applyCoupon} className="px-3 py-2 bg-primary text-white font-lato text-sm font-bold rounded-xl hover:bg-accent transition-colors">Apply</button>
            </div>
            {couponMsg && <p className={`font-lato text-xs mt-2 flex items-center gap-1 ${couponMsg.ok?"text-primary":"text-destructive"}`}>{couponMsg.ok?<Check size={11}/>:<AlertCircle size={11}/>} {couponMsg.text}</p>}
            <p className="font-lato text-[11px] text-muted-foreground mt-2">Codes: <strong>WELCOME10</strong> · <strong>SILK20</strong></p>
          </div>

          <button className="w-full py-3.5 bg-primary text-white font-lato font-bold text-sm uppercase tracking-wider rounded-2xl hover:bg-accent transition-colors shadow-lg shadow-primary/20 active:scale-95">
            Proceed to Checkout →
          </button>
          <button onClick={() => onNav("listing")} className="w-full py-2 font-lato text-sm text-muted-foreground hover:text-primary transition-colors">← Continue Shopping</button>
        </div>
      </div>
    </div>
  );
}

// ─── Wishlist Page ─────────────────────────────────────────────────────────────
function WishlistPage({ wishlist, onNav, onAddToCart, onToggleWishlist }: {
  wishlist: number[]; onNav: (page: Page, extra?: { product?: Product }) => void;
  onAddToCart: (p: Product) => void; onToggleWishlist: (id: number) => void;
}) {
  const items = PRODUCTS.filter(p => wishlist.includes(p.id));
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <BackToHome onNav={() => onNav("home")} />
      <div className="flex items-center gap-3 mb-8">
        <Heart size={26} className="text-accent fill-accent" />
        <h1 className="font-playfair text-2xl sm:text-3xl font-semibold">My Wishlist</h1>
        {items.length > 0 && <span className="font-lato text-sm text-muted-foreground bg-muted px-2 py-0.5 rounded-full">({items.length} items)</span>}
      </div>
      {items.length === 0 ? (
        <div className="text-center py-24">
          <Heart size={56} className="mx-auto text-muted-foreground mb-4" />
          <h2 className="font-playfair text-2xl font-semibold mb-2">Your wishlist is empty</h2>
          <p className="font-lato text-sm text-muted-foreground mb-6">Save sarees you love — click the ♥ icon on any product</p>
          <button onClick={() => onNav("listing")} className="inline-flex items-center gap-2 bg-primary text-white font-lato font-bold text-sm uppercase px-6 py-3 rounded-xl hover:bg-accent shadow-md">
            Explore Sarees <ArrowRight size={14}/>
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map(p => (
              <ProductCard key={p.id} product={p}
                onSelect={pr => onNav("detail",{product:pr})}
                onAddToCart={onAddToCart} wishlist={wishlist} onToggleWishlist={onToggleWishlist} />
            ))}
          </div>
          <div className="mt-8 flex justify-center">
            <button onClick={() => onNav("listing")} className="inline-flex items-center gap-2 border border-primary text-primary font-lato font-bold text-sm uppercase px-6 py-3 rounded-xl hover:bg-primary hover:text-white transition-colors">
              Continue Shopping <ArrowRight size={14}/>
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Account Page ──────────────────────────────────────────────────────────────
function AccountPage({ onNav }: { onNav: (page: Page) => void }) {
  const [tab, setTab] = useState<"orders"|"tracking"|"addresses">("orders");
  const orders = [
    {id:"LR24-8821",date:"12 Jun 2024",items:2,total:21400,status:"Delivered",product:"Kanjivaram Temple Border + Chanderi Silk-Cotton"},
    {id:"LR24-7203",date:"3 May 2024", items:1,total:8900, status:"Delivered",product:"Banarasi Floral Georgette Saree"},
    {id:"LR24-6099",date:"18 Apr 2024",items:3,total:15600,status:"Delivered",product:"Cotton Tant + Mysore Crepe + Organza Saree"},
    {id:"LR24-9902",date:"29 Jun 2024",items:1,total:12500,status:"In Transit",product:"Kanjivaram Temple Border Saree"},
  ];
  const steps = [
    {label:"Order Placed",        date:"29 Jun 2024, 10:30 AM",done:true},
    {label:"Payment Confirmed",   date:"29 Jun 2024, 10:32 AM",done:true},
    {label:"Packed at Warehouse", date:"30 Jun 2024, 2:15 PM", done:true},
    {label:"Shipped via BlueDart",date:"1 Jul 2024, 9:00 AM",  done:true},
    {label:"Out for Delivery",    date:"3 Jul 2024, 8:45 AM",  done:false},
    {label:"Delivered",           date:"Expected: 3 Jul 2024", done:false},
  ];
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <BackToHome onNav={() => onNav("home")} />
      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/20"><User size={24} className="text-white"/></div>
        <div><h1 className="font-playfair text-xl font-semibold">Welcome, Priya!</h1><p className="font-lato text-sm text-muted-foreground">priya.subramaniam@gmail.com · Member since 2019</p></div>
      </div>
      <div className="flex gap-0 border-b border-border mb-8">
        {(["orders","tracking","addresses"] as const).map((t,i) => (
          <button key={t} onClick={() => setTab(t)}
            className={`font-lato text-sm px-5 py-3 border-b-2 transition-colors ${tab===t?"border-accent text-accent font-bold":"border-transparent text-muted-foreground hover:text-foreground"}`}>
            {["My Orders","Track Order","Saved Addresses"][i]}
          </button>
        ))}
      </div>
      {tab==="orders" && (
        <div className="space-y-4">
          {orders.map(o => (
            <div key={o.id} className="bg-card border border-border rounded-2xl p-5 hover:shadow-md transition-shadow">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-3"><span className="font-lato font-bold text-sm text-primary">#{o.id}</span>
                    <span className={`flex items-center gap-1 font-lato text-xs font-bold px-2 py-0.5 rounded-full ${o.status==="Delivered"?"bg-primary/10 text-primary":"bg-amber-50 text-amber-600"}`}>
                      {o.status==="Delivered"?<CheckCircle size={12}/>:<Truck size={12}/>} {o.status}
                    </span>
                  </div>
                  <p className="font-lato text-xs text-muted-foreground mt-1">{o.date} · {o.items} {o.items===1?"item":"items"}</p>
                  <p className="font-lato text-sm mt-1">{o.product}</p>
                </div>
                <div className="text-right">
                  <p className="font-lato font-bold text-primary text-xl">₹{o.total.toLocaleString("en-IN")}</p>
                  <button onClick={()=>setTab("tracking")} className="font-lato text-xs text-accent hover:underline mt-1 block">Track order →</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {tab==="tracking" && (
        <div className="max-w-lg">
          <div className="bg-card border border-border rounded-2xl p-5 mb-6">
            <div className="flex justify-between">
              <div><p className="font-lato text-xs text-muted-foreground">Order ID</p><p className="font-lato font-bold text-primary">#LR24-9902</p></div>
              <div className="text-right"><p className="font-lato text-xs text-muted-foreground">Expected Delivery</p><p className="font-lato font-bold text-sm">3 Jul 2024</p></div>
            </div>
            <p className="font-lato text-sm mt-2 text-muted-foreground">Kanjivaram Temple Border Saree</p>
          </div>
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border"/>
            {steps.map((s,i) => (
              <div key={i} className="flex gap-4 pb-7 last:pb-0">
                <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border-2 transition-all ${s.done?"bg-primary border-primary shadow-md shadow-primary/20":"bg-white border-border"}`}>
                  {s.done?<Check size={14} className="text-white"/>:<div className="w-2 h-2 rounded-full bg-border"/>}
                </div>
                <div className="pt-1">
                  <p className={`font-lato text-sm font-bold ${s.done?"text-foreground":"text-muted-foreground"}`}>{s.label}</p>
                  <p className="font-lato text-xs text-muted-foreground">{s.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {tab==="addresses" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {id:1,name:"Priya Subramaniam",line1:"42, 3rd Cross, T. Nagar",line2:"Chennai, TN – 600 017",isDefault:true},
            {id:2,name:"Priya Subramaniam",line1:"18, MG Road, Indiranagar",line2:"Bangalore, KA – 560 038",isDefault:false},
          ].map(addr => (
            <div key={addr.id} className={`bg-card border-2 rounded-2xl p-5 ${addr.isDefault?"border-primary shadow-md shadow-primary/10":"border-border"}`}>
              {addr.isDefault && <span className="font-lato text-[10px] font-bold uppercase bg-primary text-white px-2 py-0.5 rounded float-right">Default</span>}
              <div className="flex items-center gap-2 mb-3"><MapPin size={15} className="text-primary"/><p className="font-lato font-bold text-sm">{addr.name}</p></div>
              <p className="font-lato text-sm text-foreground">{addr.line1}</p>
              <p className="font-lato text-sm text-foreground">{addr.line2}</p>
              <div className="flex gap-3 mt-4">
                <button className="font-lato text-xs text-primary hover:underline font-semibold">Edit</button>
                {!addr.isDefault && <button className="font-lato text-xs text-muted-foreground hover:text-destructive">Delete</button>}
              </div>
            </div>
          ))}
          <button className="border-2 border-dashed border-border rounded-2xl p-5 flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-primary hover:text-primary transition-colors min-h-[140px]">
            <Plus size={24}/><span className="font-lato text-sm font-semibold">Add New Address</span>
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Static Pages ──────────────────────────────────────────────────────────────
function StaticPage({ slug, onNav }: { slug: StaticSlug; onNav: (page: Page, extra?: { staticSlug?: StaticSlug }) => void }) {
  const links: {label:string;slug:StaticSlug}[] = [
    {label:"About Us",slug:"about"},{label:"Contact Us",slug:"contact"},
    {label:"Shipping Policy",slug:"shipping"},{label:"Return & Refund",slug:"returns"},
    {label:"Privacy Policy",slug:"privacy"},{label:"Terms & Conditions",slug:"terms"},
  ];
  const titles: Record<StaticSlug,string> = {about:"About Us",contact:"Contact Us",shipping:"Shipping Policy",returns:"Return & Refund Policy",privacy:"Privacy Policy",terms:"Terms & Conditions"};

  const bodies: Record<StaticSlug, React.ReactNode> = {
    about: (
      <div className="space-y-5">
        <div className="flex justify-center mb-6">
          <div className="bg-white border border-border rounded-2xl px-8 py-4 shadow-sm">
            <img
              src={logoImage}
              alt="Lakshmiram's"
              style={{
                width: "260px",
                height: "104px",
                objectFit: "contain",
                objectPosition: "center",
                display: "block",
              }}
            />
          </div>
        </div>
        <p className="font-lato text-base leading-relaxed">Lakshmiram&apos;s was founded in 1972 by Shri Lakshminarayan Iyer on a single conviction: every Indian woman deserves a saree that tells a story. What started as a modest shop on Silk Merchants Street, T. Nagar, Chennai, has grown into one of South India&apos;s most trusted names in handwoven sarees.</p>
        <p className="font-lato text-base leading-relaxed">For over five decades, we have worked directly with master weavers across Tamil Nadu, Varanasi, Odisha, Maharashtra, and West Bengal. Every saree in our collection is ethically sourced, authentically woven, and carries a certificate of provenance.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
          {["Authenticity — Only genuine handwoven sarees with GI tags where applicable.","Weaver welfare — Artisans earn fair wages and we invest in the next generation.","Sustainability — Natural dyes, peace silk, and organic cotton where possible.","Customer trust — 50+ years of repeat customers speak louder than any advertisement."].map((v,i) => (
            <div key={i} className="flex items-start gap-2 bg-muted rounded-xl p-3"><Check size={14} className="text-primary mt-0.5 flex-shrink-0"/><p className="font-lato text-sm">{v}</p></div>
          ))}
        </div>
      </div>
    ),
    contact: (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <div className="space-y-5">
          {([
            [<MapPin size={18}/>, "Store Address", "42, Silk Merchants Street, T. Nagar\nChennai – 600 017\nMon–Sat: 9:30 AM – 8:30 PM"],
            [<Phone size={18}/>, "Phone", "+91 98765 43210"],
            [<Mail size={18}/>, "Email", "care@lakshmiramsarees.com"],
          ] as [React.ReactNode,string,string][]).map(([icon,label,text],i) => (
            <div key={i} className="flex gap-3">
              <div className="p-2 bg-muted rounded-xl text-primary flex-shrink-0 h-fit">{icon}</div>
              <div><p className="font-lato font-bold text-sm">{label}</p><p className="font-lato text-sm text-muted-foreground whitespace-pre-line">{text}</p></div>
            </div>
          ))}
        </div>
        <div className="bg-card border border-border rounded-2xl p-5 space-y-3">
          <h3 className="font-playfair font-semibold text-lg">Send a Message</h3>
          {["Name","Email","Phone"].map(f => <input key={f} placeholder={f} className="w-full px-3 py-2.5 font-lato text-sm border border-border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary/30"/>)}
          <textarea placeholder="Your message" rows={4} className="w-full px-3 py-2.5 font-lato text-sm border border-border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"/>
          <button className="w-full py-3 bg-primary text-white font-lato font-bold text-sm uppercase rounded-xl hover:bg-accent transition-colors shadow-md">Send Message</button>
        </div>
      </div>
    ),
    shipping: <div className="space-y-4">{[["Free Shipping","All orders above ₹2,000 qualify for free standard shipping across India."],["Standard Delivery","4–7 business days to metro cities; 6–10 business days to tier-2 and tier-3 cities."],["Express Delivery","Available for ₹250 extra in metros. Delivery within 2–3 business days."],["Packaging","Each saree is wrapped in silk cloth and placed in a branded box with a certificate of authenticity."],["Tracking","SMS and email with tracking link once your order is dispatched."],["International","We ship to USA, UK, Canada, Singapore, UAE, and Australia. Duties are buyer's responsibility."]].map(([t,text]) => <div key={t as string} className="p-4 bg-muted rounded-xl"><p className="font-lato text-sm"><strong className="text-primary">{t}</strong> — {text}</p></div>)}</div>,
    returns: <div className="space-y-4">{[["7-Day Returns","Unworn, unwashed sarees in original packaging may be returned within 7 days of delivery."],["Eligibility","Tags intact. Customised or sale items below 50% MRP are not eligible."],["Process","Log in, go to My Orders, select Return Item. Free pickup will be arranged within 2 business days."],["Refunds","Processed within 5–7 business days. COD orders get store credit or NEFT transfer."],["Exchanges","Free first exchange for different size or colour, subject to availability."]].map(([t,text]) => <div key={t as string} className="p-4 bg-muted rounded-xl"><p className="font-lato text-sm"><strong className="text-primary">{t}</strong> — {text}</p></div>)}</div>,
    privacy: <div className="space-y-4"><p className="font-lato text-sm leading-relaxed text-muted-foreground">Lakshmiram&apos;s Sarees Pvt. Ltd. is committed to protecting your personal information. This policy describes how we collect, use, and safeguard your data.</p>{[["Information We Collect","Name, contact details, shipping address, and payment information (processed via Razorpay — we never store card details)."],["How We Use It","To process orders, send updates, personalise recommendations, and improve our services."],["Sharing","We do not sell your data. Shared only with logistics partners and payment gateways under confidentiality agreements."],["Your Rights","Request access, correction, or deletion by emailing privacy@lakshmiramsarees.com."],["Cookies","Used for session management and analytics. Disable in browser settings if preferred."]].map(([t,text]) => <div key={t as string} className="p-4 bg-muted rounded-xl"><p className="font-lato text-sm"><strong className="text-primary">{t}</strong> — {text}</p></div>)}</div>,
    terms: <div className="space-y-4"><p className="font-lato text-sm text-muted-foreground leading-relaxed">By accessing lakshmiramsarees.com, you agree to these Terms & Conditions.</p>{[["Products","All sarees are handwoven; minor variations in colour and texture are inherent to handcraft and are not defects."],["Pricing","Prices are in Indian Rupees inclusive of GST. We reserve the right to change prices without notice."],["Orders","Confirmed only upon payment receipt. We may cancel due to stock unavailability with full refund."],["Intellectual Property","All content is exclusive property of Lakshmiram's Sarees Pvt. Ltd."],["Governing Law","Governed by Indian law. Disputes subject to exclusive jurisdiction of courts in Chennai, Tamil Nadu."]].map(([t,text]) => <div key={t as string} className="p-4 bg-muted rounded-xl"><p className="font-lato text-sm"><strong className="text-primary">{t}</strong> — {text}</p></div>)}</div>,
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <BackToHome onNav={() => onNav("home")} />
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        <aside className="lg:col-span-1">
          <nav className="bg-card border border-border rounded-2xl overflow-hidden sticky top-24 shadow-sm">
            {links.map(l => (
              <button key={l.slug} onClick={() => onNav("static",{staticSlug:l.slug})}
                className={`w-full text-left px-4 py-3.5 font-lato text-sm border-b border-border last:border-b-0 transition-colors ${slug===l.slug?"bg-primary text-white font-bold":"text-foreground hover:bg-muted"}`}>
                {l.label}
              </button>
            ))}
          </nav>
        </aside>
        <main className="lg:col-span-3">
          <h1 className="font-playfair text-2xl sm:text-3xl font-semibold mb-6 pb-4 border-b border-border">{titles[slug]}</h1>
          {bodies[slug]}
        </main>
      </div>
    </div>
  );
}

// ─── App Shell ─────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [staticSlug, setStaticSlug] = useState<StaticSlug>("about");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useCallback((nextPage: Page, extra?: { category?: string; product?: Product; staticSlug?: StaticSlug }) => {
    setPage(nextPage);
    if (extra?.category !== undefined) setSelectedCategory(extra.category);
    if (extra?.product !== undefined) setSelectedProduct(extra.product);
    if (extra?.staticSlug !== undefined) setStaticSlug(extra.staticSlug);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const addToCart = useCallback((product: Product, qty = 1) => {
    setCart(prev => {
      const ex = prev.find(c => c.product.id === product.id);
      if (ex) return prev.map(c => c.product.id === product.id ? {...c, quantity: c.quantity + qty} : c);
      return [...prev, { product, quantity: qty }];
    });
  }, []);

  const updateCartQty = useCallback((id: number, qty: number) => {
    if (qty < 1) { setCart(prev => prev.filter(c => c.product.id !== id)); return; }
    setCart(prev => prev.map(c => c.product.id === id ? {...c, quantity: qty} : c));
  }, []);

  const toggleWishlist = useCallback((id: number) => {
    setWishlist(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }, []);

  const cartCount = cart.reduce((s, c) => s + c.quantity, 0);

  return (
    <div className="min-h-screen bg-background flex flex-col font-lato">
      <Header
        cartCount={cartCount}
        wishlistCount={wishlist.length}
        onNav={navigate}
        onSearchOpen={() => { setSearchOpen(true); setSearchQuery(""); }}
      />

      {searchOpen && (
        <SearchOverlay
          query={searchQuery}
          setQuery={setSearchQuery}
          onClose={() => setSearchOpen(false)}
          onSelect={p => { navigate("detail", { product: p }); setSearchOpen(false); }}
        />
      )}

      <main className="flex-1">
        {page === "home" && <HomePage onNav={navigate} onAddToCart={addToCart} wishlist={wishlist} onToggleWishlist={toggleWishlist} />}
        {page === "listing" && <ListingPage key={selectedCategory} initialCategory={selectedCategory} onNav={navigate} onAddToCart={addToCart} wishlist={wishlist} onToggleWishlist={toggleWishlist} />}
        {page === "detail" && selectedProduct && <DetailPage product={selectedProduct} onAddToCart={addToCart} onNav={navigate} wishlist={wishlist} onToggleWishlist={toggleWishlist} />}
        {page === "cart" && <CartPage cart={cart} onUpdateQty={updateCartQty} onRemove={id => setCart(prev => prev.filter(c => c.product.id !== id))} onNav={navigate} />}
        {page === "wishlist" && <WishlistPage wishlist={wishlist} onNav={navigate} onAddToCart={addToCart} onToggleWishlist={toggleWishlist} />}
        {page === "account" && <AccountPage onNav={navigate} />}
        {page === "static" && <StaticPage slug={staticSlug} onNav={navigate} />}
      </main>

      <Footer onNav={navigate} />
    </div>
  );
}
