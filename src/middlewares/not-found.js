module.exports = (req, res) => {
  res.status(404).json({ message: "resources not found ont this server" });
};
