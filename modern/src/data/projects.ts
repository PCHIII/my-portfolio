export type Project = {
  title: string;
  description: string;
  href?: string;
  repo?: string;
  repoDisabled?: boolean;
  image?: {
    src: string;
    alt: string;
  };
  tags: string[];
};

export const projects: Project[] = [
  {
    title: "My Portfolio",
    description: "Modern Astro + Tailwind portfolio deployed via GitHub Pages.",
    href: "https://treyhelmer.com/",
    repo: "https://github.com/PCHIII/my-portfolio",
    repoDisabled: true,
    image: { src: "/projects/my-portfolio.svg", alt: "My Portfolio homepage" },
    tags: ["Astro", "Tailwind CSS", "GitHub Actions", "GitHub Pages"],
  },
  {
    title: "Atlantus Partners",
    description: "Marketing site for Atlantus Partners.",
    href: "https://www.atlantuspartners.com/",
    repo: "https://github.com/PCHIII/Atlantus",
    repoDisabled: true,
    image: { src: "/projects/atlantus.svg", alt: "Atlantus Partners homepage" },
    tags: ["HTML", "CSS", "JavaScript", "Bootstrap 5", "Font Awesome"],
  },
  {
    title: "Psychic Game",
    description: "The first App I ever made.",
    href: "https://pchiii.github.io/psychic-game/",
    repo: "https://github.com/PCHIII/psychic-game",
    image: { src: "/projects/psychic.jpg", alt: "Psychic Game screenshot" },
    tags: ["JavaScript", "HTML", "CSS"],
  },
  {
    title: "Crystal Collector",
    description: "Number Generator Game: JQuery, Bootstrap, Javascript.",
    href: "https://pchiii.github.io/unit-4-game/",
    repo: "https://github.com/PCHIII/unit-4-game",
    image: { src: "/projects/crystal.jpg", alt: "Crystal Collector screenshot" },
    tags: ["jQuery", "Bootstrap", "JavaScript"],
  },
  {
    title: "Trivia Game",
    description: "Trivia Game: Bootstrap, JQuery, Javascript.",
    href: "https://pchiii.github.io/Trivia-Game/",
    repo: "https://github.com/PCHIII/Trivia-Game",
    image: { src: "/projects/swayze.JPG", alt: "Trivia Game screenshot" },
    tags: ["Bootstrap", "jQuery", "JavaScript"],
  },
  {
    title: "Word Guess",
    description: "Hangman-like Word Guessing Game: Bootstrap, Javascript, Audio.",
    href: "https://pchiii.github.io/word_guess/",
    repo: "https://github.com/PCHIII/word_guess",
    image: { src: "/projects/golfguess.JPG", alt: "Word Guess screenshot" },
    tags: ["JavaScript", "Bootstrap"],
  },
  {
    title: "GifTastic",
    description: "A GIF App takes in user request and display GIFS, using Giphy APi.",
    href: "https://pchiii.github.io/giftastic/",
    repo: "https://github.com/PCHIII/giftastic",
    image: { src: "/projects/giftastic.JPG", alt: "GifTastic screenshot" },
    tags: ["API", "JavaScript", "jQuery"],
  },
  {
    title: "Train Scheduler",
    description:
      "Train Sceduler App that calculates arrival and departure times: jQuery, Firebase, Moment.js.",
    href: "https://pchiii.github.io/Train-Scheduler/",
    repo: "https://github.com/PCHIII/Train-Scheduler",
    image: { src: "/projects/train-station1.jpg", alt: "Train Scheduler screenshot" },
    tags: ["Firebase", "Moment.js", "jQuery"],
  },
  {
    title: "Libre (Project 1)",
    description: "API Search App to find Movies & Books.",
    href: "https://pchiii.github.io/Project-1/",
    repo: "https://github.com/PCHIII/Project-1",
    image: { src: "/projects/libre.jpg", alt: "Libre screenshot" },
    tags: ["API", "JavaScript", "Team"],
  },
  {
    title: "LIRI Bot",
    description: "Node app that takes in parameters and gives you back data.",
    repo: "https://github.com/PCHIII/liri-bot-app",
    image: { src: "/projects/node.png", alt: "Node project icon" },
    tags: ["Node.js", "CLI"],
  },
  {
    title: "Bamazon",
    description:
      "Amazon-like Storefront using Node.js and MySQL to store, request, and display data.",
    repo: "https://github.com/PCHIII/bamazon",
    image: { src: "/projects/Amazon-logo.jpg", alt: "Bamazon logo" },
    tags: ["Node.js", "MySQL", "CLI"],
  },
  {
    title: "FriendFinder",
    description: "Dating - Friendfinder App.",
    href: "https://afternoon-dawn-41677.herokuapp.com/",
    repo: "https://github.com/PCHIII/friendfinder",
    image: { src: "/projects/friendfinder.JPG", alt: "FriendFinder screenshot" },
    tags: ["Node.js", "Express", "Heroku"],
  },
  {
    title: "Burger Logger",
    description:
      "A Burger creator and logger App: MySQL, Node, Express, Handlebars and a ORM that follows MVC design pattern.",
    href: "https://gtburgr.herokuapp.com/",
    repo: "https://github.com/PCHIII/burger",
    image: { src: "/projects/burger.jpg", alt: "Burger Logger screenshot" },
    tags: ["Node.js", "MySQL", "Handlebars"],
  },
  {
    title: "Whisper It",
    description:
      "An Anonymous Forum built with Handlebars, Material Design for Bootstrap, Sequalize, Font Awesome.",
    href: "https://whisper-it.herokuapp.com/",
    repo: "https://github.com/PCHIII/whisper-it",
    image: { src: "/projects/whisperIT.jpg", alt: "Whisper It screenshot" },
    tags: ["Sequelize", "Handlebars", "Heroku"],
  },
  {
    title: "News Scraper",
    description: "News-scraper App: Cheerio, Axios, Express, Handlebars.",
    href: "https://news-scraperdb.herokuapp.com/",
    repo: "https://github.com/PCHIII/News-Scrape",
    image: { src: "/projects/nyt.JPG", alt: "News Scraper screenshot" },
    tags: ["Cheerio", "Express", "Handlebars"],
  },
  {
    title: "Clicky Game",
    description: "Click Event Game built with React with Audio.",
    href: "https://pchiii.github.io/deployedclicky/",
    repo: "https://github.com/PCHIII/deployedclicky",
    image: { src: "/projects/Cowboys.JPG", alt: "Clicky Game screenshot" },
    tags: ["React", "GitHub Pages"],
  },
  {
    title: "HelloWorld Community",
    description: "A Chatroom built with React, Mongoose, Passport, Sockit.io, Font Awesome.",
    href: "https://helloworld-community.herokuapp.com/",
    repo: "https://github.com/catnap89/HelloWorld_v2",
    image: { src: "/projects/chatz.JPG", alt: "Chat app screenshot" },
    tags: ["React", "Socket.io", "MongoDB"],
  },
  {
    title: "Certificate",
    description: "WooHoo!!!!!!!",
    image: { src: "/projects/cert.jpg", alt: "Certificate" },
    tags: ["Milestone"],
  }
];
