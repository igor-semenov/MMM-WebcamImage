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

    if (this.blobUrl) {
      const img = document.createElement("img")
      img.src = this.blobUrl
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

  fetchImage() {
    fetch(this.config.url, { cache: "no-store" })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status} ${response.statusText}`)
        }
        return response.blob()
      })
      .then((blob) => {
        const prevBlobUrl = this.blobUrl
        this.blobUrl = URL.createObjectURL(blob)
        this.loading = false
        this.error = null
        this.updateDom()
        if (prevBlobUrl) { URL.revokeObjectURL(prevBlobUrl) }
      })
      .catch((error) => {
        this.error = error.message
        this.loading = false
        Log.error("MMM-WebcamImage fetch error:", error)
        this.updateDom()
      })
  },
})
