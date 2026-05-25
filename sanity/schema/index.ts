// Objects
import link from './objects/link';
import blockContent from './objects/blockContent';
import galleryItem from './objects/galleryItem';

// Documents
import home from './documents/home';
import page from './documents/page';
import settings from './documents/settings';
import project from './documents/project';
import projects from './documents/projects';
import service from './documents/service';

// Sections
import homeHero from './sections/homeHero';
import textAndImage from './sections/textAndImage';
import ourClients from './sections/ourClients';
import servicesCTA from './sections/servicesCTA';
import contactCTA from './sections/contactCTA';
import generalHero from './sections/generalHero';
import aboutUs from './sections/aboutUs';
import ourTeam from './sections/ourTeam';
import contactUs from './sections/contactUs';
import featuredProjects from './sections/featuredProjects';
import termsAndConditions from './sections/termsAndConditions';
import servicesDescription from './sections/servicesDescription';

const objects = [
  link,
  blockContent,
  galleryItem,
]
const documents = [
  home,
  page,
  settings,
  project,
  projects,
  service
]
const sections = [
  homeHero,
  textAndImage,
  ourClients,
  servicesCTA,
  contactCTA,
  generalHero,
  aboutUs,
  ourTeam,
  contactUs,
  termsAndConditions,
  featuredProjects,
  servicesDescription, 
]

export const schema = [
  ...objects,
  ...documents,
  ...sections,
]
