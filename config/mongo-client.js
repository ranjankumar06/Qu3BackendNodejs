const { MongoClient } = require('mongodb');

class MongoCli {
  constructor() {
    let url = `mongodb://127.0.0.1:27017/quedatabase`;
    this.client = new MongoClient(url, { useUnifiedTopology: true });
  }

  async init() {
    if (this.client) {
      await this.client.connect();
      this.db = this.client.db('quedatabase');
    } else
      console.warn("Client is not initialized properly");
  }
}

module.exports = new MongoCli();