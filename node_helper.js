const NodeHelper = require("node_helper")
const http = require("http")
const https = require("https")

module.exports = NodeHelper.create({

  socketNotificationReceived(notification, payload) {
    if (notification === "FETCH_IMAGE") {
      this.fetchImage(payload.url)
    }
  },

  fetchImage(url) {
    const client = url.startsWith("https") ? https : http
    client.get(url, (response) => {
      const chunks = []
      response.on("data", chunk => chunks.push(chunk))
      response.on("end", () => {
        if (response.statusCode < 200 || response.statusCode >= 300) {
          this.sendSocketNotification("IMAGE_ERROR", { message: `HTTP ${response.statusCode} ${response.statusMessage}` })
          return
        }
        const contentType = response.headers["content-type"] || "image/jpeg"
        const base64 = Buffer.concat(chunks).toString("base64")
        this.sendSocketNotification("IMAGE_DATA", { dataUrl: `data:${contentType};base64,${base64}` })
      })
    }).on("error", (error) => {
      this.sendSocketNotification("IMAGE_ERROR", { message: error.message })
    })
  },
})
