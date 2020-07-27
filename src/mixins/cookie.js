export default {
  methods: {
    getCookie(cname) {
      var name = cname + "="
      var decodedCookie = decodeURIComponent(document.cookie)
      var ca = decodedCookie.split(';')
      for (var i = 0; i < ca.length; i++) {
        var c = ca[i]
        while (c.charAt(0) === ' ') {
          c = c.substring(1)
        }
        if (c.indexOf(name) === 0) {
          const cookie = c.substring(name.length, c.length)
          console.log(`Got cookie: ${cookie} for ${cname}`)
          return cookie
        }
      }
      console.log(`Got no cookie for ${cname}`)
      return ""
    }
  }
}
