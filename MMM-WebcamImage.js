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
    this.blobUrl = null

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

    if (this.blobUrl) {
      const img = document.createElement("img")
      img.src = this.blobUrl
      if (this.config.width) { img.style.width = this.config.width }
      if (this.config.height) { img.style.height = this.config.height }
      wrapper.appendChild(img)
    }

    return wrapper
  },

  fetchImage() {
    fetch(this.config.url, { cache: "no-store" })
      .then(response => response.blob())
      .then((blob) => {
        const prevBlobUrl = this.blobUrl
        this.blobUrl = URL.createObjectURL(blob)
        this.updateDom()
        if (prevBlobUrl) { URL.revokeObjectURL(prevBlobUrl) }
      })
      .catch(error => Log.error("MMM-WebcamImage fetch error:", error))
  },
})
