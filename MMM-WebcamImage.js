Module.register("MMM-WebcamImage", {

  defaults: {
    url: "",
    refreshInterval: 1000,
    width: null,
    height: null,
  },

  getStyles() {
    return ["MMM-WebcamImage.css"]
  },

  start() {
    this.dataUrl = null
    this.loading = true
    this.error = null

    if (this.config.url) {
      this.fetchImage()
      setInterval(() => this.fetchImage(), this.config.refreshInterval)
    }
  },

  getDom() {
    const wrapper = document.createElement("div")
    wrapper.className = "MMM-WebcamImage"

    if (!this.config.url) {
      wrapper.innerText = "MMM-WebcamImage: no URL configured."
      return wrapper
    }

    if (this.dataUrl) {
      const img = document.createElement("img")
      img.src = this.dataUrl
      if (this.config.width) { img.style.width = this.config.width }
      if (this.config.height) { img.style.height = this.config.height }
      wrapper.appendChild(img)
    } else if (this.error) {
      wrapper.innerText = `MMM-WebcamImage error: ${this.error}`
    } else if (this.loading) {
      wrapper.innerText = "Loading..."
    }

    return wrapper
  },

  socketNotificationReceived(notification, payload) {
    if (notification === "IMAGE_DATA") {
      this.dataUrl = payload.dataUrl
      this.loading = false
      this.error = null
      this.updateDom()
    } else if (notification === "IMAGE_ERROR") {
      this.error = payload.message
      this.loading = false
      Log.error("MMM-WebcamImage error:", payload.message)
      this.updateDom()
    }
  },

  fetchImage() {
    this.sendSocketNotification("FETCH_IMAGE", { url: this.config.url })
  },
})
