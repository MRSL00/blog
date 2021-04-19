module.exports = {
  Url: "mongodb://localhost:27017/bestArticles",
  Use: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  },
  CheckConnection: (err) => {
    if (err) return console.log("[!] Database connection failed.");
    console.log("[+] Database connected succesfully.");
  },
};
