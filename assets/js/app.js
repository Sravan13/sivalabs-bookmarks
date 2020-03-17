var app = new Vue({
  el: "#app",
  data: {
    message: "",
    searchKey: "",
    selectedTag: "",
    bookmarksJson: { metadata: {}, data: [] }
  },
  created() {
    var self = this;
    $.getJSON("data/bookmarks.json", data => {
      console.log(data, self.bookmarksJson);
      Object.assign(self.bookmarksJson, data);
      console.log(self.bookmarksJson);
    });
  },
  methods: {
    search: function() {
      //alert("search for: " + this.searchKey);
      this.searchKey = $("#searchKey").val();
      if (this.searchKey !== "") {
        this.message = "Search results for " + this.searchKey;
      } else {
        this.message = "";
      }
      this.selectedTag = "";
    },
    showByTag: function(tag) {
      //alert("showByTag: " + tag);
      this.searchKey = "";
      $("#searchKey").val("");
      this.selectedTag = tag;
      this.message = "Bookmarks with tag " + this.selectedTag;
    }
  },
  computed: {
    allTags: function() {
      var tags = this.bookmarksJson.data.map(b => b.tags).flat();
      return tags.filter(function(item, pos) {
        return tags.indexOf(item) == pos;
      });
    },
    visibleBookmarks: function() {
      if (this.searchKey !== "") {
        return this.bookmarksJson.data.filter(b =>
          b.title.toLowerCase().includes(this.searchKey.toLowerCase())
        );
      }
      if (this.selectedTag !== "") {
        return this.bookmarksJson.data.filter(b =>
          b.tags.includes(this.selectedTag)
        );
      }
      return this.bookmarksJson.data;
    }
  }
});
